import {fetchApi} from "./requests";

let groups: string[] = []

/**
 * Gets the possible groups. If they have not been fetched before, fetch them.
 * @param underground If this is for underground
 */
export async function getGroups(underground: boolean): Promise<string[]> {
    if (groups.length > 0) {
        return groups
    }

    return fetchApi('/groups/list', [['underground', `${underground}`]]).then(res => {
        if (res.status != 200) {
            console.log(`Erroneous status of ${res.status}: ${res.json()}`)
            return []
        }

        return res.json().then(json => groups = json)
    })
}
