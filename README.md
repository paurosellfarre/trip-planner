# Trip Planner API

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)
[![Redis](https://img.shields.io/badge/Redis-6.x-red.svg)](https://redis.io/)

A Domain-Driven Design (DDD) API for searching, saving, listing, and deleting trips with Redis caching.

## Features

- **Trip Search**: Search for trips between supported IATA locations with sorting by fastest or cheapest
- **Trip Management**: Save, list, and delete trips
- **Caching**: Redis-powered caching for improved performance
- **Validation**: Only trips from trusted sources can be saved (previously fetched from the external API)
- **Documentation**: API documentation with Swagger
- **DDD Architecture**: Clean separation of domain, application, infrastructure, and presentation layers

## Architecture

This project follows Domain-Driven Design principles with the following structure:

```
src/
  domain/         # Domain entities, interfaces, and business rules
  application/    # Use cases that orchestrate domain operations
  infrastructure/ # Technical implementations (repositories, services)
  presentation/   # API controllers, routes, and middleware
  shared/         # Config, errors, logging
```

## Prerequisites

- Node.js 18 or later
- Redis 6 or later (local installation or via Docker)
- External Trip API key

## Installation

### Docker Development

1. Clone the repository as above

2. Create an environment file:
   ```bash
   cp .env.example .env
   ```

3. Update the `.env` file with your API credentials:
   ```
   TRIP_API_URL=
   TRIP_API_KEY=
   ```

## Running the Application Using Docker Compose

```bash
docker-compose up
```

This will start both the API and Redis in containers.

## Testing

Run the test suite:

```bash
npm test
```

Test coverage can be generated with:

```bash
npm run test:coverage
```

## API Documentation

Once the server is running, access the Swagger documentation at:
http://localhost:3000/api-docs

