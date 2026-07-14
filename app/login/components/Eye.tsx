'use client';

import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@integrated-computer-system/ui-kit';
import { calculateEyeOffset } from '../utils/eye';

export interface EyeProps {
    className?: string;
    pupilClassName?: string;
    maxOffset?: number;
}

export function Eye({
    className,
    pupilClassName,
    maxOffset = 4
}: EyeProps) {
    const eyeRef = useRef<HTMLDivElement>(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const calculated = calculateEyeOffset(e.clientX, e.clientY, eyeRef.current, maxOffset);
            setOffset(calculated);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [maxOffset]);

    return (
        <div
            ref={eyeRef}
            className={cn("w-14 h-14 rounded-full bg-white border-2 border-[#1e1b18] flex items-center justify-center relative overflow-hidden shrink-0 shadow-sm", className)}
        >
            <div
                className={cn("w-6 h-6 rounded-full bg-[#1e1b18] absolute", pupilClassName)}
                style={{
                    transform: `translate(${offset.x}px, ${offset.y}px)`,
                    transition: 'transform 0.05s ease-out',
                }}
            />
        </div>
    );
}
