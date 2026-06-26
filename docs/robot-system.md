# RoboSim - Robot Construction System Documentation

This document describes the database schema, associations, API specifications, and calculation engines used to support the Robot Laboratory customization features in RoboSim.

---

## 1. Database Schema

The robot configuration is stored in the **SQLite** database using the **Sequelize ORM** under the `robots` table. Each registered commander (user) can own exactly one active robot configuration.

### Robot Model (`robots` table)

| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, Default: `UUIDV4` | Unique identifier. |
| `userId` | `UUID` | Unique, Foreign Key (cascade delete) | Links directly to the associated user's ID in the `users` table. |
| `bodyLevel` | `INTEGER` | Default: `1`, Range: `1` to `5` | Core armor plating tier. |
| `batteryLevel` | `INTEGER` | Default: `1`, Range: `1` to `5` | Energy storage capability tier. |
| `brainLevel` | `INTEGER` | Default: `1`, Range: `1` to `4` | Concurrent execution queue slots tier. |
| `engineLevel` | `INTEGER` | Default: `1`, Range: `1` to `5` | Rear-wheel power engine thrust tier. |
| `steeringLevel`| `INTEGER` | Default: `1`, Range: `1` to `3` | Front-wheel deflection calibration speed/range tier. |
| `createdAt` | `DATE` | Not Null | Automatically populated database creation timestamp. |
| `updatedAt` | `DATE` | Not Null | Automatically populated database last update timestamp. |

### Database Relationship
- **User-Robot Relationship**: A **One-to-One** relationship is established between the `User` and `Robot` models:
  - `User.hasOne(Robot, { foreignKey: 'userId', as: 'robot' })`
  - `Robot.belongsTo(User, { foreignKey: 'userId', as: 'user' })`
  - Deleting a User cascadingly purges the associated robot from the database.

---

## 2. Backend API Specifications

All endpoints are protected and hosted under the `/api/robot` namespace. Active session JWT authentication is required in the request headers: `Authorization: Bearer <JWT_token>`.

### A. Get Current Robot Configuration
Loads the active robot levels for the authenticated commander. If no configuration exists for the user, it automatically initializes a level-1 starter robot configuration in the database and returns it.

*   **URL**: `/api/robot`
*   **Method**: `GET`
*   **Headers**: 
    *   `Authorization: Bearer <token>`
    *   `Content-Type: application/json`
*   **Response Codes**:
    *   `200 OK` - Successfully fetched or initialized configuration.
    *   `401 Unauthorized` - Missing or expired authentication token.
    *   `500 Internal Server Error` - Database connection or lookup failure.
*   **Success Response Payload (`200 OK`)**:
    ```json
    {
      "robot": {
        "id": "e4b9da88-d621-4f05-8bb0-d7b1a20723b2",
        "userId": "e4b9da88-d621-4f05-8bb0-d7b1a20723a1",
        "bodyLevel": 1,
        "batteryLevel": 1,
        "brainLevel": 1,
        "engineLevel": 1,
        "steeringLevel": 1,
        "createdAt": "2026-06-26T12:00:00.000Z",
        "updatedAt": "2026-06-26T12:00:00.000Z"
      }
    }
    ```

---

### B. Update Robot Configuration
Overwrites the component upgrade levels for the authenticated commander's robot. It performs range validation checks before applying changes.

*   **URL**: `/api/robot`
*   **Method**: `PUT`
*   **Headers**:
    *   `Authorization: Bearer <token>`
    *   `Content-Type: application/json`
*   **Request Body**:
    ```json
    {
      "bodyLevel": 3,
      "batteryLevel": 4,
      "brainLevel": 2,
      "engineLevel": 5,
      "steeringLevel": 1
    }
    ```
*   **Response Codes**:
    *   `200 OK` - Configuration validated and updated.
    *   `400 Bad Request` - Missing values, level ranges out of bounds, or non-integer formats.
    *   `401 Unauthorized` - Token missing or expired.
    *   `500 Internal Server Error` - Database saving failure.
*   **Success Response Payload (`200 OK`)**:
    ```json
    {
      "message": "Robot configuration updated successfully.",
      "robot": {
        "id": "e4b9da88-d621-4f05-8bb0-d7b1a20723b2",
        "userId": "e4b9da88-d621-4f05-8bb0-d7b1a20723a1",
        "bodyLevel": 3,
        "batteryLevel": 4,
        "brainLevel": 2,
        "engineLevel": 5,
        "steeringLevel": 1,
        "createdAt": "2026-06-26T12:00:00.000Z",
        "updatedAt": "2026-06-26T12:05:30.000Z"
      }
    }
    ```
*   **Error Response Payload Example (`400 Bad Request`)**:
    ```json
    {
      "error": "Body level must be an integer between 1 and 5. Steering level must be an integer between 1 and 3."
    }
    ```
