# <img align="center" src="frontend/public/Logo_Icon_100x100.png" alt="Logo" width="35" height="35"/> RequestBasket

RequestBasket is a web service that allows you to create unique web hooks to capture, log, and inspect HTTP requests via public API or simple user interface.

## Preview
<img src="assets/create_basket.png" alt="Create a Basket" width="32%"/> <img src="assets/my_baskets.png" alt="My Baskets" width="32%"/> <img src="assets/basket_request_json.png" alt="Basket with request" width="32%"/>

## Features

- Create a unique basket and endpoint URL for that basket.
- See a list of all basket created by a user.
- Capture HTTP requests sent to a basket and the details of each request, including
- view details of captured requests, including:
  - HTTP method
  - Path
  - Headers
  - Body
- Sort requests sent to a basket in order of most recent or least recent.
- View recent responses sent to a basket with out the need to refesh the page.
- Copy the URL of a basket with a simple mouse click.
- View the responses sent to a basket in JSON format.
- Clear out all captured responses in a basket with a simple mouse click.
- Delete a basket and its contents with a simple mouse click.

### Implementation Details

- Front-end is a single-page web app built with React + TypeScript + [vite](https://vite.dev/) and [material ui](https://mui.com/).
- Back-end is implemented with [express.js](https://expressjs.com/).
- Basket and request metadata are stored in PostgreSQL.
- Request payload data is stored in MongoDB.
- State persistence is implemented via browser local storage, allowing users to access the same baskets across sessions.

## Requirements

In the `backend` directory, create a `.env` file with the following contents:

```env
# PostgreSQL configuration
PGHOST=localhost
PGDATABASE=requestbin
PGPORT=5432           # Default PostgreSQL port
PGUSER=postgres       # Replace with your PostgreSQL username
PGPASSWORD=postgres   # Replace with your PostgreSQL password

# MongoDB configuration
MONGODB_URI=mongodb://localhost:27017 # Default MongoDB URI

# Application port
PORT=3000             # Port the backend server will run on
```

💡**Note:** Ensure that PostgreSQL and MongoDB are installed and running locally with the above credentials. You may need to adjust these values to match your environment.

## Installation

Navigate to the `backend` directory

```bash
cd backend
```

Build the full project

```bash
npm run build:full
```

Start the application

```bash
npm start
```

### API

- [API Documentation](https://github.com/dom-and-the-night-owls/requestbin/wiki/API-Documentation)

### Dependencies

- [`psql`](https://www.postgresql.org/download/)
- [`mongodb`](https://www.mongodb.com/docs/manual/administration/install-community/)
- [`npm`](https://github.com/npm/cli)
