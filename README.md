# Food Ordering Site

## 🏁 Introduction

-   This project is for marking down the preferred order snack for our companies, so that we can check on the current budget from our finance department, making sure not to pass it while satisfying every staffs' needs.

## 📝 Table of Contents

-   [Technologies](#technologies)
-   [Getting Started](#getting_started)
-   [Migration Instruction](#migration_instruction)
-   [Testing](#testing)
-   [Planned Feature](#planned_feature)
-   [Limitation](#limitation)
-   [Authors](#authors)

## 🧑‍💻 Technologies <a name = "technologies"></a>

-   Next.js 14
-   Prisma
-   Socket.io
-   Million.js
-   Discord.js

## 🏁 Getting Started <a name = "getting_started"></a>

For Development, use `pnpm dev` to start the server

For Production, here is the instruction for starting up the server

### Prerequisites

-   Docker
-   Postgres Database

First, you will need to copy `example.env` into a preferrable name, in the following example, we will use `.env`

Change the configuration to match your preferred database inside `.env`

Run the following command to build the image

```
docker build -t foodordering/app:<tag> .
```

It is recommanded that you use a `docker-compose.yml` file to start up the server. If you have any users to seed, add the following configuration to the `volumes` section in `docker-compose.yml` file

```
- ./json:/app/src/seed/json
```

Then, run the following command to start up the server

```
docker-compose up -d
```

After that, use the following command to enter the Docker Container

```
docker exec -it <container_name> sh
```

Then, run the following command for migration (if there is a new migration or you are starting up the server for the first time)

```
pnpm prisma:push
```

Then, run the following command for seeding (if there is a new seed or you are starting up the server for the first time)

```
pnpm seed
```

## 📚 Migration Instruction <a name = "migration_instruction"></a>

If you have any changes to `prisma/schema.prisma`, run the following command to generate a new migration file

```
npx prisma migrate dev --name <migration_name>
```

Then, run the following command to push the migration to the database

```
npx prisma db push
```

After that, generate the client node module by running the following command

```
npx prisma generate
```

## 🐛 Testing <a name="testing"></a>

There are two testing methods in this project. First one being the functionality test and second being UI test. For functionality test, we use Vitest and for UI test, we use Cypress.

### Vitest

To run the test, run the following command

```
pnpm test
```

### Cypress

To run the test, run the following command

```
pnpm cypress:open
```

## 🧳 Planned Feature <a name = "planned_feature"></a>

-   ✅ Fetching information from Snack Ordering Company
-   ✅ Calculating total
-   ✅ lock form for +/- 1 month
-   ✅ lock form whenever admin is purchasing
-   ✅ lock form when the form is ordered
-   ✅ expected delivery date, actual price and extra notes for reasonings
-   ✅ Status for Monthly Ordering
-   ✅ Reminder for ordering to prevent overflow
-   [] Watch history price for the current product
-   ✅ Adding company from for product
-   ✅ History summary page
-   ✅ Bill splitting functionality
-   ✅ Notify related user whenever bill was uploaded

## 🐜 Limitation <a name = "limitation"></a>

-   Middleware does not work as expected in Next.js 13, it forces all routes to have the same middleware, resulting in server side code broken in client side. So I have to use a workaround to mock a middleware behaviour.

## ✍️ Author <a name = "authors"></a>

-   [@Walter0697](https://github.com/Walter0697)
