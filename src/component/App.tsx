import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Home} from "./home/Home";
import GroupsContext, {getGroups} from "./contexts/Groups";

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
            <Home/>
        </GroupsContext.Provider>
    );
}

export default App;
