
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import React from 'react';

interface NavMotionLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;  // Optional onClick prop
}

// Ce composant wrapper combine les propriétés de Link avec les animations de motion
const NavMotionLink: React.FC<NavMotionLinkProps> = ({ to, children, className, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link to={to} className={className || ""} onClick={onClick}>
        {children}
      </Link>
    </motion.div>
  );
};

export default NavMotionLink;
