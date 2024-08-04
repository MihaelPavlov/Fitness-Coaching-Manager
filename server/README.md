# Server

## Overview
The Server is a back-end application built using Express.js. It uses TypeScript for development, MySQL for the database, and includes real-time communication capabilities using socket.io. The project follows a structured approach for database migrations and seeding using knex.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Technical Description](#technical-description)
  - [Foundation/Architecture](#foundationarchitecture)
  - [Input Specifications](#input-specifications)
- [Contributing](#contributing)

## Installation
To get started with the project, follow these steps:


1. Install dependencies:
    ```sh
    npm install
    ```

2. Set up environment variables:
    Create a `.env` file in the root directory and add the necessary environment variables. For example:
    ```sh
    DB_HOST=your_database_host
    DB_USER=your_database_user
    DB_PASSWORD=your_database_password
    DB_NAME=your_database_name
    JWT_SECRET=your_jwt_secret
    ```

## Usage

### Starting the Server
To start the server in development mode, use the following command:
    ```sh
    npm start
    ```
### Database Setup
1.To create the database, run:
   ```sh
    npm run create-db
   ```
2.To run migrations and set up the database schema, use:
   ```sh
    npm run migrate
   ```
3.To seed the database with initial data, run:
   ```sh
    npm run seed
   ```
### Database Migration Management
1. To create a new migration file, use:
    ```sh
    npm run migrate:new
    ```
2. To roll back the last migration, use:
    ```sh
    npm run migrate:undo
    ```
3. To migrate up to the latest state, use:
    ```sh
    npm run migrate:up
    ```
## Features
- TypeScript: Provides static typing for enhanced development experience and code quality.
- Express.js: Fast and minimalist web framework for Node.js.
- Real-Time Communication: Uses socket.io for real-time updates.
- Database Management: Utilizes knex for database migrations and seeding.
- Authentication: Includes JWT-based authentication with jsonwebtoken.

## Technical Description
The server application is designed to provide robust and scalable back-end services for a web application. It follows a structured approach for handling different operations and ensuring data integrity.

### Foundation/Architecture
The back-end follows a standardized structure for handling main entities. Each entity (e.g., workouts, users) has a consistent set of endpoints:

- add: Adds a new record.
- update: Updates an existing record.
- delete: Deletes a record.
- getList: Retrieves a list of records with optional filtering, ordering, and pagination.
- getDetail: Retrieves detailed information about a specific record.

### Input Specifications
Condition
Create an abstract condition container for defining SQL query conditions with different options:

- type - “AND”, “OR”
- items - collection of objects, containing:
- operation - “EQ”, “NE”, “LT”, “GT”
- field - model field name
- value - valid value for the model field
#### WHAT
Define fields to be retrieved from the model using an object:
    ```sh
    { "fieldName1": 1, "fieldName2": 1 }
    ```
#### ORDER
Define the order of SQL queries using an object for the ORDER BY clause.

#### OFFSET & LIMIT
Handle pagination with default values:

- offset: default 0
- limit: default 20
#### Abstract Model
Use an abstract file to manage database operations, with each entity model extending this abstraction:

- entityTable: main table name
- defaultWhere: default fields for SELECT
- defaultCondition: default conditions
- defaultLimit: default limit (20)
- defaultOffset: default offset (0)
- defaultOrder: default order conditions
- fieldMap: maps DB properties to fields
- anyOtherMap: fields related to subtables

## Contributing

- Branch naming
  The branch name should correspond to the name of the user story or task in Trello.
  The branch name should start with the story key.
  DO NOT publish a branch that contains in its name the “/”(forward slash) symbol, replace it with a space instead.
-Examples:

  Trello story: AT-1 View list of users

  Branch name: AT-1-View-list-of-users

  Trello story: AT-27 create/update user/ contributor

  Branch name: AT-27-create-update-user-contributor

- Commits
  Commits should be prefixed with the story or task key
  I.e. AT-88 added controller method for getting users

- PRs
  When work is completed and you are creating PR

  The name of PR should match the name of the task
    Examples:

    Trello story: AT-27 create/update user/ contributor

    PR-Name → AT-27 create/update user/ contributor
