# MERN project starter template (Typescript)

This is a MERN (MongoDB, Express, React, Node.js) project starter template that uses Typescript.

## Features

- MERN stack with Typescript
- Tailwind CSS and Ant Design for UI design
- Redux Toolkit and RTK Query for state management
- Base 2 JWT token authentication

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

```
ACCESS_TOKEN_SECRET=<your access token secret>
REFRESH_TOKEN_SECRET=<your refresh token secret>
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
