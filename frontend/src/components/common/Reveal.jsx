import { motion } from 'framer-motion';

const viewport = { once: true, amount: 0.2 };

export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96, y: 18 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function Reveal({ children, className, delay = 0, as = 'div' }) {
  const Comp = motion[as];

  return (
    <Comp
      className={className}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={fadeUp}
    >
      {children}
    </Comp>
  );
}

export function RevealGroup({ children, className, as = 'div' }) {
  const Comp = motion[as];

  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={staggerContainer}
    >
      {children}
    </Comp>
  );
}

export function PopIn({ children, className, as = 'div' }) {
  const Comp = motion[as];

  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={scaleIn}
    >
      {children}
    </Comp>
  );
}
