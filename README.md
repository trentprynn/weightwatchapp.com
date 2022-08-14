# [weightwatchapp.com](https://weightwatchapp.com/)

## What is this?
Weight Watch is a free, open source web application for tracking your weight over time.

## Why
I wanted an free, lightweight website where I can track weight gain / loss progress easily and securely while also being able to understand how my data was being processed and stored.

## Show me
![Weight Watch home page once a user has logged in and logged their weight for a couple days](https://weightwatchapp.com/assets/image/WW_Demo_Home_1400_700.png)

![Weight Watch activity log for a user created activities and logs](https://weightwatchapp.com/assets/image/WW_Demo_Activity_1400_850.png)

![Weight Watch account settings page for a logged in user](https://weightwatchapp.com/assets/image/WW_Demo_Account_1400_700.png)

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
