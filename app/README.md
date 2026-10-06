# docker-compose-mongo-demo

A small Node.js app that reads a line of text from MongoDB and shows it on a page, run end to end with Docker Compose.

I built this while working through the Docker Compose section of TechWorld with Nana's course. It started from her [docker-compose-crash-course](https://gitlab.com/twn-youtube/docker-compose-crash-course) repo. I rewrote the Compose file, moved the credentials out of it, wrote a new page, and documented the problems I ran into.

## What runs

| Service | What it does | Port |
|---|---|---|
| `my-app` | Node.js app, built from the `Dockerfile`. Serves the page and the `/fetch-data` route | 3000 |
| `mongodb` | The database. Data lives in the `mongo-data` volume | 27017 |
| `mongo-express` | Web UI for browsing and editing the database | 8081 |

All three share the network Compose creates for the project, so the app reaches the database at the hostname `mongodb`.

## Run it

1. Clone the repo and enter the folder.
2. Copy the example settings and choose your own password:
   ```
   cp .env.example .env
   ```
3. Build and start everything:
   ```
   docker compose up -d --build
   ```
4. Wait about a minute. mongo-express retries its database connection before it starts listening.
5. Open http://localhost:8081 (login `admin` / `pass`) and create the data the app reads:
   - database `my-db`
   - collection `my-collection`
   - one document: `{ "myid": 10, "data": "your text here" }`

   Enter `myid` as a number. The app queries for the number 10, and the string `"10"` will not match.
6. Open http://localhost:3000. Your text appears in the "Read from MongoDB" box. Edit it in mongo-express and reload to see it change.

## Stop it

```
docker compose down      # removes containers, keeps your data
docker compose down -v   # also deletes the data volume
```

## Configuration

Credentials come from `.env`, which is listed in `.gitignore` and never committed. `.env.example` shows the variable names. The app reads `MONGO_DB_USERNAME` and `MONGO_DB_PWD`; the Compose file fills them from `MONGO_USER` and `MONGO_PASSWORD`.

Run `docker compose config` to see the final values Compose passes to each container.

## Problems I hit and how I fixed them

- **MongoDB 8 would not start on Linux kernel 6.19 or newer.** The log said the kernel has a known incompatibility ([SERVER-121912](https://jira.mongodb.org/browse/SERVER-121912)). Setting `GLIBC_TUNABLES=glibc.pthread.rseq=1` on the `mongodb` service got it past the check. This is a workaround, so check whether a fixed image exists before relying on it.
- **The app showed a blank value and the database was empty.** The environment variable names in the Compose file did not match what `server.js` reads. Variable names are case-sensitive.
- **Login failures for a user called `" admin"`.** A space after `=` in a list-style `environment:` entry became part of the value.
- **Edits to `server.js` or `index.html` had no effect.** The code is copied into the image at build time. Rebuild with `docker compose up -d --build`.
- **The page showed nothing and `/fetch-data` returned `{}`.** The database and collection names did not match `server.js` (`my-db` and `my-collection`).

## Layout

```
app/                  Node app: server.js, index.html, package.json
Dockerfile            builds the app image
docker-compose.yaml   the three services and the data volume
.env.example          template for your own .env
```

## Credits

Original tutorial app by Nana Janashia (TechWorld with Nana). Changes and documentation by Amir Ismail.
