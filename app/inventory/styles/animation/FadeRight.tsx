'use client';

import React from 'react';
import { motion, MotionProps } from 'framer-motion';

interface FadeRightProps extends MotionProps {
  children: React.ReactNode;
  delay?: number;
}

const FadeRight: React.FC<FadeRightProps> = ({ children, delay = 0, ...others }) => {
  return (
    <motion.div
      initial={{ x: 10, opacity: 0.01 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay, ease: [0, 0.28, 0, 0.5] }}
      viewport={{ once: true }}
      {...others}
    >
      {children}
    </motion.div>
  );
};

export default FadeRight;
