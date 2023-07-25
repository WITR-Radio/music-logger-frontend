import React, {ChangeEvent, useEffect, useState} from 'react'
import './DateTimeChooser.scss'
import {Calendar} from "react-date-range";
import {Form, FormControl, InputGroup} from "react-bootstrap";
import useTimeController from "@witr-radio/music-logger-service";
import moment from "moment";
import {da} from "date-fns/locale";

interface DateTimeChooserProps {
    /**
     * The current {@link Date} state.
     */
    date: Date

    /**
     * Invoked when the chosen {@link Date} is changed.
     * 
     * @param date The selected date
     */
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

    /**
     * This is the prefix for the form inputs' keys. When this is changed (and subsequently the component's key), the
     * component is recreated and will use the changed default values from {@link props.date}, while ensuring the form
     * element tracks its own state.
     */
    const [dateChangedKeyBase, setDateChangedKeyBase] = useState<string>('')
    
    useEffect(() => {
        setDateChangedKeyBase(new Date().getTime().toString())
    }, [props.date])

    return (
        <div className="DateTimeChooser">
            <Calendar key={`${dateChangedKeyBase}_date`} className="calendar" date={props.date} onChange={handleDate}/>
            <div className="time-wrapper">
                <InputGroup className="mt-2 mx-2 time-selector">
                    <FormControl key={`${dateChangedKeyBase}_minute`} type="number" defaultValue={defaultHour()} onChange={handleHour} min="1" max="12"/>
                    <InputGroup.Text>:</InputGroup.Text>
                    <FormControl key={`${dateChangedKeyBase}_hour`} type="number" defaultValue={props.date.getMinutes()} onChange={handleMinute} min="0" max="59"/>
                    <Form.Select defaultValue={am ? 'am' : 'pm'} onChange={e => handleAmPm(e.target.value == 'am')}>
                        <option value="am">AM</option>
                        <option value="pm">PM</option>
                    </Form.Select>
                </InputGroup>
            </div>
        </div>
    )
}
