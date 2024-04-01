<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# MyCoffee Subscription Service
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a> <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
</p>

## Features
- Subscription Management: Customers can manage their subscriptions, including selecting plans, upgrading, or canceling.
- Diverse Plans: Offer a variety of coffee plans to cater to different tastes and preferences.
- Payment Integration: Integrate with a payment gateway for subscription payments.
- User Authentication: Secure user authentication for account management.
- Admin Panel: Provide an admin panel for managing plans, users, and subscriptions.

## Technologies Used
- Nest.js
- PostgreSQL
- Swagger
- NodeMailer
- JWT

## Running the app

```bash
# copy env file
$ cp .env.example .env

# up containers
$ docker-compose up -d --build

# down containers
$ docker-composer down

# inside container app
## run migrations
$ npx prisma migrate dev

#doc url
{host}/api/documentation
```

## Stay in touch

- Author - [Enzo Paiva](https://github.com/enzodpaiva)

## License

Nest is [MIT licensed](LICENSE).
