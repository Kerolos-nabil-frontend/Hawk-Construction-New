import React, { useEffect, useState, useRef } from 'react';
import { useInView, motion, useSpring, useTransform } from 'framer-motion';

export const Counter = ({ value, duration = 2 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    // Extract number from string (e.g., "150+" -> 150)
    const numericValue = parseInt(value) || 0;
    const suffix = String(value).replace(/[0-9]/g, '');

    const springValue = useSpring(0, {
        duration: duration * 1000,
        bounce: 0,
    });

    const displayValue = useTransform(springValue, (current) =>
        Math.floor(current).toLocaleString() + suffix
    );

    useEffect(() => {
        if (isInView) {
            springValue.set(numericValue);
        }
    }, [isInView, springValue, numericValue]);

    return (
        <motion.span ref={ref}>
            {displayValue}
        </motion.span>
    );
};
