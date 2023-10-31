import React, {Fragment, useEffect, useState} from 'react'
import './Home.scss'
import {Button, Col, Container, Nav, Navbar, Row, Table} from "react-bootstrap";
import {prettyFormatDate} from "../../logic/date_utils";
import {EditRow} from "./edit_row/EditRow";
import {Search} from "./search/Search";
import {ExportModal} from "./export_modal/ExportModal";
import {AddRow, PrefilledTrack} from "./add_row/AddRow";
import {getTableColor} from "../contexts/Groups";
import {Track, TrackContext, TrackHandler, TrackReceiver} from "@witr-radio/music-logger-service";
import {REQUEST_URL, TRACKS_PER_PAGE, WEBSOCKET_URL} from "../App";
import {classes} from "../../logic/utility";
import {ImportModal} from "./import_modal/ImportModal";

enum ModalShowing {
    None,
    Export,
    Import
}

type AddRowInfo = {
    id: number
    event: boolean

    /**
     * If set, this is the track that will initially be shown in the add row.
     */
    track?: PrefilledTrack | undefined
}

interface HomeProps {
    underground: boolean
}

export const Home = (props: HomeProps) => {
    const [tracks, setTracks] = useState<Track[]>([])
    const [addingRows, setAddingRows] = useState<AddRowInfo[]>([]) // A list of AddRow IDs
    const [editingTrack, setEditingTrack] = useState<Track | undefined>()
    const [modalShown, setModalShown] = useState<ModalShowing>(ModalShowing.None)
    const [naturalOrderAdding, setNaturalOrderAdding] = useState<boolean>(true)
    const [addRowId, setAddRowId] = useState<number>(0)
    const [trackHandler] = useState<TrackHandler>(new TrackHandler(setTracks, REQUEST_URL, props.underground, TRACKS_PER_PAGE))
    const [trackReceiver] = useState<TrackReceiver>(new TrackReceiver(WEBSOCKET_URL, props.underground, trackBroadcast => {
        if (!trackHandler.searching) {
            trackHandler.manualAddTrack(trackBroadcast.track)
        }
    }))

    function isAnyModifying(): boolean {
        return editingTrack != undefined || addingRows.length > 0
    }

    useEffect(() => {
        trackReceiver.connectWebsocket()

        trackHandler.loadMoreTracks()
    }, [])

    function displayRow(track: Track): JSX.Element {
        return (
            <tr key={track.id} className={`${getTableColor(track.group)} align-middle`}>
                <td colSpan={track.isEvent() ? 3 : 1}>{track.artist}</td>
                {!track.isEvent() && <Fragment>
                    <td className="title">{track.title}</td>
                    <td>{track.group}</td>
                </Fragment>}
                <td>{prettyFormatDate(track.time)}</td>
                <td>
                    <div className="d-flex justify-content-end">
                        {/*{track.streaming.map(link => <a key={link.link} className="btn btn-outline-success me-2" href={link.link} target="_blank" rel="noreferrer" title="Spotify Link">Spotify</a>)}*/}
                        <Button variant="primary" size="sm" className="me-2" onClick={() => {
                            setEditingTrack(track);
                        }}>Edit</Button>
                        <Button variant="danger" size="sm" onClick={() => trackHandler.deleteTrack(track)}>Delete</Button>
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

    const addTrackLocal = (event: boolean, prefilledTrack?: PrefilledTrack) => {
        setAddRowId(oldId => {
            setAddingRows(old => [{id: oldId, event: event, track: prefilledTrack}, ...old])
            return oldId + 1;
        })
    }

    const importTrack = (artist: string, title: string, group: string): void => {
        addTrackLocal(false, {artist: artist, title: title, group: group})
    }

    const toggleAddTrackOrder = (): void => {
        setNaturalOrderAdding(old => !old)
    }

    const optionallyReverse = (rows: AddRowInfo[]): AddRowInfo[] => {
        if (naturalOrderAdding) {
            return rows
        }

        let copy = [...rows]
        copy.reverse()
        return copy
    }

    return (
        <TrackContext.Provider value={{trackHandler: trackHandler, trackReceiver: trackReceiver}}>
            <ExportModal show={modalShown == ModalShowing.Export} onHide={() => setModalShown(ModalShowing.None)} underground={props.underground}/>
            <ImportModal show={modalShown == ModalShowing.Import} onHide={() => setModalShown(ModalShowing.None)} underground={props.underground} importTrack={importTrack}/>

            <Navbar bg="dark" variant="dark">
                <Container fluid>
                    <Navbar.Brand href="#">WITR Logger</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/" active={!props.underground}>FM Playlist</Nav.Link>
                        <Nav.Link href="/underground" active={props.underground}>UDG Playlist</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link onClick={() => setModalShown(ModalShowing.Import)}>Import</Nav.Link>
                        <Nav.Link onClick={() => setModalShown(ModalShowing.Export)}>Export</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>

            <div className="pt-4 col-sm-12 col-mg-10 container-lg">
                <Container className="text-center mb-4">
                    <h1>{props.underground ? 'Underground' : 'FM'} Playlist</h1>
                </Container>

                <Search/>

                <div className="justify-content-md-center d-flex my-3">
                    <Button className="me-2" variant="primary" onClick={() => addTrackLocal(false)}>
                        <i className="bi bi-music-note-beamed"></i> Add Song
                    </Button>
                    <Button variant="info" onClick={() => addTrackLocal(true)}>
                        <i className="bi bi-calendar-event-fill"></i> Add Event
                    </Button>
                    {addingRows.length > 1 && <Button className="ms-2" variant="primary" onClick={toggleAddTrackOrder}>
                        <i className="bi bi-arrow-down-up"></i></Button>}

                </div>

                <div className={classes('table-wrapper', ['wide-table', isAnyModifying()])}>
                    <Table hover>
                        <thead>
                        <tr>
                            <th scope="col" className="artist">Artist</th>
                            <th scope="col" className="title">Title</th>
                            <th scope="col" className="type">Type</th>
                            <th scope="col" className="time">Play Time</th>
                            <th scope="col" className="buttons"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {optionallyReverse(addingRows).map(i =>
                            <AddRow key={i.id} id={i.id} event={i.event} prefilledTrack={i.track} addComplete={() => removeAddRow(i.id)}/>)}
                        {tracks.map(track => track == editingTrack ? displayEditRow(track) : displayRow(track))}
                        </tbody>
                    </Table>
                </div>
                <Row className="justify-content-md-center mb-4">
                    <Col md="auto">
                        <Button variant="secondary" onClick={() => trackHandler.loadMoreTracks()}>Load More</Button>
                    </Col>
                </Row>
            </div>
        </TrackContext.Provider>
    )
}
