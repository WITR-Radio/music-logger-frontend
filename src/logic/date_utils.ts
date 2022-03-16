/**
 * Pads a given number with 0's to the given length. For example, `42` padded with a length of 4 would return `0042`.
 * @param num The number to pad
 * @param length The (minimum) length the number should be
 * @returns The padded number
 */
export function padNum(num: number, length: number): string {
    return `${num}`.padStart(length, '0')
}

/**
 * Formats a date to be sent over to the backend. This gives it in the format of:
 *
 * `YYYY-MM-DD hh:mm:00.0`
 *
 * All numbers are padded with 0's, and seconds/ms are always 0.
 * @param date The date to format
 * @returns The formatted date
 */
export function formatDate(date: Date): string {
    let month = padNum(date.getMonth() + 1, 2)
    let day = padNum(date.getDate(), 2)
    let hour = padNum(date.getHours(), 2)
    let minute = padNum(date.getMinutes(), 2)
    return `${date.getFullYear()}-${month}-${day} ${hour}:${minute}:00.0`
}

/**
 * Formats a Date into the format of:
 *
 * `MM/DD/YYYY hh:mm [AM/PM]`
 *
 * Where MM and DD do not contain 0 padding
 * @param date The date to format
 * @returns The formatted date
 */
export function prettyFormatDate(date: Date): string {
    let am = date.getHours() < 12
    let hours = date.getHours() - (!am ? 12 : 0)
    return `${date.getMonth() + 1}/${date.getDay()}/${date.getFullYear()} ${hours}:${padNum(date.getMinutes(), 2)} ${am ? 'AM' : 'PM'}`
}
