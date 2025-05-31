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

## Configuration

Depending on the settings of your `psql` and `mongod` services, you may need to specify some connection options like user, password, port, etc.
To do so, create a `.env` file in the `backend` directory according to the format of the provided `.env.example` file:

```env
# Example .env file
# All values are optional

# Application port
PORT=3000             # Port the backend server will run on

# Postgres configuration
PGHOST=localhost
PGPORT=5432
PGDATABASE=requestbin
PGUSER=postgres
PGPASSWORD=password

# MongoDB configuration
MONGO_HOST=localhost
MONGO_DBNAME=requestBodies
MONGO_USER=mongoUser
MONGO_PASS=password
MONGO_TLS=true
MONGO_CA_PATH=/path/to/tlsCertKeyFile.pem
MONGO_REPLICA_SET=rs0
MONGO_READ_PREF=secondaryPreferred
MONGO_RETRY_WRITES=false
MONGO_AUTH_SRC=admin

```

💡**Note:** Ensure that PostgreSQL and MongoDB are installed and running locally with the above credentials. You may need to adjust these values to match your environment.

## Installation

Navigate to the `backend` directory

```bash
cd backend
```

Build the full project

```bash
npm run build
```

Start the application

```bash
npm start
```

If serving on `nginx`:

```bash
npm run nginx
```

- copies contents of `dist/` to `/var/www/requestbin`
- dist/ should be built with `npm run build` or `npm run build:frontend` first.

### API

- [API Documentation](https://github.com/dom-and-the-night-owls/requestbin/wiki/API-Documentation)

### Dependencies

- [`psql`](https://www.postgresql.org/download/)
- [`mongodb`](https://www.mongodb.com/docs/manual/administration/install-community/)
- [`npm`](https://github.com/npm/cli)
