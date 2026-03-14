# REST API Example

This example shows how to implement a **REST API** using [Express](https://expressjs.com/) and [Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client). It uses a MySQL database file with some initial dummy data which you can find at `127.0.0.1:3306`.

## Getting started

### 1. install dependencies & create database

Install `yarn` dependencies:

```
cd express-prisma-mysql
yarn install
```

create `MySQL` via Docker:

```
docker-compose up -d
```

### 2. Connect the database

Run the following command to connect your MySQL database. This also creates the `User` tables that are defined in [`prisma/schema.prisma`](./prisma/schema.prisma):

```
npx prisma migrate dev --name init
```

### 3. Start the REST API server

```
yarn dev
```

The server is now running on `http://localhost:3000`. You can send the API requests implemented in `index.js`, e.g. [`http://localhost:3000/user`](http://localhost:3000/feed).
