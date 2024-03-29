# Assignment

- This full stack application consists of two directories
- Frontend directory is a React App with Vite
- Backend directory is an express app

## Stack

- [Bun](https://bun.sh/) as the JS runtime
- [Express](https://expressjs.com/) as the backend framework
- Postgres as the db
- [Tailwindcss](https://tailwindcss.com/) for styling
- [React/Tanstack Query](https://tanstack.com/query/latest) for data fetching on the frontend

## Run locally

- Easiest way to run locally is to use Docker and docker compose
- There is a `sample-docker-compose.yaml` file in the root.
- Pass the `POSTGRES_USER` and `POSTGRES_PASSWORD` variables to the compose file and start it up with `docker compose up -d`.

## Usage

- Go to `localhost:4173` on your browser.
- You will see a sign in and sign up buttons.
- Hit sign up, enter a random name. Do a few sign ups for multiple users to by logging out.
- Copy one of the user's ID and use it for signing in. (There is no authentication).
- Once you login, use send tokens button to send funds to other users.
- Current logged in user data is stored in local storage of the browser.
