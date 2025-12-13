import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  Users, 
  Truck, 
  TrendingUp, 
  LogOut,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Pickup {
  id: string;
  address: string;
  waste_type: string;
  pickup_date: string;
  status: string;
  estimated_weight_kg: number | null;
  user_id: string;
}

interface DeliveryPartner {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  is_available: boolean | null;
  vehicle_type: string | null;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [partners, setPartners] = useState<DeliveryPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPickups: 0,
    pendingPickups: 0,
    completedPickups: 0,
    activePartners: 0
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
      return;
    }

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single();

    if (roleData?.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges",
        variant: "destructive"
      });
      navigate('/home');
      return;
    }

    fetchData();
  };

  const fetchData = async () => {
    setLoading(true);
    
    const [pickupsRes, partnersRes] = await Promise.all([
      supabase.from('pickups').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').not('vehicle_type', 'is', null)
    ]);

    if (pickupsRes.data) {
      setPickups(pickupsRes.data);
      setStats(prev => ({
        ...prev,
        totalPickups: pickupsRes.data.length,
        pendingPickups: pickupsRes.data.filter(p => p.status === 'pending').length,
        completedPickups: pickupsRes.data.filter(p => p.status === 'completed').length
      }));
    }

    if (partnersRes.data) {
      setPartners(partnersRes.data);
      setStats(prev => ({
        ...prev,
        activePartners: partnersRes.data.filter(p => p.is_available).length
      }));
    }

    setLoading(false);
  };

  const updatePickupStatus = async (pickupId: string, status: string) => {
    const { error } = await supabase
      .from('pickups')
      .update({ status })
      .eq('id', pickupId);

    if (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Pickup status updated" });
      fetchData();
    }
  };

  const assignPartner = async (pickupId: string, partnerId: string) => {
    const { error } = await supabase
      .from('delivery_assignments')
      .insert({
        pickup_id: pickupId,
        delivery_partner_id: partnerId,
        status: 'assigned'
      });

    if (error) {
      toast({ title: "Error", description: "Failed to assign partner", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Partner assigned successfully" });
      updatePickupStatus(pickupId, 'assigned');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'assigned': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage pickups and delivery partners</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalPickups}</p>
                  <p className="text-sm text-muted-foreground">Total Pickups</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.pendingPickups}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.completedPickups}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Truck className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.activePartners}</p>
                  <p className="text-sm text-muted-foreground">Active Partners</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pickups" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pickups">Pickups</TabsTrigger>
            <TabsTrigger value="partners">Delivery Partners</TabsTrigger>
          </TabsList>

          <TabsContent value="pickups" className="space-y-4">
            {pickups.map((pickup) => (
              <Card key={pickup.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getStatusColor(pickup.status || 'pending')}>
                          {pickup.status || 'pending'}
                        </Badge>
                        <Badge variant="outline">{pickup.waste_type}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {pickup.address}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Date: {new Date(pickup.pickup_date).toLocaleDateString()}
                        {pickup.estimated_weight_kg && ` • Est. Weight: ${pickup.estimated_weight_kg}kg`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {pickup.status === 'pending' && (
                        <>
                          <select 
                            className="border rounded px-2 py-1 text-sm"
                            onChange={(e) => e.target.value && assignPartner(pickup.id, e.target.value)}
                            defaultValue=""
                          >
                            <option value="">Assign Partner</option>
                            {partners.filter(p => p.is_available).map(p => (
                              <option key={p.id} value={p.user_id}>
                                {p.first_name} {p.last_name}
                              </option>
                            ))}
                          </select>
                        </>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updatePickupStatus(pickup.id, 'completed')}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updatePickupStatus(pickup.id, 'cancelled')}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="partners" className="space-y-4">
            {partners.map((partner) => (
              <Card key={partner.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{partner.first_name} {partner.last_name}</p>
                      <p className="text-sm text-muted-foreground">
                        Vehicle: {partner.vehicle_type || 'Not specified'}
                      </p>
                    </div>
                    <Badge variant={partner.is_available ? "default" : "secondary"}>
                      {partner.is_available ? 'Available' : 'Busy'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
