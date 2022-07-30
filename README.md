# [weightwatchapp.com](https://weightwatchapp.com/)

## What is this?
Weight Watch is a free, open source web application for tracking your weight over time.

## Why
I wanted an free, lightweight website where I can track weight gain / loss progress easily and securely while also being able to understand how my data was being processed and stored.

## Local Development
1. Install docker
2. Install `node@16.X` (probably using `nvm`)
3. Install `yarn@1.X` (probably using `homebrew`)
4. Clone to the repo
5. Navigate into the `api` directory
6. Follow the instructions within the `README.md` file to setup and run the API
7. Navigate into the `ui` directory
8. Follow the  instructions within the `README.md` file to setup and run the UI

## Deployment
- The static angular front end UI is built and hosted using GitHub Actions + GitHub Pages
- The back end NestJS API is built and hosted using Heroku
- On a commit to master both the front and back end websites will be automatically built and deployed