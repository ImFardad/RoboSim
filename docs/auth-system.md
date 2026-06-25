# RoboSim - Authentication & Profile System Documentation

This document specifies the database schemas, API endpoints, security implementations, and frontend integration details for the RoboSim Authentication and Profile System.

---

## 1. Database Schema

The authentication system utilizes **SQLite** for storage, managed via the **Sequelize ORM**.

### User Model (`users` table)

This model represents a registered user (commander) in the system.

| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, Default: `UUIDV4` | Unique identifier. Prevents account enumeration. |
| `username` | `STRING` | Unique, Not Null, Indexed | Alphanumeric only, lowercase, length: 3-30. |
| `email` | `STRING` | Unique, Not Null, Indexed | Validated email address format, lowercase. |
| `passwordHash` | `STRING` | Not Null | Password hashed using bcrypt (10 rounds). |
| `avatarId` | `INTEGER` | Not Null, Default: Random (1-10) | ID of the selected origami robot profile picture. |
| `createdAt` | `DATE` | Not Null | Automatically generated creation date. |
| `updatedAt` | `DATE` | Not Null | Automatically generated last update date. |

### Model Level Sanitization & Normalization Hooks
Before validation and saving to the database, hook functions perform the following normalizations:
*   `email`: Trimmed of leading/trailing spaces and converted to lowercase.
*   `username`: Trimmed of leading/trailing spaces and converted to lowercase.
*   `avatarId`: If not specified, a random integer between 1 and 10 is automatically assigned during user creation.

---

## 2. Backend API Specifications

All endpoints are hosted under the `/api/auth` namespace.

### A. User Registration
Creates a new user account, performs input validation, hashes the password, automatically assigns a random origami robot avatar, and issues a JWT token.

*   **URL**: `/api/auth/register`
*   **Method**: `POST`
*   **Headers**: `Content-Type: application/json`
*   **Request Body**:
    ```json
    {
      "username": "fardad",
      "email": "fardad@example.com",
      "password": "strongPassword123"
    }
    ```
*   **Response Codes**:
    *   `201 Created` - Registration successful. Returns user info, auto-assigned `avatarId`, and authentication token.
    *   `400 Bad Request` - Missing fields, invalid format, or username/email already exists.
    *   `500 Internal Server Error` - Database or execution failure.
*   **Success Response Payload (`201 Created`)**:
    ```json
    {
      "message": "User registered successfully.",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "e4b9da88-d621-4f05-8bb0-d7b1a20723a1",
        "username": "fardad",
        "email": "fardad@example.com",
        "avatarId": 4,
        "createdAt": "2026-06-26T01:45:00.000Z"
      }
    }
    ```
*   **Error Response Payload Example (`400 Bad Request`)**:
    ```json
    {
      "error": "Email is already registered."
    }
    ```

---

### B. User Login
Authenticates user credentials and issues a JWT token.

*   **URL**: `/api/auth/login`
*   **Method**: `POST`
*   **Headers**: `Content-Type: application/json`
*   **Request Body**:
    ```json
    {
      "emailOrUsername": "fardad",
      "password": "strongPassword123"
    }
    ```
    *(Note: `emailOrUsername` matches both `email` and `username` columns)*.
*   **Response Codes**:
    *   `200 OK` - Login successful. Returns user info, profile `avatarId`, and token.
    *   `400 Bad Request` - Missing required login credentials.
    *   `401 Unauthorized` - Invalid username/email or password (generic message for security).
    *   `500 Internal Server Error` - Database or execution failure.
*   **Success Response Payload (`200 OK`)**:
    ```json
    {
      "message": "Login successful.",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "e4b9da88-d621-4f05-8bb0-d7b1a20723a1",
        "username": "fardad",
        "email": "fardad@example.com",
        "avatarId": 4,
        "createdAt": "2026-06-26T01:45:00.000Z"
      }
    }
    ```

---

### C. Fetch Current Profile (Me)
Retrieves the logged-in user profile details by validating their JWT token.

*   **URL**: `/api/auth/me`
*   **Method**: `GET`
*   **Headers**: 
    *   `Authorization: Bearer <jwt_token>`
*   **Response Codes**:
    *   `200 OK` - Token validated, returns user details and current `avatarId`.
    *   `401 Unauthorized` - Token missing, expired, or invalid.
*   **Success Response Payload (`200 OK`)**:
    ```json
    {
      "user": {
        "id": "e4b9da88-d621-4f05-8bb0-d7b1a20723a1",
        "username": "fardad",
        "email": "fardad@example.com",
        "avatarId": 4,
        "createdAt": "2026-06-26T01:45:00.000Z"
      }
    }
    ```

---

### D. Update User Avatar
Allows an authenticated user to change their profile picture from the 10 available origami robot designs.

*   **URL**: `/api/auth/avatar`
*   **Method**: `PATCH`
*   **Headers**:
    *   `Authorization: Bearer <jwt_token>`
    *   `Content-Type: application/json`
*   **Request Body**:
    ```json
    {
      "avatarId": 6
    }
    ```
*   **Response Codes**:
    *   `200 OK` - Avatar updated successfully. Returns the new `avatarId`.
    *   `400 Bad Request` - Invalid selection (must be an integer between 1 and 10).
    *   `401 Unauthorized` - Token missing, expired, or invalid.
    *   `500 Internal Server Error` - Database or execution failure.
*   **Success Response Payload (`200 OK`)**:
    ```json
    {
      "message": "Avatar updated successfully.",
      "avatarId": 6
    }
    ```

---

## 3. Security Implementation Details

1.  **Password Hashing**: Passwords are never stored in plain text. Hashing is performed using **bcryptjs** with a salt factor of 10 rounds. This is computationally expensive enough to protect against brute-force attacks while maintaining fast performance.
2.  **JWT Verification**: JWT tokens are signed using a secure `JWT_SECRET` key on the server. If the secret key is modified or not configured, a default key is used in development mode (with warnings logged). Token validity is set to **24 hours**.
3.  **Validation & Sanitization**:
    *   Usernames are validated using alphanumeric constraints to prevent script tag injections.
    *   SQL Injection is blocked natively by **Sequelize** using parameterized queries for all operations.
    *   Login error messages do not reveal which part of the credential was incorrect (username vs password) to prevent user enumeration.

---

## 4. Frontend Integration & Layout

### Routing & Navigation Guards
*   `/login` (guest-only): Accessible only when logged out. Redirects to `/dashboard` if logged in.
*   `/register` (guest-only): Accessible only when logged out. Redirects to `/dashboard` if logged in.
*   `/dashboard` (authenticated-only): Requires a valid JWT token. Redirects to `/login` if token is missing.

### Localizations & Glossary File
All user-facing hardcoded text strings (like site names, titles, labels, placeholders) are extracted to `frontend/src/glossary.ts`. Templates fetch text from this configuration dictionary, allowing easy customization and language updates. By default, the application is presented in **English** and uses Left-to-Right (**LTR**) layout rules.

### Toast Notification System
The application features a global Toast Notification System managed via `frontend/src/utils/toast.ts`. Success, info, and validation error messages originating from the backend API responses are caught and displayed dynamically as top-right floating glassmorphic alerts instead of inline component warnings.
