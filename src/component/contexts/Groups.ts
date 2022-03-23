import {createContext} from "react";
import {fetchApi} from "../../logic/requests";

const GroupsContext = createContext<string[]>([])
export default GroupsContext

export const TableGroupColors = new Map<string, string>([
    ['Event', 'table-primary']
])

/**
 * Returns the bootstrap class that should modify a table row's color, such as `table-warning`.
 * @param group The group name
 */
export function getTableColor(group: string): string {
    return TableGroupColors.get(group) ?? ''
}

/**
 * Fetches the possible groups
 * @param underground If this is for underground
 */
export async function getGroups(underground: boolean): Promise<string[]> {
    return fetchApi('/groups/list', {underground: `${underground}`}).then(res => {
        if (res.status != 200) {
            console.log(`[groups/list] Erroneous status of ${res.status}: ${res.json()}`)
            return []
        }

        return res.json()
    })
}
