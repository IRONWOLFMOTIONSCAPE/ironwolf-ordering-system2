import React from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
    children: React.ReactNode;
    isExiting?: boolean;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, isExiting }) => {
    const pageVariants = {
        initial: {
            opacity: 0,
            scale: 0.98,
        },
        in: {
            opacity: 1,
            scale: 1,
        },
        exit: {
            opacity: 0,
            scale: 1.1,
        },
    };

    const pageTransition = {
        type: "tween",
        ease: "anticipate",
        duration: 0.5
    };

    return (
        <motion.div
            initial="initial"
            animate={isExiting ? "exit" : "in"}
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
            style={{
                width: '100%',
                height: '100%',
            }}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
