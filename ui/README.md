# Weight Watch UI
This is the UI portion of the Weight Watch web project

## Running this project
- run `yarn` - Install project dependencies
- run `yarn start` - Run application in development mode with hot reloading

## Deployment
- The following commands can be used to locally build and run the Dockerfile that will be deployed
    - build image: `docker build . -t weightwatchapp.com`
    - create container: `docker run -d --name weightwatchapp.com -p 8080:80 weightwatchapp.com`
    - stop container: `docker stop weightwatchapp.com`
    - delete container: `docker rm weightwatchapp.com`
    - delete image: `docker rmi weightwatchapp.com`
