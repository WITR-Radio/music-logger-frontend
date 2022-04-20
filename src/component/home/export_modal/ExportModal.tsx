import React, {createRef, useState} from 'react'
import './ExportModal.scss'
import {Button, Col, Dropdown, Form, Modal, Row} from "react-bootstrap";
import SearchDateContext from "../../contexts/SearchDate";
import {CustomToggle, DropdownDate} from "../../dropdown_date/DropdownDate";
import {prettyFormatDate} from "../../../logic/date_utils";
import {REQUEST_URL} from "../../App";

interface ExportModalProps {
    show: boolean
    onHide: () => void
}

export const ExportModal = (props: ExportModalProps) => {
    const [startDate, setStartDate] = useState<Date | undefined>()
    const [endDate, setEndDate] = useState<Date | undefined>()

    const nameRef = createRef<HTMLInputElement>()
    const limitRef = createRef<HTMLInputElement>()

    function downloadExport() {
        let urlParams = new URLSearchParams()

        let name = nameRef.current?.value ?? ''
        if (name != '') {
            urlParams.append('fileName', name)
        }

        let rows = limitRef.current?.value ?? ''
        if (rows != '') {
            urlParams.append('limit', rows)
        }

        if (startDate != undefined && endDate != undefined) {
            urlParams.append('start', startDate.getTime().toString())
            urlParams.append('end', endDate.getTime().toString())
        }

        let paramString = urlParams.toString()
        if (paramString.length > 0) {
            paramString = `?${paramString}`
        }

        window.open(`${REQUEST_URL}/export${paramString}`, '_blank')
        props.onHide()
    }

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className="ExportModal">
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Export Tracks
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>To </Form.Label>
                        <Row>
                            <Col xs={6}>
                                <SearchDateContext.Provider value={{date: startDate, setDate: setStartDate}}>
                                    <Dropdown>
                                        <Dropdown.Toggle as={CustomToggle}>{startDate == undefined ? 'Select a date' : prettyFormatDate(startDate)}</Dropdown.Toggle>

                                        <Dropdown.Menu as={DropdownDate}>
                                            <Dropdown.Item>One</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </SearchDateContext.Provider>
                            </Col>
                            <Col xs={6}>
                                <SearchDateContext.Provider value={{date: endDate, setDate: setEndDate}}>
                                    <Dropdown>
                                        <Dropdown.Toggle as={CustomToggle}>{endDate == undefined ? 'Select a date' : prettyFormatDate(endDate)}</Dropdown.Toggle>

                                        <Dropdown.Menu as={DropdownDate}>
                                            <Dropdown.Item>One</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </SearchDateContext.Provider>
                            </Col>
                        </Row>
                        <Form.Text className="text-muted">If nothing is set, all tracks will be exported</Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Limit</Form.Label>
                        <Form.Control ref={limitRef} type="number" placeholder="Leave blank for all" />
                        <Form.Text className="text-muted">The amount of rows to return in the exported file</Form.Text>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>File name</Form.Label>
                        <Form.Control ref={nameRef} type="text" defaultValue="export.csv" />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => downloadExport()}>Export</Button>
                <Button variant="light" onClick={() => props.onHide()}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}
