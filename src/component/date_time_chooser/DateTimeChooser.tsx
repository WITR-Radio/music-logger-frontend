import React, {ChangeEvent, useState} from 'react'
import './DateTimeChooser.scss'
import {Calendar} from "react-date-range";
import {Form, FormControl, InputGroup} from "react-bootstrap";

interface DateTimeChooserProps {
    date: Date
    onChange: (date: Date) => void
}

// TODO: document everything
export const DateTimeChooser = (props: DateTimeChooserProps) => {
    let hours = props.date.getHours()
    const [am, setAm] = useState<boolean>(hours < 12)

    function handleDate(date: Date) {
        let newDate = new Date(props.date)
        newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate())
        props.onChange(newDate)
    }

    function handleHour(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        let value = e.target.value
        let hour = value.length == 0 ? 1 : parseInt(value)
        if (hour <= 0 || hour > 12) {
            e.target.value = '1'
            return
        }

        let newDate = new Date(props.date)
        newDate.setHours(hour)
        props.onChange(newDate)
    }

    function handleMinute(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        let value = e.target.value
        let minute = value.length == 0 ? 0 : parseInt(value)
        if (minute < 0 || minute >= 60) {
            e.target.value = '0'
            return
        }

        let newDate = new Date(props.date)
        newDate.setMinutes(minute)
        props.onChange(newDate)
    }

    function handleAmPm(e: ChangeEvent<HTMLSelectElement>) {
        let am = e.target.value == 'am'
        setAm(am)
        let newDate = new Date(props.date)
        let offset = am ? -12 : 12
        newDate.setHours(newDate.getHours() + offset)
        props.onChange(newDate)
    }

    return (
        <div className="DateTimeChooser">
            <Calendar className="calendar" date={props.date} onChange={handleDate}/>
            <div className="time-wrapper">
                <InputGroup className="mt-2 time-selector">
                    <FormControl type="number" defaultValue={props.date.getHours()} onChange={handleHour} min="1" max="12"/>
                    <InputGroup.Text>:</InputGroup.Text>
                    <FormControl type="number" defaultValue={props.date.getMinutes()} onChange={handleMinute} min="0" max="59"/>
                    <Form.Select defaultValue={am ? 'am' : 'pm'} onChange={handleAmPm}>
                        <option value="am">AM</option>
                        <option value="pm">PM</option>
                    </Form.Select>
                </InputGroup>
            </div>
        </div>
    )
}
