import React, {createRef, FormEvent, Fragment, useEffect, useState} from 'react'
import './Home.scss'
import {
    Button, Card,
    Col,
    Container, Dropdown,
    Form,
    FormControl,
    InputGroup,
    Nav,
    Navbar,
    NavDropdown,
    Row,
    Table
} from "react-bootstrap";
import {Track} from "../../logic/objects";
import {fetchUrl, REQUEST_URL} from "../../logic/requests";
import {getGroups} from "../../logic/groups";
import {DateTimeChooser} from "../date_time_chooser/DateTimeChooser";
import {formatDate, prettyFormatDate} from "../../logic/date_utils";
import {CustomToggle, DropdownDate} from "../dropdown_date/DropdownDate";
import SearchDateContext, {SearchDateState} from '../SearchDate';
import {Simulate} from "react-dom/test-utils";

const originalListUrl = `${REQUEST_URL}/tracks/list`

export const Home = () => {
    const [tracks, setTracks] = useState<Track[]>([])
    const [editingTrack, setEditingTrack] = useState<Track | undefined>()
    const [nextUrl, setNextUrl] = useState(`${originalListUrl}?count=5`)
    const [date, setDate] = useState<Date>(new Date())
    const [groups, setGroups] = useState<string[]>([])
    const [startDate, setStartDate] = useState<Date | undefined>()
    const [endDate, setEndDate] = useState<Date | undefined>()

    // TODO: Move editing row in a separate component maybe?
    let artistRef = createRef<HTMLInputElement>()
    let titleRef = createRef<HTMLInputElement>()
    let groupRef = createRef<HTMLSelectElement>()

    // TODO: Move searching too maybe?
    let searchArtistRef = createRef<HTMLInputElement>()
    let searchTitleRef = createRef<HTMLInputElement>()

    useEffect(() => {
        getGroups(false).then(setGroups)
        loadTracks()
    }, [])

    // Ensure groups are loaded
    if (groups.length == 0) {
        return <p>Loading</p>
    }

    function loadTracks(): Promise<any> {
        console.log('curr = ' + nextUrl);
        return loadTracksFromUrl(nextUrl)
    }

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

        return loadTracksFromUrl(`${originalListUrl}?${urlQuery}`, true)
    }

    function loadTracksFromUrl(url: string, overrideList: boolean = false): Promise<any> {
        return fetchUrl(url)
            .then(async res => {
                if (res.status != 200) {
                    console.error(`Erroneous status of ${res.status}: ${await res.json()}`)
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
                <td>{prettyFormatDate(track.time)}</td>
                <td>
                    <Button variant="primary" size="sm" className="me-2" onClick={() => {
                        setDate(track.time)
                        setEditingTrack(track);
                    }}>Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => deleteTrack(track)}>Delete</Button>
                </td>
            </tr>
        )
    }

    function submitEdit(id: number) {
        let title = titleRef.current?.value ?? ''
        let artist = artistRef.current?.value ?? ''
        let group = groupRef.current?.value ?? ''

        return fetchUrl('/tracks/update', undefined, {
            method: 'PATCH',
            body: JSON.stringify({
                'id': id,
                'title': title,
                'artist': artist,
                'group': group,
                'time': formatDate(date)
            })
        }).then(async res => {
            if (res.status != 200) {
                console.error(`Erroneous status of ${res.status}: ${await res.json()}`)
                return
            }

            setTracks(oldTracks => {
                let editedTrack = oldTracks.find(track => track.id == id)
                if (editedTrack == undefined) {
                    console.error('Edited track not found!');
                    return oldTracks
                }

                editedTrack.title = title
                editedTrack.artist = artist
                editedTrack.group = group
                editedTrack.time = date
                return oldTracks
            })
        })
    }

    function displayEditRow(track: Track): JSX.Element {
        return (
            <tr className="edit-row">
                <td><FormControl ref={artistRef} className="form-control" name="artist" defaultValue={track.artist}/>
                </td>
                <td><FormControl ref={titleRef} className="form-control" name="title" defaultValue={track.title}/></td>
                <td>
                    <Form.Select ref={groupRef} defaultValue={track.group}>
                        {groups.map(group => <option value={group} selected={track.group == group}>{group}</option>)}
                    </Form.Select>
                </td>
                <td className="date-time-col">
                    <DateTimeChooser date={date} onChange={setDate}/>
                </td>
                <td>
                    <Button variant="primary" size="sm" className="me-2" onClick={() => submitEdit(track.id)}>Update</Button>
                    <Button variant="danger" size="sm" onClick={() => setEditingTrack(undefined)}>Cancel</Button>
                </td>
            </tr>
        )
    }

    return (
        <Fragment>
            <Navbar expand="lg" bg="dark" variant="dark">
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

            <Container className="pt-4">
                <Card body>
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
