# Weight Watcher

## Description
API for a daily weight watching application.

## Setup
```bash
docker run --name weight-watch-db -e POSTGRES_USER=weight-watch_user -e POSTGRES_PASSWORD=weight-watch_pass -e POSTGRES_DB=weight-watch -p 5432:5432 -v weight-watch_data:/var/lib/postgresql/data -d postgres
```

```bash
DATABASE_URL=postgres://weight-watch_user:weight-watch_pass@localhost:5432/weight-watch?schema=public
JWT_SECRET=LOCAL_SECRET_KEY
JWT_LIFE_SECONDS=3600
REFRESH_TOKEN_SECRET=LOCAL_REFRESH_SECRET
REFRESH_TOKEN_LIFE_SECONDS=2592000
```

```bash
yarn
yarn prisma migrate dev
yarn start
```
