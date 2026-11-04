import { motion } from 'motion/react';

interface HouseProps {
  x: number;
  id: number;
}

export function House({ x, id }: HouseProps) {
  const colors = ['#FFD43B', '#FF922B', '#74C0FC', '#CC5DE8', '#51CF66'];
  const color = colors[id % colors.length];

  return (
    <motion.div
      className="absolute bottom-0 w-32 h-40"
      style={{ left: `${x}%` }}
    >
      <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Chimney - BIGGER */}
        <rect x="65" y="20" width="20" height="35" fill="#8B4513" />
        <rect x="62" y="17" width="26" height="6" rx="1" fill="#654321" />
        
        {/* Chimney Target Area - invisible but marks the target */}
        <circle cx="75" cy="25" r="15" fill="transparent" stroke="#FFD43B" strokeWidth="2" strokeDasharray="2,2" opacity="0.5" />
        
        {/* Roof */}
        <path d="M50 45 L10 70 L90 70 Z" fill="#E74C3C" />
        <path d="M50 45 L10 70 L90 70 Z" fill="#C0392B" opacity="0.3" />
        
        {/* House body */}
        <rect x="15" y="70" width="70" height="70" fill={color} />
        
        {/* Door */}
        <rect x="40" y="100" width="20" height="40" rx="10" fill="#8B4513" />
        <circle cx="55" cy="120" r="2" fill="#FFD43B" />
        
        {/* Windows */}
        <rect x="25" y="85" width="15" height="15" rx="2" fill="#87CEEB" />
        <line x1="32.5" y1="85" x2="32.5" y2="100" stroke="#654321" strokeWidth="1.5" />
        <line x1="25" y1="92.5" x2="40" y2="92.5" stroke="#654321" strokeWidth="1.5" />
        
        <rect x="60" y="85" width="15" height="15" rx="2" fill="#87CEEB" />
        <line x1="67.5" y1="85" x2="67.5" y2="100" stroke="#654321" strokeWidth="1.5" />
        <line x1="60" y1="92.5" x2="75" y2="92.5" stroke="#654321" strokeWidth="1.5" />
        
        {/* Ground */}
        <rect x="0" y="135" width="100" height="5" fill="#8B7355" />
      </svg>
    </motion.div>
  );
}