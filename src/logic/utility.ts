type ConditionalClass = [string, boolean]

/**
 * Removes all undefined elements of the given classes array, and joins them with spaces to be used as an HTML
 * element's className property.
 *
 * @param classes The classes to insert (if not undefined)
 */
export function classes(...classes: (string | ConditionalClass)[]): string {
    return classes.map((e) => {
        if (typeof e != 'string') {
            return e[1] ? e[0] : undefined
        }

        return e
    }).filter(e => e != undefined).join(" ")
}