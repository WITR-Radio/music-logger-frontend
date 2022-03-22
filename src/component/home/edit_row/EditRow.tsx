import React, {createRef, useContext, useState} from 'react'
import './EditRow.scss'
import {Button, Form, FormControl} from "react-bootstrap";
import {DateTimeChooser} from "../../date_time_chooser/DateTimeChooser";
import GroupsContext from "../../contexts/Groups";
import {Track} from "../../../logic/objects";
import {fetchApi} from "../../../logic/requests";
import {formatDate} from "../../../logic/date_utils";

interface EditRowProps {
    track: Track
    updateTracks: (foo: (oldTracks: Track[]) => Track[]) => void
    stopEditing: () => void
}

export const EditRow = (props: EditRowProps) => {
    const track = props.track

    const artistRef = createRef<HTMLInputElement>()
    const titleRef = createRef<HTMLInputElement>()
    const groupRef = createRef<HTMLSelectElement>()
    const [date, setDate] = useState<Date>(track.time)

    const groups = useContext(GroupsContext)

    function submitEdit(id: number) {
        let title = titleRef.current?.value ?? ''
        let artist = artistRef.current?.value ?? ''
        let group = groupRef.current?.value ?? ''

        return fetchApi('/tracks/update', undefined, {
            method: 'PATCH',
            body: JSON.stringify({
                'id': id,
                'title': title,
                'artist': artist,
                'group': group,
                // 'time': formatDate(date)
                'time': date.getTime()
            })
        }).then(async res => {
            if (res.status != 200) {
                console.error(`[tracks/update] Erroneous status of ${res.status}: ${await res.json()}`)
                return
            }

            props.updateTracks((oldTracks: Track[]) => {
                let editedTrack = oldTracks.find(track => track.id == id)
                if (editedTrack == undefined) {
                    console.error('Edited track not found!');
                    return oldTracks
                }

                editedTrack.title = title
                editedTrack.artist = artist
                editedTrack.group = group
                editedTrack.time = date
                return oldTracks
            })
        }).finally(() => props.stopEditing())
    }

    return (
        <tr className="EditRow">
            <td><FormControl ref={artistRef} className="form-control" name="artist" defaultValue={track.artist}/></td>
            <td><FormControl ref={titleRef} className="form-control" name="title" defaultValue={track.title}/></td>
            <td>
                <Form.Select ref={groupRef} defaultValue={track.group}>
                    {groups.map(group => <option value={group} selected={track.group == group}>{group}</option>)}
                </Form.Select>
            </td>
            <td className="date-time-col">
                <DateTimeChooser date={date} onChange={setDate}/>
            </td>
            <td>
                <Button variant="primary" size="sm" className="me-2" onClick={() => submitEdit(track.id)}>Update</Button>
                <Button variant="danger" size="sm" onClick={() => props.stopEditing()}>Cancel</Button>
            </td>
        </tr>
    )
}
