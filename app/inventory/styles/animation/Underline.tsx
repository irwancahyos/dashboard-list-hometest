'use client';

import React, { useState, useRef, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { motion } from 'motion/react';

type UnderlineAnimation = {
  backgroundSize: string;
  backgroundPositionX: 'right' | 'left';
};

interface UnderlineProps extends React.ComponentPropsWithoutRef<'span'> {
  children: React.ReactNode;
  triggerParent?: string;
}

const Underline: React.FC<UnderlineProps> = ({ triggerParent, className, children, ...props }) => {
  const [animate, setAnimate] = useState<'inactive' | 'active'>('inactive');
  const ref = useRef<HTMLSpanElement>(null);

  const inactive: UnderlineAnimation = { backgroundSize: '0% 1px', backgroundPositionX: 'right' };
  const active: UnderlineAnimation = { backgroundSize: '100% 1px', backgroundPositionX: 'left' };

  const onActive = () => setAnimate('active');
  const onInactive = () => setAnimate('inactive');

  const handleHover = {
    onHoverStart: !triggerParent ? onActive : undefined,
    onHoverEnd: !triggerParent ? onInactive : undefined,
  };

  useEffect(() => {
    if (!ref.current || !triggerParent) return;
    const trigger = ref.current.closest(triggerParent);
    if (!trigger) return;

    trigger.addEventListener('mouseenter', onActive);
    trigger.addEventListener('mouseleave', onInactive);

    return () => {
      trigger.removeEventListener('mouseenter', onActive);
      trigger.removeEventListener('mouseleave', onInactive);
    };
  }, [triggerParent]);

  return (
    <motion.span
      ref={ref}
      className={twMerge('bg-left-bottom bg-gradient-to-r from-current to-current bg-no-repeat', className)}
      initial={inactive}
      animate={animate === 'active' ? active : inactive}
      transition={{ duration: 0.5, ease: [0.3, 1, 0.3, 1]}}
      {...handleHover}
      id={props.id}
      style={props.style}
      title={props.title}
      tabIndex={props.tabIndex}
    >
      {children}
    </motion.span>
  );
};

export default Underline;
