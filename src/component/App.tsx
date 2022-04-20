import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Home} from "./home/Home";
import GroupsContext from "./contexts/Groups";
import {Route, Routes} from 'react-router';
import {getGroups} from "music-logger-service";

export const REQUEST_URL = process.env.REACT_APP_API_URL ?? ''
export const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL ?? ''
export const TRACKS_PER_PAGE = parseInt(process.env.REACT_APP_TRACKS_PER_PAGE ?? '20')

function App() {
    const [groups, setGroups] = useState<string[]>([])

    useEffect(() => {
        getGroups(REQUEST_URL, false).then(setGroups)
    }, [])

    if (groups.length == 0) {
        return <p>Loading...</p>
    }

    return (
        <GroupsContext.Provider value={groups}>
            <Routes>
                <Route path="/" element={<Home underground={false}/>}/>
                <Route path="/underground" element={<Home underground={true}/>}/>
                <Route path="*" element={<p>404 lol</p>}/>
            </Routes>
        </GroupsContext.Provider>
    );
}

export default App;
