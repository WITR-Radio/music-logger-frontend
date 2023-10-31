import React, {createRef, Fragment, useContext, useState} from 'react'
import './EditRow.scss'
import {Button, Form, FormControl} from "react-bootstrap";
import {DateTimeChooser} from "../../date_time_chooser/DateTimeChooser";
import GroupsContext from "../../contexts/Groups";
import {Track, TrackContext} from "@witr-radio/music-logger-service";

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

    const submitEdit = (id: number): void  => {
        let title = titleRef.current?.value ?? ''
        let artist = artistRef.current?.value ?? ''
        let group = groupRef.current?.value ?? ''

        trackHandler.updateTrack(id, track, title, artist, group, date)

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

        props.stopEditing()
    }

    const setTimeToNow = (): void => {
        setDate(new Date())
    }

    return (
        <tr key={props.track.id} className="EditRow tr-sm-vertical">
            <td colSpan={track.isEvent() ? 3 : 1}><FormControl ref={artistRef} className="form-control placeholder-hide-lg" name="artist" defaultValue={track.artist} placeholder={track.isEvent() ? 'Event Name' : 'Artist Name'}/></td>
            {!track.isEvent() && <Fragment>
                <td><FormControl ref={titleRef} className="form-control placeholder-hide-lg" name="title" defaultValue={track.title} placeholder="Title"/></td>
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
                    <Button variant="primary" size="sm" className="me-2" title="Set Current Time" onClick={setTimeToNow}><i className="bi bi-clock"></i></Button>
                    <Button variant="primary" size="sm" className="me-2" onClick={() => submitEdit(track.id)}>Update</Button>
                    <Button variant="danger" size="sm" onClick={() => props.stopEditing()}>Cancel</Button>
                </div>
            </td>
        </tr>
    )
}
