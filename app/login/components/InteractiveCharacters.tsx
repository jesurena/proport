'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@integrated-computer-system/ui-kit';
import { Eye } from './Eye';
import '../styles/InteractiveCharacters.css';

export interface InteractiveCharactersProps {
    isReacting: boolean;
}

type ClickedChar = 'blue' | 'black' | 'orange' | 'yellow' | null;

export function InteractiveCharacters({ isReacting }: InteractiveCharactersProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [clicked, setClicked] = useState<ClickedChar>(null);

    const handleCharClick = useCallback((char: NonNullable<ClickedChar>) => {
        setClicked(null);
        requestAnimationFrame(() => setClicked(char));
    }, []);

    useEffect(() => {
        if (!clicked) return;
        const timer = setTimeout(() => setClicked(null), 600);
        return () => clearTimeout(timer);
    }, [clicked]);

    useEffect(() => {
        if (!containerRef.current) return;
        const parent = containerRef.current.parentElement;
        if (!parent) return;

        const handleResize = () => {
            const parentWidth = parent.clientWidth;
            const baseWidth = 620;
            const computedScale = Math.min(parentWidth / baseWidth, 1.15);
            setScale(computedScale);
        };

        const resizeObserver = new ResizeObserver(() => handleResize());
        resizeObserver.observe(parent);
        handleResize();

        return () => resizeObserver.disconnect();
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute bottom-0 left-0 right-0 h-[440px] flex items-end justify-center select-none overflow-visible pointer-events-none"
        >
            <div
                className="w-[600px] h-[440px] relative origin-bottom shrink-0 pointer-events-auto"
                style={{
                    transform: `scale(${scale})`,
                    transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                {/* Blue Rectangle */}
                <div
                    onClick={() => handleCharClick('blue')}
                    className={cn(
                        "absolute left-[170px] bottom-0 w-[200px] h-[400px] bg-[#4f46e5] rounded-t-sm flex flex-col items-center pt-20 z-10 transition-all duration-300 origin-bottom cursor-pointer",
                        clicked === 'blue' ? "clicked-blue" : isReacting && "react-blue"
                    )}
                >
                    <div className="flex gap-12">
                        <Eye maxOffset={isReacting ? 12 : 9} />
                        <Eye maxOffset={isReacting ? 12 : 9} />
                    </div>
                    {isReacting || clicked === 'blue' ? (
                        <div className="w-8 h-8 rounded-full bg-[#1e1b18] mt-8 transition-all duration-300" />
                    ) : (
                        <div className="w-10 h-2 border-b-4 border-b-[#1e1b18] border-t-0 border-x-0 rounded-full mt-8" />
                    )}
                </div>

                {/* Black Rectangle */}
                <div
                    onClick={() => handleCharClick('black')}
                    className={cn(
                        "absolute left-[330px] bottom-0 w-[110px] h-[320px] bg-[#1e1b18] rounded-t-sm flex flex-col items-center pt-16 z-20 transition-all duration-300 origin-bottom cursor-pointer",
                        clicked === 'black' ? "clicked-black" : isReacting && "react-black"
                    )}
                >
                    <div className="flex gap-1">
                        <Eye maxOffset={isReacting ? 12 : 9} />
                        <Eye maxOffset={isReacting ? 12 : 9} />
                    </div>
                    <div className={cn(
                        "flex gap-10 mt-4 transition-opacity duration-300",
                        isReacting || clicked === 'black' ? "opacity-100" : "opacity-0"
                    )}>
                        <div className="w-4 h-2 bg-[#f43f5e] rounded-full opacity-60" />
                        <div className="w-4 h-2 bg-[#f43f5e] rounded-full opacity-60" />
                    </div>
                </div>

                {/* Orange Semicircle */}
                <div
                    onClick={() => handleCharClick('orange')}
                    className={cn(
                        "absolute left-[50px] bottom-0 w-[360px] h-[180px] bg-[#f97316] rounded-t-full flex flex-col items-center pt-12 z-30 shadow-md transition-all duration-300 origin-bottom cursor-pointer",
                        clicked === 'orange' ? "clicked-orange" : isReacting && "react-orange"
                    )}
                >
                    <div className="flex gap-20 mb-4">
                        <Eye maxOffset={isReacting ? 12 : 9} />
                        <Eye maxOffset={isReacting ? 12 : 9} />
                    </div>
                    {isReacting || clicked === 'orange' ? (
                        <div className="w-12 h-12 bg-[#1e1b18] rounded-full mt-1 transition-all duration-300 animate-pulse" />
                    ) : (
                        <div className="w-12 h-6 bg-[#1e1b18] rounded-b-full" />
                    )}
                </div>

                {/* Yellow Pill Shape */}
                <div
                    onClick={() => handleCharClick('yellow')}
                    className={cn(
                        "absolute left-[410px] bottom-0 w-[160px] h-[240px] bg-[#facc15] rounded-t-full flex flex-col items-end pr-10 pt-20 z-40 transition-all duration-300 origin-bottom cursor-pointer",
                        clicked === 'yellow' ? "clicked-yellow" : isReacting && "react-yellow"
                    )}
                >
                    <Eye maxOffset={isReacting ? 12 : 9} className="mr-1" />
                    {isReacting || clicked === 'yellow' ? (
                        <div className="w-10 h-5 bg-transparent border-b-4 border-b-[#1e1b18] border-t-0 border-x-0 rounded-b-full mt-3 mr-2 transition-all duration-300" />
                    ) : (
                        <div className="w-16 h-1.5 bg-[#1e1b18] mt-4 mr-1" />
                    )}
                </div>
            </div>
        </div>
    );
}
