# tailwind-react-native-expo-express-node-mysql

✅ TypeScript setup
✅ Express for handling requests
✅ MySQL for database storage
✅ CRUD endpoints for users

mkdir express-ts-mysql-crud && cd express-ts-mysql-crud
npm init -y
npm install express mysql2 body-parser dotenv
npm install --save-dev typescript ts-node @types/node @types/express @types/mysql2
npx tsc --init


CREATE DATABASE testdb;
USE testdb;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);


### Description:

This is a **TypeScript-based Express.js CRUD application** with **MySQL** as the database. The application provides a simple **user management system**, allowing users to be **created, read, updated, and deleted** via REST API endpoints.

### Features:
- **Express.js** for building the API server.
- **MySQL2** for database interaction.
- **TypeScript** for strong type safety.
- **Separation of concerns**:
  - `server.ts`: Initializes and starts the Express server.
  - `app.ts`: Configures the Express app and database connection.
  - `database.ts`: Manages MySQL database connections.
  - `userRoutes.ts`: Defines API routes for user management.
  - `userController.ts`: Handles request logic and interacts with models.
  - `userModel.ts`: Contains database queries for CRUD operations.
  
### API Endpoints:
| Method | Endpoint       | Description |
|--------|---------------|-------------|
| GET    | `/users`      | Fetch all users |
| GET    | `/users/:id`  | Fetch a user by ID |
| POST   | `/users`      | Create a new user (`{ name, email }`) |
| PUT    | `/users/:id`  | Update a user (`{ name, email }`) |
| DELETE | `/users/:id`  | Delete a user |

### File Structure:
```
/express-ts-mysql-crud
│── src
│   ├── server.ts          # Entry point for the server
│   ├── app.ts             # Express app configuration
│   ├── config
│   │   ├── database.ts    # MySQL database connection
│   ├── routes
│   │   ├── userRoutes.ts  # Routes for user operations
│   ├── controllers
│   │   ├── userController.ts  # Handles user CRUD logic
│   ├── models
│   │   ├── userModel.ts   # Database queries
│   ├── middlewares        # (If any are added in the future)
│   ├── types              # (Optional, for defining TypeScript interfaces)
│── package.json
│── tsconfig.json
│── .env                   # Store environment variables

### **Run the Application**
```npx ts-node src/server.ts```

### 📌 **Postman Collection**
The postman collection that includes the following CRUD endpoints:

- **GET** `/users` → Fetch all users
- **GET** `/users/:id` → Fetch a single user by ID
- **POST** `/users` → Create a new user (`{ "name": "Techno Jerry", "email": "jerry@example.com" }`)
- **PUT** `/users/:id` → Update user data
- **DELETE** `/users/:id` → Remove a user




