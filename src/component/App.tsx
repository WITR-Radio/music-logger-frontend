import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Home} from "./home/Home";
import GroupsContext, {getGroups} from "./contexts/Groups";
import {Route, Routes} from 'react-router';
import TrackHandlerContext from "../../../music-logger-service/src/context";
import {TrackHandler} from "../../../music-logger-service/src";
import {REQUEST_URL} from "../logic/requests";

function App() {
    const [groups, setGroups] = useState<string[]>([])

    useEffect(() => {
        getGroups(false).then(setGroups)
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
