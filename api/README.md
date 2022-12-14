# Weight Watch API
This is the API portion of the Weight Watch project


## Running this project
1. Create a local database using `docker` that our API can connect to
```bash
docker run --name weight-watch-db -e POSTGRES_USER=weight-watch_user -e POSTGRES_PASSWORD=weight-watch_pass -e POSTGRES_DB=weight-watch -p 5432:5432 -v weight-watch_data:/var/lib/postgresql/data -d postgres
```

2. Create a `.env` file in the root of the api directory with the following variables defined
```bash
DATABASE_URL=postgres://weight-watch_user:weight-watch_pass@localhost:5432/weight-watch?schema=public
JWT_SECRET=LOCAL_SECRET_KEY
JWT_LIFE_SECONDS=3600
REFRESH_TOKEN_SECRET=LOCAL_REFRESH_SECRET
REFRESH_TOKEN_LIFE_SECONDS=2592000
```

3. Install dependencies, run migrations, and start the API with hot reloading enabled
```bash
yarn
yarn prisma migrate dev
yarn start
```

## Deployment
- The following commands can be used to locally build and run the Dockerfile that will be deployed
    - build image: `docker build . -t api.weightwatchapp.com`
    - create container: `docker run -d --name api.weightwatchapp.com --env-file .env -p 3000:3000  api.weightwatchapp.com`
    - stop container: `docker stop api.weightwatchapp.com`
    - delete container: `docker rm api.weightwatchapp.com`
    - delete image: `docker rmi api.weightwatchapp.com`
