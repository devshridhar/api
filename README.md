
# Auth API

This project is a NestJS-based authentication API providing robust endpoints for user signup and signin. It incorporates industry-standard security measures and comprehensive testing for reliable and secure operations.

Demo: https://auth.fullstackdev.in/docs

Api Url: https://auth-api.fullstackdev.in/

---

## Features

- **Authentication**: User signup and signin functionalities.
- **Swagger Documentation**: Secured with Basic Authentication.
- **Security Measures**: Includes Helmet for HTTP headers, rate limiting, CORS configuration, and CSRF protection.
- **Comprehensive Testing**: Includes 14 test cases (unit and e2e tests) with 100% code coverage for critical files.
- **Extensible Architecture**: Built using NestJS, following best practices for scalability and maintainability.

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

## Security Measures

- **Helmet**: Secures HTTP headers to prevent common vulnerabilities.
- **Rate Limiting**: Restricts excessive requests to protect against denial-of-service (DoS) attacks.
- **CORS Configuration**: Ensures secure cross-origin resource sharing.
- **CSRF Protection**: Guards against Cross-Site Request Forgery attacks.
- **Input Validation**: All inputs are validated and sanitized to prevent SQL/NoSQL injection and XSS attacks.

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

The application has 14 test cases with 100% code coverage for essential files.

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

---

**Happy coding!** 🎉
