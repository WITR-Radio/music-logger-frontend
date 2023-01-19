## Music Logger Frontend

The frontend for the music logger, written in React and TypeScript.

## Setting Up

Before using, the environment variable files must be created from their templates. The reason for this is so the ones being used aren't tracked by git. To do this, run the following in a bash shell at the root of the project:

```bash
for i in {,.staging,.production}.env.template;do cp $i ${i: 0:-9}; done
```

<details>
<summary>Expand for a description of each environment variable.</summary></br>

```
REACT_APP_API_URL - The base backend API URL, e.g. http://localhost:3000
REACT_APP_WEBSOCKET_URL - The full track streaming websocket URL, e.g. ws://localhost:5000/api/tracks/stream
REACT_APP_TRACKS_PER_PAGE - The amount of tracks to fetch per request
```
</details>

Next, create a GitHub Token with `packages` access, and set it as an environment variable named `NPM_AUTH_TOKEN`. This is due to the logger using a private NPM repository hosted by GitHub.


## Running

Once the above steps are complete, ensure you have set up the [dev-environments](https://github.com/WITR-Radio/dev-environments/tree/master/primary) for `primary`. Start the environment, and run the following command in this repository to bring it to life:

```bash
npm run start
```

## Building

For building, the dev-environment is not necessary, only the set up steps. To build for staging, run the following:

```bash
npm run build
```

To build to production, change the command to:

```bash
npm run build-prod
```

It should be noted both commands have no effect on where the output is, only what `.env` file is used.
