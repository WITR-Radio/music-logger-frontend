import {createContext} from "react";
import {fetchApi} from "../../logic/requests";

const GroupsContext = createContext<string[]>([])
export default GroupsContext

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
