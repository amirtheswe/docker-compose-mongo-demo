# Amir Ismail - DevOps portfolio

A portfolio page served by a Node.js app, with its content stored in MongoDB and everything started by one Docker Compose file.

The name at the top of the page is written in `app/index.html`. The summary, projects, skills and experience are read from the database each time the page loads, so I can change them without rebuilding anything.

It began as TechWorld with Nana's [docker-compose-crash-course](https://gitlab.com/twn-youtube/docker-compose-crash-course). I rewrote the Compose file, moved the credentials into `.env`, replaced the page and the server, and added automatic seeding.

## What runs

| Service | What it does | Port |
|---|---|---|
| `my-app` | Node.js app built from the `Dockerfile`. Serves the page and the `/api/portfolio` route | 3000 |
| `mongodb` | The database. Data lives in the `mongo-data` volume | 27017 |
| `mongo-express` | Web UI for browsing and editing the data | 8081 |

The three services share the network Compose creates, so the app reaches the database at the hostname `mongodb`.

## Run it

1. Clone the repo and enter the folder.
2. Create a `.env` file in the repo root, next to `docker-compose.yaml`, with your own password:
   ```
   printf "MONGO_USER=admin\nMONGO_PASSWORD=choose-a-password\n" > .env
   ```
   The file is not in the repo, because it holds credentials and is listed in `.gitignore`.
3. Build and start everything:
   ```
   docker compose up -d --build
   ```
4. Follow the app log. On the first start it fills the empty collections:
   ```
   docker compose logs -f my-app
   ```
5. Open http://localhost:3000 for the portfolio.
6. Open http://localhost:8081 (login `admin` / `pass`) to browse the data.

mongo-express needs about a minute after startup before it starts listening.

## The data

The app uses the database `portfolio` with four collections:

| Collection | Holds |
|---|---|
| `profile` | Headline, summary paragraphs, links |
| `projects` | Name, summary, tags, optional link |
| `skills` | Skill groups with a status: `working`, `learning` or `next` |
| `experience` | Role, place, period, note |

`GET /api/portfolio` returns all four as one JSON document.

On startup, `server.js` inserts the starting data from `app/seed-data.js` into any collection that is empty. Nothing is overwritten afterwards, so edits made in mongo-express stay.

- **Edit data:** change a document in mongo-express and reload the page. No rebuild is needed.
- **Reset to the seed data:** delete the collections in mongo-express, then run `docker compose restart my-app`.
- **Change the starting data for new clones:** edit `app/seed-data.js` and rebuild with `docker compose up -d --build`.

## Stop it

```
docker compose down      # removes containers, keeps the data
docker compose down -v   # also deletes the data volume
```

## Configuration

Credentials come from the `.env` file you create in the repo root. It must sit next to `docker-compose.yaml`, not inside `app/`, because Compose only reads it from there and anything in `app/` is copied into the image. It holds two variables, `MONGO_USER` and `MONGO_PASSWORD`. The app reads `MONGO_DB_USERNAME` and `MONGO_DB_PWD`, and the Compose file fills them from `MONGO_USER` and `MONGO_PASSWORD`.

Run `docker compose config` to see the final values Compose passes to each container.

## Problems I hit and how I fixed them

- **MongoDB 8 would not start on Linux kernel 6.19 or newer.** The log pointed to a known incompatibility ([SERVER-121912](https://jira.mongodb.org/browse/SERVER-121912)). Setting `GLIBC_TUNABLES=glibc.pthread.rseq=1` on the `mongodb` service got it past the check. It is a workaround, so check for a fixed image before relying on it.
- **The app could not log in and the page stayed empty.** The environment variable names in the Compose file did not match what the code reads. Variable names are case-sensitive.
- **Login failures for a user called `" admin"`.** A space after `=` in a list-style `environment:` entry became part of the value. `docker compose config` shows what Compose actually passes.
- **Edits to the page or server had no effect.** The code is copied into the image at build time, so rebuild with `docker compose up -d --build`.
- **The app crashed when it started before MongoDB was ready.** `depends_on` only waits for the container to start. The server now retries the connection for up to 45 seconds.
- **"Port is already allocated" after renaming the folder.** Compose names a project after its folder, so the old stack kept running under its old name and held the ports. Stop it with `docker compose -p <old-name> down`.

## Layout

```
app/
  index.html      page: static header, dynamic sections
  server.js       connects to MongoDB, seeds empty collections, serves the API
  seed-data.js    starting content for the four collections
  package.json
Dockerfile        builds the app image
docker-compose.yaml
.env              your credentials (you create it; not committed)
```

## Credits

Original tutorial app by Nana Janashia (TechWorld with Nana). Changes and content by Amir Ismail.
