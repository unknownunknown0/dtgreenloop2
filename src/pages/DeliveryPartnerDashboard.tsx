import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Package, 
  LogOut,
  MapPin,
  Clock,
  CheckCircle,
  Navigation,
  RefreshCw,
  Phone
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import DeliveryMap from '@/components/DeliveryMap';

interface Assignment {
  id: string;
  pickup_id: string;
  status: string | null;
  route_order: number | null;
  pickup: {
    id: string;
    address: string;
    waste_type: string;
    pickup_date: string;
    latitude: number | null;
    longitude: number | null;
    estimated_weight_kg: number | null;
  };
}

const DeliveryPartnerDashboard = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkPartnerAccess();
  }, []);

  const checkPartnerAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
      return;
    }

    setUserId(session.user.id);

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single();

    if (roleData?.role !== 'delivery_partner') {
      toast({
        title: "Access Denied",
        description: "You don't have delivery partner privileges",
        variant: "destructive"
      });
      navigate('/home');
      return;
    }

    // Get current availability status
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_available')
      .eq('user_id', session.user.id)
      .single();

    if (profile) {
      setIsAvailable(profile.is_available ?? true);
    }

    fetchAssignments(session.user.id);
  };

  const fetchAssignments = async (partnerId: string) => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('delivery_assignments')
      .select(`
        id,
        pickup_id,
        status,
        route_order,
        pickup:pickups (
          id,
          address,
          waste_type,
          pickup_date,
          latitude,
          longitude,
          estimated_weight_kg
        )
      `)
      .eq('delivery_partner_id', partnerId)
      .order('route_order', { ascending: true });

    if (data) {
      // Transform data to match Assignment interface
      const transformedData = data.map(item => ({
        ...item,
        pickup: Array.isArray(item.pickup) ? item.pickup[0] : item.pickup
      })) as Assignment[];
      setAssignments(transformedData);
    }

    setLoading(false);
  };

  const updateAssignmentStatus = async (assignmentId: string, status: string, pickupId: string) => {
    const { error } = await supabase
      .from('delivery_assignments')
      .update({ 
        status,
        ...(status === 'in_progress' ? { started_at: new Date().toISOString() } : {}),
        ...(status === 'completed' ? { completed_at: new Date().toISOString() } : {})
      })
      .eq('id', assignmentId);

    if (!error) {
      // Also update pickup status
      await supabase
        .from('pickups')
        .update({ status })
        .eq('id', pickupId);

      toast({ title: "Status Updated", description: `Pickup marked as ${status}` });
      if (userId) fetchAssignments(userId);
    }
  };

  const toggleAvailability = async (available: boolean) => {
    if (!userId) return;

    const { error } = await supabase
      .from('profiles')
      .update({ is_available: available })
      .eq('user_id', userId);

    if (!error) {
      setIsAvailable(available);
      toast({ 
        title: available ? "You're now available" : "You're now offline",
        description: available ? "You can receive new assignments" : "You won't receive new assignments"
      });
    }
  };

  const openNavigation = (address: string, lat?: number | null, lng?: number | null) => {
    let url: string;
    if (lat && lng) {
      url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    } else {
      url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
    }
    window.open(url, '_blank');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'assigned': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const pendingAssignments = assignments.filter(a => a.status !== 'completed');
  const completedAssignments = assignments.filter(a => a.status === 'completed');

  // Get pickup locations for the map
  const pickupLocations = pendingAssignments
    .filter(a => a.pickup?.latitude && a.pickup?.longitude)
    .map(a => ({
      id: a.id,
      lat: a.pickup.latitude!,
      lng: a.pickup.longitude!,
      address: a.pickup.address,
      wasteType: a.pickup.waste_type,
      status: a.status || 'assigned'
    }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto p-4"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Delivery Dashboard</h1>
            <p className="text-muted-foreground">Manage your pickups</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Available</span>
              <Switch 
                checked={isAvailable} 
                onCheckedChange={toggleAvailability}
              />
            </div>
            <Button variant="outline" size="icon" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{pendingAssignments.length}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-500">{completedAssignments.length}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-500">{assignments.length}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>
        </div>

        {/* Map */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Route Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DeliveryMap locations={pickupLocations} />
          </CardContent>
        </Card>

        {/* Assignments List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Today's Pickups</h2>
          {pendingAssignments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No pending pickups</p>
              </CardContent>
            </Card>
          ) : (
            pendingAssignments.map((assignment, index) => (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </span>
                          <Badge className={getStatusColor(assignment.status)}>
                            {assignment.status || 'assigned'}
                          </Badge>
                          <Badge variant="outline">{assignment.pickup?.waste_type}</Badge>
                        </div>
                        <p className="text-sm font-medium mb-1">{assignment.pickup?.address}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {assignment.pickup?.pickup_date && new Date(assignment.pickup.pickup_date).toLocaleDateString()}
                          </span>
                          {assignment.pickup?.estimated_weight_kg && (
                            <span>~{assignment.pickup.estimated_weight_kg}kg</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openNavigation(
                            assignment.pickup?.address || '',
                            assignment.pickup?.latitude,
                            assignment.pickup?.longitude
                          )}
                        >
                          <Navigation className="w-4 h-4" />
                        </Button>
                        {assignment.status === 'assigned' && (
                          <Button 
                            size="sm"
                            onClick={() => updateAssignmentStatus(assignment.id, 'in_progress', assignment.pickup_id)}
                          >
                            Start
                          </Button>
                        )}
                        {assignment.status === 'in_progress' && (
                          <Button 
                            size="sm"
                            className="bg-green-500 hover:bg-green-600"
                            onClick={() => updateAssignmentStatus(assignment.id, 'completed', assignment.pickup_id)}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DeliveryPartnerDashboard;
