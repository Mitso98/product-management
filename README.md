# Product Management API

## Description

This is a Product Management API built with the NestJS framework. It provides endpoints for managing products, users, and other related entities.

## Project setup

To set up the project, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/product-management.git
   cd product-management
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Set up the environment variables:
   - Copy the `.env.example` file to `.env` or `development.local.env` and fill in the required values.

### Another way to set up

If you have Docker installed, you can set up the project by running the `run_docker.sh` script with the correct `ENV_FILE` and `COMPOSE_FILE` options:

1. Make sure Docker is installed and running on your machine.
2. Run the `run_docker.sh` script:
   ```bash
   ./run_docker.sh
   ```
3. The script will build the Docker image and start the containers. You can access the API at `http://localhost:3000/api/v1`.

## Compile and run the project

To compile and run the project, use the following commands:

- Development mode:

  ```bash
  npm run start
  ```

- Watch mode:

  ```bash
  npm run start:dev
  ```

- Production mode:
  ```bash
  npm run start:prod
  ```

## Run tests

To run the tests, use the following commands:

- Unit tests:

  ```bash
  npm run test
  ```

- End-to-end tests:

  ```bash
  npm run test:e2e
  ```

- Test coverage:
  ```bash
  npm run test:cov
  ```

## Example API usage

Here are some example API requests you can make to the Product Management API:

- **Login:**

  ```bash
  curl -X POST http://localhost:3000/auth/login -d '{"email": "user@example.com", "password": "password"}' -H "Content-Type: application/json"
  ```

- **Get Products:**

  ```bash
  curl -X GET http://localhost:3000/products -H "Authorization: Bearer YOUR_JWT_TOKEN"
  ```

- **Create Product:**
  ```bash
  curl -X POST http://localhost:3000/products -d '{"name": "New Product", "price": 100}' -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_JWT_TOKEN"
  ```

For more detailed API documentation, please refer to the Swagger documentation available at `http://localhost:3000/api/docs`.

## License

This project is licensed under the MIT License.
