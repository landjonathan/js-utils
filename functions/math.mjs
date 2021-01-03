/**
 * Maps a value from one range to another
 * @example <code>map(5, 0, 10, 0, 100) //-> 50</code>
 * @param {number} value
 * @param {number=} originalStart
 * @param {number=} originalEnd
 * @param {number=} newStart
 * @param {number=} newEnd
 * @return {number}
 */
export const mapRange = (value, originalStart = 0, originalEnd = 1, newStart = 0, newEnd = 100) => (value - originalStart) * (newEnd - newStart) / (originalEnd - originalStart) + newStart