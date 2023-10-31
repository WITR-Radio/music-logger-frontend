import React, {createRef, Fragment, useContext, useEffect, useState} from 'react'
import './AddRow.scss'
import {Button, Form, FormControl} from "react-bootstrap";
import {DateTimeChooser} from "../../date_time_chooser/DateTimeChooser";
import GroupsContext from "../../contexts/Groups";
import {TrackContext} from "@witr-radio/music-logger-service";

/**
 * Initial data in an adding row.
 */
export interface PrefilledTrack {
    artist: string
    title: string
    group: string
}

interface AddRowProps {
    id: number
    event: boolean
    addComplete: () => void

    /**
     * If set, this is the track that will initially be shown in this add row.
     */
    prefilledTrack?: PrefilledTrack | undefined
}

export const AddRow = (props: AddRowProps) => {
    const artistRef = createRef<HTMLInputElement>()
    const titleRef = createRef<HTMLInputElement>()
    const groupRef = createRef<HTMLSelectElement>()
    const [date, setDate] = useState<Date>(new Date())

    const groups = useContext(GroupsContext)
    const {trackHandler} = useContext(TrackContext)

    const submitAdd = (): void => {
        trackHandler.submitAdd(props.event ? '' : titleRef.current?.value, artistRef.current?.value, groupRef.current?.value, date, props.event)
            .finally(props.addComplete)
    }

    const cancelAdd = (): void => {
        props.addComplete()
    }

    const setTimeToNow = (): void => {
        setDate(new Date())
    }

    return (
        <tr key={props.id} className="AddRow tr-sm-vertical">
            <td colSpan={props.event ? 3 : 1}><FormControl ref={artistRef} defaultValue={props.prefilledTrack?.artist} className="form-control placeholder-hide-lg" placeholder={props.event ? 'Event Name' : 'Artist Name'}/></td>
            {!props.event && <Fragment>
                <td><FormControl ref={titleRef} defaultValue={props.prefilledTrack?.title} className="form-control placeholder-hide-lg" placeholder="Title"/></td>
                <td>
                    <Form.Select ref={groupRef} defaultValue={props.prefilledTrack?.group}>
                        {groups.map(group => <option key={group} value={group}>{group}</option>)}
                    </Form.Select>
                </td>
            </Fragment>}
            <td className="date-time-col">
                <DateTimeChooser date={date} onChange={setDate}/>
            </td>
            <td>
                <div className="d-flex justify-content-end">
                    <Button variant="primary" size="sm" className="me-2" title="Set Current Time" onClick={setTimeToNow}><i className="bi bi-clock"></i></Button>
                    <Button variant="success" size="sm" className="me-2" onClick={() => submitAdd()}>Add</Button>
                    <Button variant="danger" size="sm" onClick={() => cancelAdd()}>Cancel</Button>
                </div>
            </td>
        </tr>
    )
}
