import React, {FormEvent, useState} from 'react'
import './Home.scss'
import {Button, Col, Container, Form, Row, Table} from "react-bootstrap";
import {Track} from "../../logic/objects";
import {fetchApi, fetchUrl, REQUEST_URL} from "../../logic/requests";

const originalListUrl = `${REQUEST_URL}/tracks/list?count=5`

export const Home = () => {
    const [tracks, setTracks] = useState<Track[]>([])
    const [nextUrl, setNextUrl] = useState(originalListUrl)

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // @ts-ignore
        let search = event.target[0].value
        console.log('Searching: ' + search);
    }

    function loadTracks() {
        console.log('curr = ' + nextUrl);
        fetchUrl(nextUrl)
            .then(async res => {
                if (res.status != 200) {
                    console.log(`Erroneous status of ${res.status}: ${await res.json()}`)
                    return []
                }

                let json = await res.json()

                // @ts-ignore
                setNextUrl(json['_links']['next'])

                setTracks(old => [...old, ...json['tracks'].map((track: any) => Track.fromJSON(track))])
            })
    }

    return (
        <Row className="Home justify-content-md-center m-0">
            <Col xl={8}>
                <Row>
                    <h2>Music Logger</h2>
                </Row>
                <Row>
                    <p>Filter:</p>
                    <Form onSubmit={e => handleSubmit(e)}>
                        <Row>
                            <Form.Group as={Col} controlId="formGridCity">
                                <Form.Label>Search</Form.Label>
                                <Form.Control />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Row>
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
                <Row>
                    <Button variant="secondary" type="submit" onClick={() => loadTracks()}>
                        Show more
                    </Button>
                </Row>
            </Col>
        </Row>
    )
}
