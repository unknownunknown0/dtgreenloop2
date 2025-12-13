import { motion } from "framer-motion";

interface RecycleIconProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

const RecycleIcon = ({ size = 120, className = "" }: RecycleIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <motion.path
        d="M60 10C32.4 10 10 32.4 10 60C10 75 17 88 28 96"
        stroke="hsl(145 70% 45%)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      <motion.ellipse
        cx="65" cy="18" rx="8" ry="14"
        fill="hsl(145 70% 45%)"
        transform="rotate(30 65 18)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      />
      <motion.ellipse
        cx="78" cy="25" rx="5" ry="9"
        fill="hsl(145 70% 50%)"
        transform="rotate(45 78 25)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.4 }}
      />
      <motion.path
        d="M60 35L45 55H55V70H65V55H75L60 35Z"
        fill="hsl(145 70% 40%)"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      />
      <motion.path
        d="M40 75L35 55L50 60L47 68L58 80L48 85L40 75Z"
        fill="hsl(145 70% 35%)"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      />
      <motion.path
        d="M80 75L85 55L70 60L73 68L62 80L72 85L80 75Z"
        fill="hsl(145 70% 45%)"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      />
      <motion.circle
        cx="60" cy="65" r="8"
        fill="hsl(145 70% 42%)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.9, duration: 0.3 }}
      />
    </svg>
  );
};

export default RecycleIcon;
