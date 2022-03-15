import React, {createRef, FormEvent, Fragment, RefObject, useEffect, useState} from 'react'
import './Home.scss'
import {
    Button,
    ButtonGroup,
    Col,
    Container,
    Form,
    FormControl,
    Nav,
    Navbar,
    NavDropdown,
    Row,
    Table
} from "react-bootstrap";
import {Track} from "../../logic/objects";
import {fetchUrl, REQUEST_URL} from "../../logic/requests";
import {Range} from 'react-date-range';
import {getGroups} from "../../logic/groups";

const originalListUrl = `${REQUEST_URL}/tracks/list`

const bruh: Range = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'range',
}

export const Home = () => {
    const [tracks, setTracks] = useState<Track[]>([])
    const [editingTrack, setEditingTrack] = useState<Track | undefined>()
    const [nextUrl, setNextUrl] = useState(`${originalListUrl}?count=5`)
    const [range, setRange] = useState<Range>(bruh);
    const [groups, setGroups] = useState<string[]>([])

    // For editing
    let artistRef = createRef<HTMLInputElement>()
    let titleRef = createRef<HTMLInputElement>()
    let groupRef = createRef<HTMLSelectElement>()

    useEffect(() => {
        getGroups(false).then(setGroups)
        loadTracks()
    }, [])

    // Ensure groups are loaded
    if (groups.length == 0) {
        return <p>Loading</p>
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // @ts-ignore
        let artist = event.target[0].value.trim()

        // @ts-ignore
        let track = event.target[1].value.trim()

        console.log(`Searching artist: ${artist} track: ${track}`);

        await searchTracks(artist, track)
    }

    function loadTracks(): Promise<any> {
        console.log('curr = ' + nextUrl);
        return loadTracksFromUrl(nextUrl)
    }

    function searchTracks(artist: string, track: string): Promise<any> {
        let urlQuery = new URLSearchParams([['count', '5']])

        if (artist.length > 0) {
            urlQuery.append('artist', artist)
        }

        if (track.length > 0) {
            urlQuery.append('song', track)
        }

        return loadTracksFromUrl(`${originalListUrl}?${urlQuery}`, true)
    }

    function loadTracksFromUrl(url: string, overrideList: boolean = false): Promise<any> {
        return fetchUrl(url)
            .then(async res => {
                if (res.status != 200) {
                    console.log(`Erroneous status of ${res.status}: ${await res.json()}`)
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
        // TODO: deleteTrack
    }

    function displayRow(track: Track): JSX.Element {
        return (
            <tr> {/* className="table-warning" */}
                <td>{track.artist}</td>
                <td>{track.title}</td>
                <td>{track.group}</td>
                <td>{track.time}</td>
                <td>
                    <Button variant="primary" size="sm" className="me-2" onClick={() => setEditingTrack(track)}>Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => deleteTrack(track)}>Delete</Button>
                </td>
            </tr>
        )
    }

    function submitEdit(id: number) {
        console.log(artistRef.current?.value);
        console.log(titleRef.current?.value);
        console.log(groupRef.current?.value);

        // TODO: Updating time
        // return fetchUrl('/tracks/update', undefined, {
        //     method: 'PATCH',
        //     body: JSON.stringify({
        //         'id': id,
        //
        //     })
        // })
    }

    function displayEditRow(track: Track): JSX.Element {
        return (
            <tr>
                <td><FormControl ref={artistRef} className="form-control" name="artist" defaultValue={track.artist}/></td>
                <td><FormControl ref={titleRef} className="form-control" name="title" defaultValue={track.title}/></td>
                <td>
                    <Form.Select ref={groupRef} defaultValue={track.group}>
                        {groups.map(group => <option value={group} selected={track.group == group}>{group}</option>)}
                    </Form.Select>
                </td>
                <td><FormControl className="form-control" name="play_time"/></td>
                <td>
                    <Button variant="primary" size="sm" className="me-2" onClick={() => submitEdit(track.id)}>Update</Button>
                    <Button variant="danger" size="sm" onClick={() => setEditingTrack(undefined)}>Cancel</Button>
                </td>
            </tr>
        )
    }

    return (
        <Fragment>
            <Navbar expand="lg" bg="dark">
                <Container fluid>
                    <Navbar.Brand href="#">WITR Logger</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    {/*<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">*/}
                    {/*    <span className="navbar-toggler-icon"></span>*/}
                    {/*</button>*/}
                    <Navbar.Collapse id="navbarSupportedContent">
                        <Nav className="me-auto">
                            <Nav.Link href="#">FM Playlist</Nav.Link>
                            <Nav.Link href="#">UDG Playlist</Nav.Link>
                            {/*<li className="nav-item">*/}
                            {/*    <a className="nav-link active" href="#">FM Playlist</a>*/}
                            {/*</li>*/}
                            {/*<li className="nav-item">*/}
                            {/*    <a className="nav-link" href="#">UDG Playlist</a>*/}
                            {/*</li>*/}
                            <NavDropdown title="Airplay Reports">
                                {/*<a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">*/}
                                {/*    Airplay Reports*/}
                                {/*</a>*/}
                                <NavDropdown.Item>Weekly Charts</NavDropdown.Item>
                                <NavDropdown.Item>Category Breakdown</NavDropdown.Item>
                                <NavDropdown.Item>Playlist Export</NavDropdown.Item>
                                <NavDropdown.Divider/>
                                <NavDropdown.Item>FM Streaming Statistics</NavDropdown.Item>
                                <NavDropdown.Item>UDG Streaming Statistics</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container>
                {/*<div className="card card-body" id="search">
                    <div className="row">
                        <div className="col">
                            <label htmlFor="dateSelect" className="col-form-label">Date</label>
                            <select className="form-select" id="dateSelect">
                                <option selected>Open this select menu</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </select>
                        </div>
                        <div className="col">
                            <label htmlFor="dateSelect" className="col-form-label">Between</label>
                            <div className="row g-3">
                                <div className="col-6">
                                    <select className="form-select" id="dateSelect">
                                        <option selected>Open this select menu</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </select>
                                </div>
                                <div className="col-6">
                                    <select className="form-select" id="dateSelect">
                                        <option selected>Open this select menu</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <label htmlFor="artist" className="col-form-label">Artist</label>
                            <input type="text" className="form-control" id="artist"/>
                        </div>
                        <div className="col">
                            <label htmlFor="title" className="col-form-label">Title</label>
                            <input type="text" className="form-control" id="title"/>
                        </div>
                    </div>
                    <div className="adv-search-btn-box">
                        <a href="#" className="btn btn-success"><i className="bi bi-search"></i> Search</a>
                    </div>
                </div>*/}

                <div className="button-bar">
                    <a className="btn btn-primary">
                        <i className="bi bi-music-note-beamed"></i> Add Song
                    </a>
                    <a className="btn btn-info">
                        <i className="bi bi-calendar-event-fill"></i> Add Event
                    </a>

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
                    <tr>
                        <td><FormControl className="form-control" name="artist"/></td>
                        <td><FormControl className="form-control" name="title"/></td>
                        <td>
                            <select className="form-select" id="dateSelect">
                                <option selected>Select Group</option>
                                <option value="1">Rotation</option>
                                <option value="2">New Bin</option>
                                <option value="2">Library</option>
                                <option value="3">Specialty Show</option>
                            </select>
                        </td>
                        <td><FormControl className="form-control" name="play_time"/></td>
                        <td>
                            <div>
                                <Button variant="success" size="sm" className="me-2">Add</Button>
                                <Button variant="danger" size="sm">Cancel</Button>
                            </div>
                        </td>
                    </tr>
                    {tracks.map(track => track == editingTrack ? displayEditRow(track) : displayRow(track))}
                    </tbody>
                </Table>
                <Row className="justify-content-md-center">
                    <Col md="auto">
                        <Button variant="secondary" onClick={() => loadTracks()}>Load More</Button>
                    </Col>
                </Row>
            </Container>
            {/*
            <Row className="Home justify-content-md-center m-0">
                <Col xl={8}>
                    <Row>
                        <h2>Music Logger</h2>
                    </Row>
                    <Row>
                        <p>Filter:</p>
                        <Form onSubmit={e => handleSubmit(e)}>
                            <Row>
                                <Col xl={3}>
                                    <Form.Group as={Col} controlId="formGridCity">
                                        <Form.Label>Artist</Form.Label>
                                        <Form.Control/>
                                    </Form.Group>
                                </Col>
                                <Col xl={3}>
                                    <Form.Group as={Col} controlId="formGridCity2">
                                        <Form.Label>Track</Form.Label>
                                        <Form.Control/>
                                    </Form.Group>
                                </Col>
                                <Col xl={3}>
                                    <DateRange
                                        ranges={[range]}
                                        editableDateInputs={true}
                                        moveRangeOnFirstSelection={false}
                                        maxDate={new Date()}
                                        onChange={range => setRange(range['range'])}
                                    />
                                </Col>
                            </Row>
                            <Col>
                                <Button variant="primary" type="submit">
                                    Search
                                </Button>
                            </Col>
                        </Form>
                    </Row>
                    <Row>
                        <Table striped hover>
                            <thead>
                            <tr>
                                <th>Artist</th>
                                <th>Title</th>
                                <th>Play Time</th>
                            </tr>
                            </thead>
                            <tbody>
                            {tracks.map(track => <tr key={track.id}>
                                <td>{track.artist}</td>
                                <td>{track.title}</td>
                                <td>{track.time}</td>
                            </tr>)}
                            </tbody>
                        </Table>
                    </Row>
                    <Row className="justify-content-md-center">
                        <Col xl={2}>
                            <Button variant="secondary" type="submit" onClick={() => loadTracks()}>
                                Show more
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            */}
        </Fragment>
    )
}
