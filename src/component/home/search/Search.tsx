import React, {createRef, useState} from 'react'
import './Search.scss'
import {Button, Card, Col, Dropdown, Form, Row} from "react-bootstrap";
import SearchDateContext from "../../contexts/SearchDate";
import {CustomToggle, DropdownDate} from "../../dropdown_date/DropdownDate";
import {prettyFormatDate} from "../../../logic/date_utils";
import {originalListUrl} from "../Home";

interface SearchProps {
    loadTracks: (url: string) => Promise<any>
}

export const Search = (props: SearchProps) => {
    const [startDate, setStartDate] = useState<Date | undefined>()
    const [endDate, setEndDate] = useState<Date | undefined>()

    const searchArtistRef = createRef<HTMLInputElement>()
    const searchTitleRef = createRef<HTMLInputElement>()

    function handleSearch(): Promise<any> {
        let urlQuery = new URLSearchParams([['count', '5']])

        let artist = searchArtistRef.current?.value ?? ''
        if (artist != '') {
            urlQuery.append('artist', artist)
        }

        let title = searchTitleRef.current?.value ?? ''
        if (title != '') {
            urlQuery.append('song', title)
        }

        if (startDate != undefined && endDate != undefined) {
            urlQuery.append('start', startDate.getTime().toString())
            urlQuery.append('end', endDate.getTime().toString())
        }

        return props.loadTracks(`${originalListUrl}?${urlQuery}`)
    }

    return (
        <Card body className="Search">
            <Row>
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
