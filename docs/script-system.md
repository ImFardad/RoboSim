# RoboSim - Robot Scripting System Documentation

This document describes the database schema, validations, default code seeds, and REST API specifications for managing robot controller scripts in RoboSim.

---

## 1. Database Schema

The scripting system uses **SQLite** for database storage, managed via the **Sequelize ORM** under the `scripts` table.

### Script Model (`scripts` table)

| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, Default: `UUIDV4` | Unique identifier for each script file. |
| `userId` | `UUID` | Foreign Key (cascade delete), Not Null | Links to the script owner in the `users` table. |
| `name` | `STRING` | Not Null | Filename of the script (e.g. `default.ts`). |
| `code` | `TEXT` | Not Null | Code content of the controller script. |
| `createdAt` | `DATE` | Not Null | Automatically populated database creation timestamp. |
| `updatedAt` | `DATE` | Not Null | Automatically populated database last update timestamp. |

### Database Relationship
- **User-Scripts Relationship**: A **One-to-Many** association is established between the `User` and `Script` models:
  - `User.hasMany(Script, { foreignKey: 'userId', as: 'scripts' })`
  - `Script.belongsTo(User, { foreignKey: 'userId', as: 'user' })`
  - Deleting a user cascadingly purges all associated script files.

### Database Index Constraints
*   **Unique Filename per User**: An index constraint ensures that a commander cannot have two scripts with the identical filename:
    ```javascript
    indexes: [
      {
        unique: true,
        fields: ['userId', 'name']
      }
    ]
    ```

---

## 2. Default Script Logic (`default.ts`)

When a user initializes their scripting workspace for the first time, the backend automatically seeds a default TypeScript file containing simple obstacle-avoidance logic:

```typescript
// RoboSim Default Bot Controller
// This function runs on every simulation tick.
// Input: 'sensors' object containing robot coordinates, speed, and wall scanners.
// Output: An object with 'throttle' (-1.0 to 1.0) and 'targetSteering' (steering angle in degrees).

function think(sensors) {
  // If the wall in front is closer than 120 pixels, reverse and steer away
  if (sensors.wallDistance.front < 120) {
    return {
      throttle: -0.5,
      targetSteering: -35
    };
  }
  
  // Otherwise, move forward at cruising speed
  return {
    throttle: 0.8,
    targetSteering: 0
  };
}
```

---

## 3. Backend API Specifications

All endpoints are hosted under the `/api/scripts` route. Active JWT session authentication is required in request headers: `Authorization: Bearer <JWT_token>`.

### A. List Scripts
Retrieves all scripts owned by the authenticated commander. If the list is empty, it automatically seeds and returns the default `default.ts` starter code.

*   **URL**: `/api/scripts`
*   **Method**: `GET`
*   **Response Codes**:
    *   `200 OK` - Successfully fetched script list.
    *   `401 Unauthorized` - Token missing or expired.
    *   `500 Internal Server Error` - Database lookup failure.
*   **Success Response Payload (`200 OK`)**:
    ```json
    {
      "scripts": [
        {
          "id": "2d3e4f5a-6b7c-8d9e-0f1a-2b3c4d5e6f7a",
          "userId": "e4b9da88-d621-4f05-8bb0-d7b1a20723a1",
          "name": "default.ts",
          "code": "function think(sensors) { ... }",
          "createdAt": "2026-07-10T00:00:00.000Z",
          "updatedAt": "2026-07-10T00:00:00.000Z"
        }
      ]
    }
    ```

---

### B. Create Script
Creates a new script file. Filenames must end with `.ts` or `.js` extensions and must be unique for the active user.

*   **URL**: `/api/scripts`
*   **Method**: `POST`
*   **Request Body**:
    ```json
    {
      "name": "orbit.ts",
      "code": "function think(sensors) { return { throttle: 1, targetSteering: 20 }; }"
    }
    ```
*   **Response Codes**:
    *   `201 Created` - Script successfully created.
    *   `400 Bad Request` - Missing filename, invalid extension, or duplicate filename.
    *   `401 Unauthorized` - Missing token.
    *   `500 Internal Server Error` - Database write error.
*   **Success Response Payload (`201 Created`)**:
    ```json
    {
      "message": "Script created successfully.",
      "script": {
        "id": "9a8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d",
        "userId": "e4b9da88-d621-4f05-8bb0-d7b1a20723a1",
        "name": "orbit.ts",
        "code": "function think(sensors) { return { throttle: 1, targetSteering: 20 }; }",
        "createdAt": "2026-07-10T00:05:00.000Z",
        "updatedAt": "2026-07-10T00:05:00.000Z"
      }
    }
    ```

---

### C. Update Script
Updates code content or renames an existing script file. Range validations are performed to prevent empty filenames or invalid extensions.

*   **URL**: `/api/scripts/:id`
*   **Method**: `PUT`
*   **Request Body**:
    ```json
    {
      "name": "orbit_v2.ts",
      "code": "function think(sensors) { return { throttle: 0.9, targetSteering: 15 }; }"
    }
    ```
*   **Response Codes**:
    *   `200 OK` - Script successfully updated.
    *   `400 Bad Request` - Empty filename, invalid extension, or duplicate filename.
    *   `401 Unauthorized` - Token validation failure.
    *   `404 Not Found` - Script ID does not exist or belongs to another user.
    *   `500 Internal Server Error` - Database update failure.

---

### D. Delete Script
Deletes a script file from the database.

*   **URL**: `/api/scripts/:id`
*   **Method**: `DELETE`
*   **Response Codes**:
    *   `200 OK` - Script deleted successfully.
    *   `401 Unauthorized` - Authentication failed.
    *   `404 Not Found` - Script ID does not exist.
    *   `500 Internal Server Error` - Database removal failure.
*   **Success Response Payload (`200 OK`)**:
    ```json
    {
      "message": "Script deleted successfully."
    }
    ```
