import {createContext} from "react";

const GroupsContext = createContext<string[]>([])
export default GroupsContext

export const TableGroupColors = new Map<string, string>([
    ['Event', 'table-primary'],
    ['Specialty Show', 'table-info']
])

/**
 * Returns the bootstrap class that should modify a table row's color, such as `table-warning`.
 * @param group The group name
 */
export function getTableColor(group: string): string {
    return TableGroupColors.get(group) ?? ''
}
