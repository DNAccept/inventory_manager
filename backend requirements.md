# Backend & Database Requirements

To fully functionalize this application, the following backend infrastructure is required.

## A. Database: MongoDB
The application requires a MongoDB database with the following collections and schemas:

**1. Users Collection (`users`)**
Stores authentication details.
```json
{
  "_id": "ObjectId",
  "username": "String (Unique)",
  "password": "String (Hashed)",
  "role": "String (e.g., 'admin', 'manager')",
  "createdAt": "Date"
}
```

**2. Inventory Items Collection (`items`)**
Stores the current state of inventory.
```json
{
  "_id": "ObjectId",
  "name": "String",
  "category": "String",
  "quantity": "Number",
  "price": "Number",
  "description": "String",
  "lastUpdated": "Date"
}
```

**3. Action Logs Collection (`logs`)**
Immutable audit trail of all changes.
```json
{
  "_id": "ObjectId",
  "action": "String (ADD | UPDATE | DELETE)",
  "reason": "String",
  "details": "String",
  "userId": "ObjectId (Reference to users)",
  "username": "String (Snapshot for history)",
  "timestamp": "Date"
}
  "timestamp": "Date"
}
```

## B. Admin, Roles & User Flow Requirements

**1. Roles & Permissions (RBAC)**
The system supports three distinct access levels:
-   **Viewer (`viewer`)**: Read-only access to Dashboard and Logs. Cannot modify inventory.
-   **Editor (`editor`)**: Can Add, Update, and Delete inventory items.
-   **Site Admin (`site_admin`)**: Full access.
    -   Can manage Users (Create/Delete/Change Role).
    -   Receives notifications for critical events.

**2. Seeded Site Admin**
The system must seed a default admin user upon initialization if none exists.
-   **Username**: `admin`
-   **Password**: `admin123` (Must be forced change on first login)
-   **Role**: `site_admin`

**3. User Lifecycle Flow**
-   **Creation**: Only `site_admin` can create new users. Admin assigns initial username, password, and role.
-   **Account Claim**:
    -   User logs in with admin-provided credentials.
    -   User updates their **Username** (must be unique in DB) and **Password**.
    -   User can update **Full Name**.
-   **Notification**:
    -   When a user updates their *Username*, the `site_admin` must receive a system notification (In-app or Email).

**4. User Management (Admin Only)**
-   **Add User**: Create new users with specific roles.
-   **role**: Enum [`viewer`, `editor`, `site_admin`].
-   **Remove User**: Delete users.

## C. API Endpoints (RESTful)
The backend should provide the following endpoints. Note that `reason` should be passed in the body of state-changing requests to ensure auditability.

**Authentication**
-   `POST /api/auth/login`
    -   Payload: `{ username, password }`
    -   Response: `{ token, user: { id, username, role } }`

**User Management (Admin Only)**
-   `POST /api/users`
    -   Description: Create a new user.
    -   Payload: `{ username, password, role }`
-   `DELETE /api/users/:id`
    -   Description: Remove a user.

**Inventory Operations**
-   `GET /api/items`
    -   Description: Fetch all inventory items.
-   `POST /api/items`
    -   Description: Create a new item.
    -   Payload: `{ ...itemDetails, reason: "New Stock" }`
    -   *Backend Logic*: Create item + Create Log entry.
-   `PUT /api/items/:id`
    -   Description: Update an existing item.
    -   Payload: `{ ...updates, reason: "Restock/Correction/etc" }`
    -   *Backend Logic*: Update item + Create Log entry.
-   `DELETE /api/items/:id`
    -   Description: Remove an item.
    -   Payload: `{ reason: "Sold/Damaged/etc" }`
    -   *Backend Logic*: Delete (or soft delete) item + Create Log entry.

**Auditing**
-   `GET /api/logs`
    -   Description: Fetch history of actions (sorted by timestamp desc).
