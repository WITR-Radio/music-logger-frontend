import React, {createRef, useContext, useState} from 'react'
import './Search.scss'
import {Button, Card, Col, Dropdown, Form, Row} from "react-bootstrap";
import SearchDateContext from "../../contexts/SearchDate";
import {CustomToggle, DropdownDate} from "../../dropdown_date/DropdownDate";
import {prettyFormatDate} from "../../../logic/date_utils";
import {TrackContext} from 'music-logger-service';

export const Search = () => {
    const [startDate, setStartDate] = useState<Date | undefined>()
    const [endDate, setEndDate] = useState<Date | undefined>()

    const {trackHandler} = useContext(TrackContext)

    const searchArtistRef = createRef<HTMLInputElement>()
    const searchTitleRef = createRef<HTMLInputElement>()

    function handleSearch() {
        // TODO: Something is wrong with these `Date | undefined` types?
        trackHandler.searchTracks(searchArtistRef.current?.value, searchTitleRef.current?.value, startDate, endDate)
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLElement>) {
        if (e.key == 'Enter') {
            e.preventDefault()
            handleSearch()
        }
    }

    return (
        <Card body onKeyDown={e => handleKeyDown(e)}>
            <Row className="flex-lg-row flex-column">
                <Col>
                    <Form.Label>Between</Form.Label>
                    <Row className="g-3">
                        <Col xs={6}>
                            <SearchDateContext.Provider value={{ date: startDate, setDate: setStartDate }}>
                                <Dropdown>
                                    <Dropdown.Toggle as={CustomToggle}>{startDate == undefined ? 'Select a date' : prettyFormatDate(startDate)}</Dropdown.Toggle>

                                    <Dropdown.Menu as={DropdownDate}>
                                        <Dropdown.Item>One</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </SearchDateContext.Provider>
                        </Col>
                        <Col xs={6}>
                            <SearchDateContext.Provider value={{ date: endDate, setDate: setEndDate }}>
                                <Dropdown>
                                    <Dropdown.Toggle as={CustomToggle}>{endDate == undefined ? 'Select a date' : prettyFormatDate(endDate)}</Dropdown.Toggle>

                                    <Dropdown.Menu as={DropdownDate}>
                                        <Dropdown.Item>One</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </SearchDateContext.Provider>
                        </Col>
                    </Row>
                </Col>
                <Form.Group as={Col}>
                    <Form.Label>Artist</Form.Label>
                    <Form.Control ref={searchArtistRef} type="text"/>
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Label>Title</Form.Label>
                    <Form.Control ref={searchTitleRef} type="text"/>
                </Form.Group>
            </Row>
            <Row className="justify-content-md-center mt-3">
                <Col md="auto">
                    <Button variant="success" onClick={() => handleSearch()}><i className="bi bi-search"></i> Search</Button>
                </Col>
            </Row>
        </Card>
    )
}
