## Music Logger Frontend

The new music logger, soon available at logger.witr.rit.edu

Environment variables:
```
REACT_APP_API_URL - The base backend API URL, e.g. http://localhost:5000/api
REACT_APP_WEBSOCKET_URL - The full track streaming websocket URL, e.g. ws://localhost:5000/api/tracks/stream
REACT_APP_TRACKS_PER_PAGE - The amount of tracks to fetch per request
```

### Development

Since this uses a private NPM repository for accessing the logger API, you need to insert a GitHub access token (with access to packages) after the following line in the `.npmrc` file in the root directory:

```
npm.pkg.github.com/:_authToken=
```
