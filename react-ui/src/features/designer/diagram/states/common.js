/**
 * Checks if two points are on the same position.
 */
export const samePosition = (p1, p2) => p1 && p2 && Math.round(p1.x) === Math.round(p2.x) && Math.round(p1.y) === Math.round(p2.y)

/**
 * Checks if all given points share the same X position.
 */
export const sameX = (...points) => points.map(p => Math.round(p.x)).every((p, i, arr) => p === arr[0])

/**
 * Checks if all given points share the same Y position.
 */
export const sameY = (...points) => points.map(p => Math.round(p.y)).every((p, i, arr) => p === arr[0])

/**
 * Checks if two points are nearby each other, given a tolerance.
 */
export const nearby = (p1, p2, tolerance) => Math.abs(p1.x - p2.x) <= tolerance && Math.abs(p1.y - p2.y) <= tolerance
