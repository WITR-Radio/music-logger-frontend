import React, {createRef, useContext, useState} from 'react'
import './AddRow.scss'
import {Button, Form, FormControl} from "react-bootstrap";
import {DateTimeChooser} from "../../date_time_chooser/DateTimeChooser";
import GroupsContext from "../../contexts/Groups";
import {Track} from "../../../logic/objects";
import {fetchApi} from "../../../logic/requests";
import {formatDate} from "../../../logic/date_utils";

interface AddRowProps {
    id: number
    removeRow: () => void
    addTrack: (track: Track | undefined) => void
}

export const AddRow = (props: AddRowProps) => {
    const artistRef = createRef<HTMLInputElement>()
    const titleRef = createRef<HTMLInputElement>()
    const groupRef = createRef<HTMLSelectElement>()
    const [date, setDate] = useState<Date>(new Date())

    const groups = useContext(GroupsContext)

    function submitAdd() {
        let title = titleRef.current?.value ?? ''
        let artist = artistRef.current?.value ?? ''
        let group = groupRef.current?.value ?? ''

        return fetchApi('/tracks/add', undefined, {
            method: 'POST',
            body: JSON.stringify({
                'title': title,
                'artist': artist,
                'group': group,
                'time': date.getTime()
            })
        }).then(async res => {
            if (res.status != 200) {
                console.error(`[tracks/add] Erroneous status of ${res.status}: ${await res.json()}`)
                return
            }

            props.addTrack(Track.fromJSON(await res.json()))
        }).finally(() => props.addTrack(undefined))
    }

    return (
        <tr className="AddRow">
            <td><FormControl ref={artistRef} className="form-control"/></td>
            <td><FormControl ref={titleRef} className="form-control"/></td>
            <td>
                <Form.Select ref={groupRef}>
                    {groups.map((group, i) => <option selected={i == 0} value={group}>{group}</option>)}
                </Form.Select>
            </td>
            <td className="date-time-col">
                <DateTimeChooser date={date} onChange={setDate}/>
            </td>
            <td>
                <Button variant="success" size="sm" className="me-2" onClick={() => submitAdd()}>Add</Button>
                <Button variant="danger" size="sm" onClick={() => props.addTrack(undefined)}>Cancel</Button>
            </td>
        </tr>
    )
}
