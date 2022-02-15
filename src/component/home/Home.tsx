import React, {FormEvent, useState} from 'react'
import './Home.scss'
import {Button, Col, Form, Row, Table} from "react-bootstrap";
import {Track} from "../../logic/objects";
import {fetchUrl, REQUEST_URL} from "../../logic/requests";

const originalListUrl = `${REQUEST_URL}/tracks/list`

export const Home = () => {
    const [tracks, setTracks] = useState<Track[]>([])
    const [nextUrl, setNextUrl] = useState(`${originalListUrl}?count=5`)

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
    )
}
