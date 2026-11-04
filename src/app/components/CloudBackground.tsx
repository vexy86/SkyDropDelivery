import { motion } from 'motion/react';

export function CloudBackground() {
  const clouds = [
    { id: 1, top: '10%', delay: 0, duration: 45 },
    { id: 2, top: '25%', delay: 5, duration: 50 },
    { id: 3, top: '45%', delay: 10, duration: 55 },
    { id: 4, top: '65%', delay: 15, duration: 48 },
    { id: 5, top: '80%', delay: 8, duration: 52 },
    { id: 6, top: '15%', delay: 20, duration: 60 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-[#E3F2FD] via-[#F0F8FF] to-[#FFF9E6]" />
      
      {clouds.map((cloud) => (
        <motion.div
          key={cloud.id}
          className="absolute w-32 h-16 md:w-48 md:h-24"
          style={{ top: cloud.top, left: '-10%' }}
          animate={{
            x: ['0vw', '110vw'],
          }}
          transition={{
            duration: cloud.duration,
            delay: cloud.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="50" cy="60" rx="35" ry="25" fill="white" opacity="0.7" />
            <ellipse cx="90" cy="50" rx="45" ry="35" fill="white" opacity="0.7" />
            <ellipse cx="130" cy="60" rx="40" ry="28" fill="white" opacity="0.7" />
            <ellipse cx="160" cy="70" rx="30" ry="20" fill="white" opacity="0.7" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
