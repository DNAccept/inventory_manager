# Inventory Management System - Project Documentation

## 1. Project Overview
This project is a React-based frontend for an Inventory Management System (IMS). It allows users to manage inventory items, track stock levels, and audit actions through a logging system. The application is designed with a modern, neumorphic aesthetic and emphasizes user accountability through mandatory reason prompts for all changes.

## 2. Key Features

### Authentication
-   **Login/Logout**: Users can simulate logging in and out.
-   **Session Management**: User session is persisted via `localStorage` (mock implementation).
-   **Role**: Currently defaults to an 'admin' role context.

### Inventory Management
-   **Dashboard**: Displays a comprehensive list of all inventory items.
    -   **KPI Cards**: Shows Total Items, Total Quantity, and Total Inventory Value.
    -   **Stock Indicators**: Visual badges (Green/Red) indicate stock health.
-   **Add Item**: Form to create new inventory records (Name, Category, Quantity, Price, Description).
-   **Edit Item**: Functionality to modify existing item details.
-   **Delete Item**: Ability to remove items from the database.

### Roles & Permissions
-   **Viewer**: Read-only access. Great for auditing without risk of data modification.
-   **Editor**: Standard access to manage inventory.
-   **Site Admin**: Superuser with ability to manage other users and receive system notifications.

### Audit & Accountability
-   **Action Logging**: Every `ADD`, `UPDATE`, and `DELETE` action is automatically recorded.
    -   **Data Captured**: Timestamp, User, Action Type, Reason, and Details.
-   **Reason for Change**: A mandatory modal prompt appears for every state-changing action.
    -   **Quick Select**: Pre-defined reasons (e.g., "Restock", "Sold", "Damaged").
    -   **Custom Input**: Option to enter free-text notes.
-   **Logs View**: A dedicated page (`/logs`) to view the history of all actions.

### UI/UX Design
-   **Full-Width Layout**: The dashboard utilizes the full screen width for maximum data visibility.
-   **Neumorphism**: Input fields and textareas feature a soft, neumorphic shadow style, providing a modern and tactile feel.
-   **Responsive**: The layout adapts to different screen sizes.

## 3. Technical Architecture

### Tech Stack
-   **Frontend Framework**: React (Vite)
-   **Routing**: `react-router-dom` v6
-   **Styling**: Plain CSS with CSS Variables for theming.

### State Management
-   **Context API**: `src/context/InventoryContext.jsx` serves as the central store.
    -   Manages `items`, `user` (auth), and `logs` state.
    -   Exposes actions: `addItem`, `updateItem`, `deleteItem`, `logAction`.
    -   Acts as a mock backend by simulating data persistence in memory (and `localStorage` for auth).

### Directory Structure
```
src/
├── components/
│   ├── Navbar.jsx          # Navigation and Logout
│   ├── ReasonModal.jsx     # Modal for capturing change reasons
│   └── ...
├── context/
│   └── InventoryContext.jsx # Global State
├── pages/
│   ├── Dashboard.jsx       # Main view
│   ├── InventoryForm.jsx   # Add/Edit wrapper
│   ├── Login.jsx           # Auth page
│   └── Logs.jsx            # Audit history view
├── App.css                 # Global and Component styles
├── App.jsx                 # Routing configuration
└── main.jsx                # Entry point
```

## 5. Setup Implementation Details

### API Integration Points
The application is currently using mock data. Integration with a real RESTful API would involve:
1.  Replacing `items` state in `InventoryContext` with `fetch`/`axios` calls.
2.  Endpoints needed:
    -   `GET /api/items` - List items
    -   `POST /api/items` - Create item
    -   `PUT /api/items/:id` - Update item
    -   `DELETE /api/items/:id` - Delete item
    -   `POST /api/auth/login` - Authenticate
    -   `GET /api/logs` - Fetch logs (if persisted on backend)

## 5. User Flows

### A. User Management (Admin)
1.  **Create User**: Admin logs in, goes to Profile/Admin section, creates a new user (Viewer/Editor) with temp credentials.
2.  **Assign Role**: Admin sets the user's role during creation.

### B. Initial User Setup
1.  **First Login**: User logs in with temp credentials.
2.  **Update Profile**: User goes to Profile.
    -   Changes **Username** (System checks uniqueness).
    -   Changes **Password**.
3.  **Notification**: Admin gets alerted that the user has claimed their account (Username changed).

### C. Managing Inventory (Editor/Admin)
1.  **View**: User sees dashboard.
2.  **Add/Edit/Delete**: Available only if role is `editor` or `site_admin`.
    -   Actions trigger the **Reason Modal**.

### D. Auditing
1.  **Navigation**: Click "Logs".
2.  **View**: See all actions. Viewers can see this for transparency.

## 6. Running the Project

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Start Development Server**:
    ```bash
    npm run dev
    ```
3.  **Build for Production**:
    ```bash
    npm run build
    ```