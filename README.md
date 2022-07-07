# Geo-Beard News API

## Project Overview

### Summary

This project has been part of the Northcoders bootcamp, 16th May 2022 - 19th August 2022.

The purpose of this project has been to build an API in order to be able to access application data programmatically. The intention here was to mimic the building of a real world backend service (such as reddit) which will provide this information to the front end architecture.

The database used was PSQL, and interactions have been carried out using node-postgres.

### Links

The following link will take you to the hosted version of this project:

https://geo-beard-news.herokuapp.com/api

The following link will take you to the creators github profile:

https://github.com/Geo-Beard

## Set-up instructions

### Install Node.js and Postgres

Ensure that you have Node.js and Postgres installed with these minimum requirements:

    Node.js: v18.1.0
    Postgres: 14.3

To check which version you currently have installed:

    node --version
    psql -V

### Cloning the repo

In order to clone this repo use the following:

    git clone https://github.com/Geo-Beard/geo-news-backend.git

If you would like to make changes to this repo yourself, fork the repo then clone it.

### Create .env files

In order for you to run this repo locally you must create two .env files:

    .env.test
    .env.development

Inside each of the corresponding files write the following:

    PGDATABASE=nc_news_test
    PGDATABASE=nc_news

If you would like to deploy this via heroku you must also create:

    .env.production

Inside of which write the following:

    PGDATABASE=nc_news

### Installing dev dependencies

The following dependencies must be installed using npm:

    npm install dotenv
    npm install express
    npm install pg

If you would like to host this with heroku the following should be installed:

    npm install -g heroku

### Seeding local database

The following scripts should be run in order to seed the local databases:

    npm run setup-dbs
    npm run seed

### Running tests

The following dev dependencies should be installed for testing:

    npm install -D jest
    npm install -D supertest
    npm install pg-format
    npm install jest-sorted

In order to run the testing suite run the following:

    npm test app

### Viewing dev database

If you would like to write test queries to the development database write your SQL queries in:

    ./db/__view-dev-db__/view-dev-data.sql

Then run the following script:

    npm run view-dev-db
