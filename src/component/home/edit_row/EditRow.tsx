import React, {createRef, Fragment, useContext, useState} from 'react'
import './EditRow.scss'
import {Button, Form, FormControl} from "react-bootstrap";
import {DateTimeChooser} from "../../date_time_chooser/DateTimeChooser";
import GroupsContext from "../../contexts/Groups";
import {Track, TrackContext} from "music-logger-service";

interface EditRowProps {
    track: Track
    underground: boolean
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
    const {trackHandler} = useContext(TrackContext)

    function submitEdit(id: number) {
        let title = titleRef.current?.value ?? ''
        let artist = artistRef.current?.value ?? ''
        let group = groupRef.current?.value ?? ''

        trackHandler.updateTrack(id, track, title, artist, group, date)
    }

    return (
        <tr key={props.track.id} className="EditRow">
            <td colSpan={track.isEvent() ? 3 : 1}><FormControl ref={artistRef} className="form-control" name="artist" defaultValue={track.artist}/></td>
            {!track.isEvent() && <Fragment>
                <td><FormControl ref={titleRef} className="form-control" name="title" defaultValue={track.title}/></td>
                <td>
                    <Form.Select ref={groupRef} defaultValue={track.group}>
                        {groups.map(group => <option value={group}>{group}</option>)}
                    </Form.Select>
                </td>
            </Fragment>}
            <td className="date-time-col">
                <DateTimeChooser date={date} onChange={setDate}/>
            </td>
            <td>
                <div className="d-flex justify-content-end">
                    <Button variant="primary" size="sm" className="me-2" onClick={() => submitEdit(track.id)}>Update</Button>
                    <Button variant="danger" size="sm" onClick={() => props.stopEditing()}>Cancel</Button>
                </div>
            </td>
        </tr>
    )
}
