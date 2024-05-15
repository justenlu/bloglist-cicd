# Bloglist in a single repo

This repository was made for exercise 11.20 Your own pipeline in [Part 11](https://fullstackopen.com/osa11) of [Full Stack open](https://fullstackopen.com/) course. In this exercise the Bloglist app that was earlier developed in separate repositories for backend, frontend and end to end tests was packed to a single repository for building deployment pipeline for the app.

## Structure of the repository

Backend was placed at the root of the repository. Frontend was placed to frontend folder and end to end tests to e2e-tests folder. When the frontend is build, it is placed to build folder. When backend is run, it serves the frontend from the build folder.

## Building and running the production version

To build the frontend, run:

```bash
npm run build
```

To start the production version, run:

```bash
npm run start-prod
```

The backend now serves both the api and the frontend that uses the api.

## Developing

For development it is still possible to run backend and frontend separately using the following commands:

| command                 | uses               | port definition file  | port field in the file |
|-------------------------|--------------------|-----------------------|------------------------|
| `npm run dev-backend`   | nodemon            | .env                  | BACKEND_PORT           |
| `npm run dev-frontend`  | webpack-dev-server | webpack.config.js     | devServer.port         |

When run this way, the backend still serves the version of the frontend that was build with `npm run build`, but the development version of the frontend is available in the port that was defined for the webpack-dev-server.

The url of the backend that the frontend shoud use when running in development mode is defined in webpack.config.js in this line:

```js
const backend_url = argv.mode === 'production' ? '' : 'http://localhost:3003'

```

When frontend is build for production, the `backend_url` gets empty string as its value and the urls the frontend uses will be relational.

## Testing

When backend, frontend and end to end tests were all in different repositories, the following tools and scripts were used for testing:

| repository         | tool | script                                               |
|--------------------|------|-------------------------------------------------------|
| backend            | jest | `cross-env NODE_ENV=test jest --verbose --runInBand`  |
| frontend           | vitest | `vitest run`                                        |
| end to end tests   | playwright | `playwright show-report`                        |

Now following commands are used for testing:

| command | used for |
|---------| ---------|
| `npm run test-backend` | runs tests for backend using jest |
| `npm run test-frontend` | runs tests for frontend using vitest |
| `npm run test-e2e` | runs end to end tests using playwright |

