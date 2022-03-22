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

export const originalListUrl = `${REQUEST_URL}/tracks/list`

export const Home = () => {
    const [tracks, setTracks] = useState<Track[]>([])
    const [addingRows, setAddingRows] = useState<number[]>([]) // A list of AddRow IDs
    const [editingTrack, setEditingTrack] = useState<Track | undefined>()
    const [exporting, setExporting] = useState<boolean>(false)
    const [nextUrl, setNextUrl] = useState(`${originalListUrl}?count=5`)
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
        return fetchApi('/tracks/remove', {id: track.id.toString(), underground: 'false'}, {
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
            <tr> {/* className="table-warning" */}
                <td>{track.artist}</td>
                <td>{track.title}</td>
                <td>{track.group}</td>
                <td>{prettyFormatDate(track.time)}</td>
                <td>
                    <Button variant="primary" size="sm" className="me-2" onClick={() => {
                        setEditingTrack(track);
                    }}>Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => deleteTrack(track)}>Delete</Button>
                </td>
            </tr>
        )
    }

    function displayEditRow(track: Track): JSX.Element {
        return <EditRow track={track} stopEditing={() => setEditingTrack(undefined)} updateTracks={setTracks}/>
    }

    function removeAddRow(id: number) {
        setAddingRows(old => old.filter(i => i != id))
    }

    function addTrack(addRowId: number, track: Track | undefined) {
        if (track == undefined) {
            removeAddRow(addRowId)
            return
        }

        setTracks(old => [track, ...old])
    }

    function onClickAddSong() {
        setAddingRows(old => [addRowId++, ...old])
    }

    function onClickAddEvent() {

    }

    return (
        <Fragment>
            <ExportModal show={exporting} onHide={() => setExporting(false)}/>

            <Navbar expand="lg" bg="dark" variant="dark">
                <Container fluid>
                    <Navbar.Brand href="#">WITR Logger</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="#">FM Playlist</Nav.Link>
                        <Nav.Link href="#">UDG Playlist</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link onClick={() => setExporting(true)}>Export</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>

            <Container className="pt-4">
                <Search loadTracks={url => loadTracksFromUrl(url, true)}/>

                <div className="button-bar">
                    <Button variant="primary" onClick={() => onClickAddSong()}>
                        <i className="bi bi-music-note-beamed"></i> Add Song
                    </Button>
                    <Button variant="info" onClick={() => onClickAddEvent()}>
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
                        {addingRows.map(i => <AddRow id={i} removeRow={() => removeAddRow(i)} addTrack={(track) => addTrack(i, track)}/>)}
                        {tracks.map(track => track == editingTrack ? displayEditRow(track) : displayRow(track))}
                    </tbody>
                </Table>
                <Row className="justify-content-md-center">
                    <Col md="auto">
                        <Button variant="secondary" onClick={() => loadTracks()}>Load More</Button>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    )
}
