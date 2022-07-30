# pull node base image
FROM node:lts-bullseye-slim

# setup a development user
RUN useradd -ms /bin/bash web

# make the workdir with the right permissions
RUN mkdir /app
RUN chown web /app

# swap to development user
USER web

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install dependencies
COPY --chown=web package.json yarn.lock ./
RUN yarn

# copy app source
COPY --chown=web . .

# expose the port we'll be listening on
EXPOSE 4200

# start app
CMD ng serve --host 0.0.0.0
