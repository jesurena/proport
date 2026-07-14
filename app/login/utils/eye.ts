export interface Coordinate {
    x: number;
    y: number;
}

/**
 * Calculates the offset of a pupil within an eye container relative to the mouse position.
 */
export function calculateEyeOffset(
    clientX: number,
    clientY: number,
    eyeElement: HTMLElement | null,
    maxOffset: number = 4,
    sensitivity: number = 0.08
): Coordinate {
    if (!eyeElement) return { x: 0, y: 0 };

    const rect = eyeElement.getBoundingClientRect();
    const eyeX = rect.left + rect.width / 2;
    const eyeY = rect.top + rect.height / 2;

    const dx = clientX - eyeX;
    const dy = clientY - eyeY;
    const dist = Math.hypot(dx, dy);

    if (dist === 0) {
        return { x: 0, y: 0 };
    }

    const angle = Math.atan2(dy, dx);
    const appliedDist = Math.min(dist * sensitivity, maxOffset);

    return {
        x: Math.cos(angle) * appliedDist,
        y: Math.sin(angle) * appliedDist,
    };
}
