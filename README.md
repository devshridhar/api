
# Auth API

This project is a NestJS-based authentication API that provides endpoints for user signup and signin. It includes Swagger API documentation secured with Basic Authentication.

---

## Features

- User signup and signin functionalities.
- Swagger documentation secured with Basic Authentication.
- Comprehensive unit and end-to-end (e2e) tests.

---

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) (v8 or later)
- [MongoDB](https://www.mongodb.com/) (local or cloud-based)

---

## Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone <repository_url>
   cd <project_directory>
   ```

2. **Install Dependencies**

   Run the following command to install all required dependencies:

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create a `.env` file in the root of the project and provide the necessary environment variables. An example `.env` file is shown below:

   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/auth-api
   JWT_SECRET=your_secret_key
   ```

4. **Run Database**

   Ensure MongoDB is running locally or provide a valid MongoDB connection string in the `MONGO_URI` environment variable.

---

## Running the Application

1. **Start the Application**

   Run the following command to start the server in development mode:

   ```bash
   npm run start:dev
   ```

   Alternatively, for production:

   ```bash
   npm run start:prod
   ```

2. **Access the API**

   The API will be accessible at:

   ```
   http://localhost:3000
   ```

---

## Accessing API Documentation

Swagger documentation is available for testing the API endpoints.

1. Navigate to:

   ```
   http://localhost:3000/api
   ```

2. Enter the following Basic Authentication credentials when prompted:

    - **Username**: `admin`
    - **Password**: `321`

---

## Running Tests

### Unit Tests

Run unit tests using:

```bash
npm run test
```

### End-to-End (e2e) Tests

Run e2e tests using:

```bash
npm run test:e2e
```

### Test Coverage

To generate a coverage report:

```bash
npm run test:cov
```

---



## Contributing

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes with clear and descriptive messages.
4. Submit a pull request.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Support

For issues or feature requests, please open an issue in the repository.

Happy coding! 🎉
