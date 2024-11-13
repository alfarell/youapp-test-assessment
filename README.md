# YOUAPP TEST: MESSAGING APP

Messaging app project with nestjs microservices and rabbit mq.
These services are independently developed, containerized, and orchestrated using Docker and Docker Compose.
The system consists of 4 following services:

- API Gateway
- Auth Service
- User Service
- Message Service

### API Gateway

The API Gateway acts as the single entry point for client requests, handling routing, and authentication across the microservices.

### Auth Service

The Auth Service manages user authentication, handling operations such as user login, registration, token generation, and validation.
It provides secure access tokens (JWT) for authenticated users, ensuring that only authorized users can access protected resources within the application.

### User Service

The User Service is responsible for managing user data, including profiles, personal details, and any other user-related information.
It serves as the primary data management component for user information and integrates with the Auth Service for secure data access

### Message Service

The Message Service handles communication between users, providing APIs for sending, receiving, and managing messages.

### Technology Stack

Backend Framework: NestJS (Node.js).
Database: MongoDB.
Message Broker: RabbitMQ.
Containerization: Docker is used for containerizing services, with Docker Compose to manage multi-container deployment.

## Running the app

### Run using docker compose

Setup the environment variable

```bash
$ cp .env.sample .env
```

And input the variable value

Run docker package using docker-compose command. <br/>
\*Please make sure to have docker desktop installed on your local machine.

```bash
# docker
$ docker-compose up
```

or

```bash
# docker
$ docker-compose --env-file <env-file-name> up #--to specify the env variable name
```

### Run using npm "concurrently"

\*Before you start the app with concurrently, please make sure the mongodb service and rabbitmq are installed on your local machine and the service has been started.

Install concurrently dependency to global npm

```bash
$ npm i -g concurrently
```

Update the `AUTH_SERVICE_HOST` and `USER_SERVICE_HOST` value in .env file to `localhost`

```bash
$ npm run start:all
```
