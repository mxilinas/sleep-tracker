/**
 * Maps a value 'x' between 'min' and 'max' to a value between 0 and 1.
 * Behaves like inverse lerp but using the trough of a sin wave instead of
 * a linear function.
 *
 * https://www.desmos.com/calculator/cg0cklo5fb
 *
 * @param min - The lower bound of x.
 * @param max - The upper bound of x.
 * @param x - The value between `min` and `max` to map.
 * @returns A value between 0 and 1.
 */
export function invHalfSin(min: number, max: number, x: number): number {
    return 1 - Math.sin((Math.PI * (x - min) / (max - min)));
}


/**
 * https://www.desmos.com/calculator/jatg9numyf
 * @param t - A value between 0 and 1.
 * @param s - The flatness of the middle of the curve.
 * @returns A number between 0 and 1
 */
export function doubleAction(t: number, s: number): number {
    const num = Math.tanh(s * t) + Math.tanh(s * (t - 1))
    return num / 2 + 0.5;
}


/**
 * https://www.desmos.com/calculator/jatg9numyf
 * @param t - A value between 0 and 1.
 * @param s - The flatness of the middle of the curve.
 * @returns A number between 0 and 1
 */
export function sharpBowl(t: number, s: number): number {
    const num = Math.tanh(s * t) * Math.tanh(s * (t - 1))
    return num / 2 + 0.5;
}


/**
 * Maps a value `t` between 0 and 1 to a value between `a` and `b`.
 *
 * @param a - The start value of the range.
 * @param b - The end value of the range.
 * @param t - The interpolation factor between 0 and 1.
 * @returns The interpolated value between `a` and `b`.
 */
export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}


/**
 * Calculates the interpolation factor `t` that maps a value `v` 
 * back between `a` and `b`.
 *
 * @param a - The start value of the range.
 * @param b - The end value of the range.
 * @param v - The value to inverse interpolate.
 * @returns A value between 0 and 1, the position of `v` between `a` and `b`.
 */
export function invlerp(a: number, b: number, v: number): number {
    return (v - a) / (b - a);
}

