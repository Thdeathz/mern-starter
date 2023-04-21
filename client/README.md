# React + Typescript

## Features

- Ant Design (Antd) and Tailwind CSS for user interface.
- Redux Toolkit for state management.
- RTK Query for making API calls.

## Getting Started

Install the dependencies:

```bash
yarn
```

Create a `.env` file in the client folder and add the following variables:

```bash
VITE_NODE_ENV=
VITE_API_URL=<your-api-url>
```

Start the client:

```bash
yarn dev
```

The client will start running at `http://localhost:3000`.

## Folder Structure

```
├── src
│   ├── @types             # Contains global types
│   ├── app                # Contains redux store and rtk query configuration
│   ├── components         # Contains reusable components
│   ├── config             # Contains enum variable
│   ├── features           # Contains feature modules (e.g., Redux slices)
│   └── hooks              # Contains custom hook
├── App.tsx                # Entry point of the application
└── README.md              # This file
```
