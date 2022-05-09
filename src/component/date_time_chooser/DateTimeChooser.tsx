import React, {ChangeEvent, useState} from 'react'
import './DateTimeChooser.scss'
import {Calendar} from "react-date-range";
import {Form, FormControl, InputGroup} from "react-bootstrap";
import useTimeController from "@witr-radio/music-logger-service";
import moment from "moment";

interface DateTimeChooserProps {
    date: Date
    onChange: (date: Date) => void
}

export const DateTimeChooser = (props: DateTimeChooserProps) => {
    const {
        handleDate,
        updateDate,
        handleHour,
        handleMinute,
        handleAmPm,
        defaultHour,
        calendarDate,
        am
    } = useTimeController({date: props.date, onChange: props.onChange})

    return (
        <div className="DateTimeChooser">
            <Calendar className="calendar" date={props.date} onChange={handleDate}/>
            <div className="time-wrapper">
                <InputGroup className="mt-2 mx-2 time-selector">
                    <FormControl type="number" defaultValue={defaultHour()} onChange={handleHour} min="1" max="12"/>
                    <InputGroup.Text>:</InputGroup.Text>
                    <FormControl type="number" defaultValue={props.date.getMinutes()} onChange={handleMinute} min="0" max="59"/>
                    <Form.Select defaultValue={am ? 'am' : 'pm'} onChange={e => handleAmPm(e.target.value == 'am')}>
                        <option value="am">AM</option>
                        <option value="pm">PM</option>
                    </Form.Select>
                </InputGroup>
            </div>
        </div>
    )
}
