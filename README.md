# MERN project starter template (Typescript)

This is a MERN (MongoDB, Express, React, Node.js) project starter template that uses Typescript.

## Features

- MERN stack with Typescript
- Tailwind CSS and Ant Design for UI design
- Redux Toolkit and RTK Query for state management
- Base 2 JWT token authentication
- Login with Google using Firebase Authentication

## Requirement

- Docker >= 20.10
- Docker compose plugin
- NodeJS 18

## How to use it

Run the following command in the root directory of project:

```bash
make devup
```

This will create a `.env` file in the root directory. You can configure environment variables in this file according to your needs.

Install dependencies:

```bash
make devinstall
```

Add secret key for JWT token:

```bash
make genkey
```

Replace the results obtained with the following values in the `server/.env`:

```bash
ACCESS_TOKEN_SECRET=<your access token secret>
REFRESH_TOKEN_SECRET=<your refresh token secret>
```

Set up a Firebase project and configure the necessary environment variables:

1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Enable the `Authentication`, `Storage` for the project
3. Obtain the Firebase configuration values (API key, database URL, etc.)
4. Add the following environment variables to the `.env` file at `client`:

```bash
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGE_SENDER_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

5. Generate a private key file for your service account: `Settings > Service Accounts > Generate New Private Key`
6. Add the following environment variables to the `.env` file at `server`:

```bash
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
FIREBASE_CLIENT_ID=
FIREBASE_AUTH_URI=
FIREBASE_TOKEN_URI=
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=
FIREBASE_CLIENT_X509_CERT_URL=
```

Start the app in the development mode:

```bash
make devrun
```

The app will run by default at `project.localhost:3000`, and you can custom it in the `.env` file in the root directory.

Stop the application:

```bash
make devdown
```

Happy coding ><
