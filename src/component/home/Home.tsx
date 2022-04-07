import React, {Fragment, useEffect, useState} from 'react'
import './Home.scss'
import {Button, Col, Container, FormControl, Nav, Navbar, Row, Table} from "react-bootstrap";
import {Track} from "../../logic/objects";
import {fetchApi, fetchUrl, REQUEST_URL} from "../../logic/requests";
import {prettyFormatDate} from "../../logic/date_utils";
import {EditRow} from "./edit_row/EditRow";
import {Search} from "./search/Search";
import {ExportModal} from "./export_modal/ExportModal";
import {AddRow} from "./add_row/AddRow";
import {getTableColor} from "../contexts/Groups";

export const originalListUrl = `${REQUEST_URL}/tracks/list`

type AddRowInfo = {
    id: number
    event: boolean
}

interface HomeProps {
    underground: boolean
}

export const Home = (props: HomeProps) => {
    const [tracks, setTracks] = useState<Track[]>([])
    const [addingRows, setAddingRows] = useState<AddRowInfo[]>([]) // A list of AddRow IDs
    const [editingTrack, setEditingTrack] = useState<Track | undefined>()
    const [exporting, setExporting] = useState<boolean>(false)
    const [nextUrl, setNextUrl] = useState(`${originalListUrl}?count=5&underground=${props.underground}`)
    let addRowId = 0; // To be incremented for every AddRow used

    useEffect(() => {
        loadTracks()
    }, [])

    function loadTracks(): Promise<any> {
        return loadTracksFromUrl(nextUrl)
    }

    function loadTracksFromUrl(url: string, overrideList: boolean = false): Promise<any> {
        return fetchUrl(url)
            .then(async res => {
                if (res.status != 200) {
                    console.error(`[tracks/list] Erroneous status of ${res.status}: ${await res.json()}`)
                    return []
                }

                let json = await res.json()

                // @ts-ignore
                setNextUrl(json['_links']['next'])

                let tracks = json['tracks'].map((track: any) => Track.fromJSON(track))

                if (overrideList) {
                    setTracks(tracks)
                } else {
                    setTracks(old => [...old, ...tracks])
                }
            })
    }

    function deleteTrack(track: Track) {
        return fetchApi('/tracks/delete', {id: track.id.toString(), underground: `${props.underground}`}, {
            method: 'DELETE'
        }).then(async res => {
            if (res.status != 200) {
                console.error(`[tracks/remove] Erroneous status of ${res.status}: ${await res.json()}`)
                return
            }

            setTracks(old => old.filter(oldTrack => oldTrack.id != track.id))
        })
    }

    function displayRow(track: Track): JSX.Element {
        return (
            <tr key={track.id} className={`${getTableColor(track.group)} align-middle`}>
                <td colSpan={track.isEvent() ? 3 : 1}>{track.artist}</td>
                {!track.isEvent() && <Fragment>
                    <td>{track.title}</td>
                    <td>{track.group}</td>
                </Fragment>}
                <td>{prettyFormatDate(track.time)}</td>
                <td>
                    <div className="d-flex justify-content-end">
                        <Button variant="primary" size="sm" className="me-2" onClick={() => {
                            setEditingTrack(track);
                        }}>Edit</Button>
                        <Button variant="danger" size="sm" onClick={() => deleteTrack(track)}>Delete</Button>
                    </div>
                </td>
            </tr>
        )
    }

    function displayEditRow(track: Track): JSX.Element {
        return <EditRow key={track.id} track={track} underground={props.underground} stopEditing={() => setEditingTrack(undefined)} updateTracks={setTracks}/>
    }

    function removeAddRow(id: number) {
        setAddingRows(old => old.filter(i => i.id != id))
    }

    function addTrack(addRowId: number, track: Track | undefined) {
        if (track == undefined) {
            removeAddRow(addRowId)
            return
        }

        setTracks(old => [track, ...old])
    }

    function onClickAdd(event: boolean) {
        setAddingRows(old => [{id: addRowId++, event: event}, ...old])
    }

    return (
        <Fragment>
            <ExportModal show={exporting} onHide={() => setExporting(false)}/>

            <Navbar bg="dark" variant="dark">
                <Container fluid>
                    <Navbar.Brand href="#">WITR Logger</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/" active={!props.underground}>FM Playlist</Nav.Link>
                        <Nav.Link href="/underground" active={props.underground}>UDG Playlist</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link onClick={() => setExporting(true)}>Export</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>

            <Container className="pt-4">
                <Container className="text-center mb-4">
                    <h1>{props.underground ? 'Underground' : 'FM'} Log</h1>
                </Container>

                <Search loadTracks={url => loadTracksFromUrl(url, true)}/>

                <div className="justify-content-md-center d-flex my-3">
                    <Button className="me-2" variant="primary" onClick={() => onClickAdd(false)}>
                        <i className="bi bi-music-note-beamed"></i> Add Song
                    </Button>
                    <Button variant="info" onClick={() => onClickAdd(true)}>
                        <i className="bi bi-calendar-event-fill"></i> Add Event
                    </Button>

                </div>

                <Table hover>
                    <thead>
                    <tr>
                        <th scope="col">Artist</th>
                        <th scope="col">Title</th>
                        <th scope="col">Type</th>
                        <th scope="col">Play Time</th>
                        <th scope="col"></th>
                    </tr>
                    </thead>
                    <tbody>
                        {addingRows.map(i => <AddRow key={i.id} id={i.id} event={i.event} underground={props.underground} removeRow={() => removeAddRow(i.id)} addTrack={(track) => addTrack(i.id, track)}/>)}
                        {tracks.map(track => track == editingTrack ? displayEditRow(track) : displayRow(track))}
                    </tbody>
                </Table>
                <Row className="justify-content-md-center mb-4">
                    <Col md="auto">
                        <Button variant="secondary" onClick={() => loadTracks()}>Load More</Button>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    )
}
