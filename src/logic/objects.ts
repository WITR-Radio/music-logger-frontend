export enum Type {
    Track,
    Event
}

function typeFromName(type: string): Type {
    if (type == 'track') {
        return Type.Track
    } else if (type == 'event') {
        return Type.Event
    }

    return Type.Track

    // TODO
    // throw 'Invalid type: ' + type
}

export class Track {
    id: number
    artist: string
    title: string
    time: Date
    group: string // This will be a value of getGroups
    type: Type

    constructor(id: number, artist: string, title: string, time: Date, group: string, type: Type) {
        this.id = id;
        this.artist = artist;
        this.title = title;
        this.time = time;
        this.group = group;
        this.type = type;
    }

    static fromJSON(json: any): Track {
        return new Track(json['id'], json['artist'], json['title'], new Date(Date.parse(json['time'])), json['group'], typeFromName(json['type']))
    }
}
