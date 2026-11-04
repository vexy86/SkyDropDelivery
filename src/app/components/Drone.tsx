import { motion } from 'motion/react';

interface DroneProps {
  color: string;
  hasShield?: boolean;
}

export function Drone({ color, hasShield }: DroneProps) {
  return (
    <div className="relative w-20 h-16">
      {/* Shield Effect */}
      {hasShield && (
        <motion.div
          className="absolute inset-0 -m-2"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="w-full h-full rounded-full border-4 border-[#A5D8FF] bg-[#A5D8FF]/20" />
        </motion.div>
      )}

      {/* Drone */}
      <svg
        viewBox="0 0 80 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-lg"
      >
        {/* Propeller glow effects */}
        <motion.circle
          cx="15"
          cy="18"
          r="8"
          fill={color}
          opacity="0.3"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 0.3, repeat: Infinity }}
        />
        <motion.circle
          cx="65"
          cy="18"
          r="8"
          fill={color}
          opacity="0.3"
          animate={{ opacity: [0.5, 0.2, 0.5] }}
          transition={{ duration: 0.3, repeat: Infinity }}
        />

        {/* Left arm */}
        <rect x="10" y="26" width="25" height="4" rx="2" fill={color} />
        
        {/* Right arm */}
        <rect x="45" y="26" width="25" height="4" rx="2" fill={color} />

        {/* Main body - fuselage */}
        <ellipse cx="40" cy="32" rx="16" ry="12" fill={color} />
        
        {/* Cockpit window */}
        <ellipse cx="40" cy="30" rx="8" ry="6" fill="white" opacity="0.4" />
        <ellipse cx="38" cy="29" rx="3" ry="2" fill="white" opacity="0.8" />

        {/* Landing skids */}
        <rect x="28" y="42" width="3" height="8" rx="1.5" fill={color} opacity="0.8" />
        <rect x="49" y="42" width="3" height="8" rx="1.5" fill={color} opacity="0.8" />
        <rect x="24" y="48" width="11" height="2" rx="1" fill={color} opacity="0.8" />
        <rect x="45" y="48" width="11" height="2" rx="1" fill={color} opacity="0.8" />

        {/* Propeller motors */}
        <circle cx="15" cy="20" r="5" fill={color} opacity="0.9" />
        <circle cx="65" cy="20" r="5" fill={color} opacity="0.9" />

        {/* Propeller blades - animated */}
        <g>
          <motion.ellipse
            cx="15"
            cy="20"
            rx="10"
            ry="2"
            fill="white"
            opacity="0.6"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.2, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '15px 20px' }}
          />
        </g>
        <g>
          <motion.ellipse
            cx="65"
            cy="20"
            rx="10"
            ry="2"
            fill="white"
            opacity="0.6"
            animate={{ rotate: -360 }}
            transition={{ duration: 0.2, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '65px 20px' }}
          />
        </g>

        {/* Tail */}
        <ellipse cx="40" cy="38" rx="6" ry="4" fill={color} opacity="0.8" />

        {/* Detail lights */}
        <motion.circle
          cx="30"
          cy="32"
          r="1.5"
          fill="#FF6B6B"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <motion.circle
          cx="50"
          cy="32"
          r="1.5"
          fill="#51CF66"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </svg>
    </div>
  );
}
