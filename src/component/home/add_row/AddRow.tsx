import React, {createRef, Fragment, useContext, useState} from 'react'
import './AddRow.scss'
import {Button, Form, FormControl} from "react-bootstrap";
import {DateTimeChooser} from "../../date_time_chooser/DateTimeChooser";
import GroupsContext from "../../contexts/Groups";
import {Track} from "../../../logic/objects";
import {fetchApi} from "../../../logic/requests";

interface AddRowProps {
    id: number
    event: boolean
    underground: boolean
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

        return fetchApi('/tracks/add', {underground: `${props.underground}`}, {
            method: 'POST',
            body: JSON.stringify({
                'title': title,
                'artist': artist,
                'group': props.event ? 'Event' : group,
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
        <tr key={props.id} className="AddRow">
            <td colSpan={props.event ? 3 : 1}><FormControl ref={artistRef} className="form-control"/></td>
            {!props.event && <Fragment>
                <td><FormControl ref={titleRef} className="form-control"/></td>
                <td>
                    <Form.Select ref={groupRef} defaultValue={groups[0]}>
                        {groups.map(group => <option key={group} value={group}>{group}</option>)}
                    </Form.Select>
                </td>
            </Fragment>}
            <td className="date-time-col">
                <DateTimeChooser date={date} onChange={setDate}/>
            </td>
            <td>
                <div className="d-flex justify-content-end">
                    <Button variant="success" size="sm" className="me-2" onClick={() => submitAdd()}>Add</Button>
                    <Button variant="danger" size="sm" onClick={() => props.addTrack(undefined)}>Cancel</Button>
                </div>
            </td>
        </tr>
    )
}
