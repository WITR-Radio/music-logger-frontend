import React, {createRef, useContext} from 'react'
import {Button, Form, Modal} from "react-bootstrap";
import GroupsContext from "../../contexts/Groups";

interface ImportModalProps {
    show: boolean
    underground: boolean
    onHide: () => void
    importTrack: (artist: string, title: string, group: string) => void
}

export const ImportModal = (props: ImportModalProps) => {
    const csvRef = createRef<HTMLTextAreaElement>()

    const groupRef = createRef<HTMLSelectElement>()
    const groups = useContext(GroupsContext)

    /**
     * Trims each value of the CSV line (in the form of an array of values) and unescapes commas and double quotes.
     *
     * @param line The line to clean up
     * @return The cleaned up line array
     */
    const cleanLine = (line: string[]): string[] => line.map(value => value.replace('\\,', ',')
        .trim()).map(value => {
        if (value.startsWith('"') && value.endsWith('"')) {
            return value.substring(1, value.length - 1)
        }

        return value
    })

    /**
     * Parses a very simple CSV. Commas and double quotes may be escaped once.
     *
     * @param csvText The text to parse as a CSV
     * @return The resulting 2D array of the CSV file
     */
    const parseCSV = (csvText: string): string[][] => csvText.split('\n')
        .map(line => line.split(/(?<=[^\\]),/))
        .map(cleanLine)

    const applyImport = (): void => {
        if (csvRef.current != undefined && groupRef.current != undefined) {
            let csvValue = csvRef.current.value
            let parsedCSV = parseCSV(csvValue)
            for (let row of parsedCSV) {
                props.importTrack(row[0], row[1], groupRef.current.value)
            }
        }
        
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
                    Import Tracks
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Default Time </Form.Label>
                        <Form.Select ref={groupRef} defaultValue={groups[0]}>
                            {groups.map(group => <option value={group}>{group}</option>)}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Track CSV</Form.Label>
                        <Form.Control ref={csvRef} as="textarea" rows={10}/>
                        <Form.Text className="text-muted">Format must be Artist,Track format</Form.Text>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => applyImport()}>Import</Button>
                <Button variant="light" onClick={() => props.onHide()}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}
