import React, {useContext} from 'react'
import './DropdownDate.scss'
import {DateTimeChooser} from "../date_time_chooser/DateTimeChooser";
import {Card} from "react-bootstrap";
import SearchDateContext from "../contexts/SearchDate";

export const CustomToggle = React.forwardRef<HTMLDivElement>((props, ref) => {
    return (<Card className="DropdownDateToggle form-select"
        ref={ref}
        onClick={(e) => {
            e.preventDefault();

            // @ts-ignore
            props.onClick(e);
        }}
    >
        {props.children}
    </Card>)
});

export const DropdownDate = React.forwardRef<HTMLDivElement>(
    (props, ref) => {
        const {date, setDate} = useContext(SearchDateContext)

        // @ts-ignore
        let classes = props.className

        return (
            <div
                className={classes}
                ref={ref}>
                <DateTimeChooser date={date ?? new Date()} onChange={setDate}/>
            </div>
        );
    },
);