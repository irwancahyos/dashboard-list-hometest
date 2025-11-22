'use client';

import React from 'react';
import { motion, MotionProps } from 'framer-motion';

interface FadeUpProps extends MotionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const FadeUp: React.FC<FadeUpProps> = ({ children, className,  delay = 0, ...others }) => {
  return (
    <motion.div
      className={className}
      initial={{ y: 10, opacity: 0.01 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay, ease: [0, 0.28, 0, 0.5] }}
      viewport={{ once: true }}
      {...others}
    >
      {children}
    </motion.div>
  );
};

export default FadeUp;
