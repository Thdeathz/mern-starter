# Nodejs + MongoDB

## Getting Started

Install the dependencies:

```
npm install
```

Create a `.env` file in the server folder and add the following variables:

```
PORT=<your-server-port>
DATABASE_URI=<your-database-uri>
ACCESS_TOKEN_SECRET=<your-access-token-secret>
REFRESH_TOKEN_SECRET=<your-refresh-token-secret>
```

You can generate a secret key by running the following command in Node.js:

```
require('crypto').randomBytes(128).toString('hex')
```

Start the server:

```
npm run dev
```

The server will start running at `http://localhost:3500`.

## Folder Structure

```
├── public                 # Contains css for html response
├── src
│   ├── @types             # Contains global types
│   ├── config             # Contains db connection and cors configuration
│   ├── controllers
│   ├── middleware
│   ├── models
│   └── routes
├── server.ts              # Entry point of server
├── views                  # Contains html response
└── README.md              # This file
```
