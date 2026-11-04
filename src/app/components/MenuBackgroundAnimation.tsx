import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Drone } from './Drone';
import { House } from './Houses';
import { BackgroundSettings } from '../App';

interface AnimatedDrone {
  id: number;
  y: number;
  delay: number;
}

interface MenuBackgroundAnimationProps {
  settings?: BackgroundSettings;
}

export function MenuBackgroundAnimation({ settings = { showDrones: true, showHouses: true } }: MenuBackgroundAnimationProps) {
  const [drones, setDrones] = useState<AnimatedDrone[]>([]);
  const [houses, setHouses] = useState<number[]>([]);

  useEffect(() => {
    if (!settings.showDrones) {
      setDrones([]);
      return;
    }

    // Spawn random drones
    const droneInterval = setInterval(() => {
      setDrones(prev => [
        ...prev,
        {
          id: Date.now(),
          y: Math.random() * 40 + 10, // Random y position between 10% and 50%
          delay: 0,
        }
      ]);
    }, 4000); // New drone every 4 seconds

    return () => {
      clearInterval(droneInterval);
    };
  }, [settings.showDrones]);

  useEffect(() => {
    if (!settings.showHouses) {
      setHouses([]);
      return;
    }

    // Spawn random houses
    const houseInterval = setInterval(() => {
      setHouses(prev => [...prev, Date.now()]);
    }, 3000); // New house every 3 seconds

    return () => {
      clearInterval(houseInterval);
    };
  }, [settings.showHouses]);

  // Clean up old drones and houses
  useEffect(() => {
    const cleanup = setInterval(() => {
      setDrones(prev => prev.slice(-3)); // Keep only last 3 drones
      setHouses(prev => prev.slice(-4)); // Keep only last 4 houses
    }, 10000);

    return () => clearInterval(cleanup);
  }, []);

  return (
    <>
      {/* Animated drones */}
      {drones.map((drone) => (
        <motion.div
          key={drone.id}
          className="absolute w-12 h-12 pointer-events-none opacity-40"
          initial={{ left: '110%', top: `${drone.y}%` }}
          animate={{ 
            left: '-15%',
            top: `${drone.y}%`,
          }}
          transition={{
            duration: 8,
            ease: 'linear',
          }}
          onAnimationComplete={() => {
            setDrones(prev => prev.filter(d => d.id !== drone.id));
          }}
        >
          <motion.div
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Drone color="#74C0FC" hasShield={false} />
            {/* Falling package animation */}
            <motion.div
              className="absolute left-0 top-8"
              initial={{ opacity: 1, y: 0 }}
              animate={{
                y: [0, 40],
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 2,
                ease: 'easeIn',
              }}
            >
              <div className="w-3 h-3 bg-[#FFD43B] border border-[#FCC419] rounded-sm shadow" />
            </motion.div>
          </motion.div>
        </motion.div>
      ))}

      {/* Animated houses */}
      {houses.map((houseId) => (
        <motion.div
          key={houseId}
          className="absolute bottom-0 pointer-events-none opacity-50"
          initial={{ left: '110%' }}
          animate={{ left: '-20%' }}
          transition={{
            duration: 12,
            ease: 'linear',
          }}
          onAnimationComplete={() => {
            setHouses(prev => prev.filter(id => id !== houseId));
          }}
        >
          <House x={0} id={houseId} />
        </motion.div>
      ))}
    </>
  );
}