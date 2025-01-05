RBAC Management System
Table of Contents
Project Overview
Features
System Architecture
Tech Stack
Database Design
Setup and Installation
API Documentation
Frontend Documentation
Backend Documentation
Usage Guide
Troubleshooting
Future Enhancements

1. Project Overview
The RBAC (Role-Based Access Control) Management System is a comprehensive web-based application designed to streamline and secure access management within an organization. This system allows administrators to define, assign, and manage roles and permissions for users, granting them appropriate levels of access to various resources within the application.
In a typical organization, users often require access to a wide range of applications, features, and data. Managing these access permissions manually can be complex, time-consuming, and prone to error, especially as the number of users, roles, and resources grows. The RBAC Management System addresses this by providing a centralized platform where administrators can control user access through a structured role-based model.
The application enables administrators to:
Create and Manage Users: Register and maintain user profiles, including personal details and authentication credentials. Each user can be assigned one or more roles that determine their access rights within the system.
Define and Organize Roles: Roles represent sets of permissions that are assigned to users based on their responsibilities and requirements. For example, roles like "Admin," "Manager," and "Employee" can be created to define access levels for different job functions.
Configure Permissions at Multiple Levels: Permissions can be granted at various hierarchical levels, including applications, modules, features, objects, and fields. This flexibility allows administrators to fine-tune access rights for different system components, ensuring that users have the exact permissions needed for their tasks.
Application Level: Permissions can be granted at the top level, providing broad access to entire applications within the system.
Module Level: Within each application, modules (subsystems) can be controlled, allowing access to specific functionalities.
Feature Level: Further granularity is provided by feature-level permissions, enabling or restricting access to individual features within a module.
Object Level: Permissions at the object level control access to data entities, such as customer records or financial reports, providing fine-grained control over data visibility and modification.
Record Level: Permissions at the record level enable control over individual records within an object. This level of granularity allows administrators to specify access to particular instances of data, such as a single customer’s profile or a specific transaction.
Field Level: Field-level permissions determine access to specific fields within objects, allowing sensitive data elements to be hidden or restricted even if a user has access to the broader object.
The system follows a hierarchical approach, allowing permissions to be inherited from higher levels. For instance, if a user has read access to an entire module, they may automatically inherit read access to all features within that module unless specified otherwise.
Key capabilities of the RBAC Management System include:
Ease of Administration: The intuitive web interface simplifies the creation, assignment, and management of roles and permissions, making it easy for administrators to keep track of who has access to what.
Enhanced Security: By enforcing a role-based access model, the system ensures that users only have access to the resources they need, reducing the risk of unauthorized access to sensitive information.
Scalability: The system is designed to handle large numbers of users, roles, and resources, making it suitable for organizations of various sizes.
Audit and Compliance: The RBAC Management System provides clear visibility into user access, supporting auditing and compliance requirements by allowing administrators to view and report on permissions and access levels across the organization.
Overall, the RBAC Management System is a robust solution for managing access rights, providing both security and operational efficiency by enabling granular control over user permissions in a scalable and easy-to-manage interface. This system is ideal for any organization looking to implement secure, manageable, and scalable access control for its digital resources.
2. Features
User Management: Add, edit, delete users.
Role Management: Define roles with specific permissions.
Permission Management: Assign CRUD (Create, Read, Update, Delete) permissions at multiple levels (App, Module, Feature, etc.).
RBAC Enforcement: Define and enforce permissions based on user roles.
Search and Pagination: Easily find and browse roles, users, and permissions.
Responsive UI: User-friendly interface with role assignment features.
3. System Architecture
This project follows a three-tier architecture:
Frontend: Angular-based application that handles UI and user interactions.
Backend: Node.js with Express.js that exposes APIs and processes business logic.
Database: PostgreSQL, which stores data for users, roles, permissions, and more.
4. Tech Stack
Frontend: Angular, TypeScript, HTML, CSS
Backend: Node.js, Express.js
Database: PostgreSQL by AWS RDS
5. Database Design
5.1 Database Schema
Provide a full description of all tables in the database, including columns, data types, and relationships.
Sample Tables
User Table
id (Primary Key)
username: String
email: String
password: String
Role Table
id (Primary Key)
name: String
description: String
Permissions Table
id (Primary Key)
level: String
level_id: Integer
can_read, can_write, can_edit, can_delete: Boolean
5.2 Relationships
Many-to-many relationship between Users and Roles.
Many-to-many relationship between Roles and Permissions.

6. Setup and Installation
6.1 Prerequisites
Node.js (version X.X.X)
PostgreSQL (version X.X)
Angular CLI
6.2 Installation Steps
Step 1: Clone the Repository
First, clone the project repository from GitHub:
git clone https://github.com/chandrapavan1104/RBAC.git


Navigate into the cloned project directory:
cd RBAC



Step 2: Backend Setup
2.1 Navigate to the Backend Directory
Go to the backend directory where the server code resides:
cd rbac-backend


2.2 Install Dependencies
Install the necessary backend dependencies:
npm install


2.3 Configure Environment Variables
Create a .env file in the backend directory and configure the environment variables required by the application. Here’s a sample structure you might use:
PORT=3000
DB_HOST= your_host_name
DB_PORT=5432
DB_NAME= DB_name
DB_USER= DB_username
DB_PASSWORD= DB_password


Ensure you replace the placeholder values with your actual configuration.

Step 3: Frontend Setup
3.1 Navigate to the Frontend Directory
Go to the frontend directory where the client code resides:
cd frontend


3.2 Install Dependencies
Install the required frontend dependencies:
npm install -g @angular/cli
npm install


3.3 Configure Environment Variables (if needed)
If there are any environment variables for the frontend, configure them accordingly. Create an .env file in the frontend directory if necessary.

Step 4: Database Setup
4.1 Create Database
Set up the necessary database for the project by running the following SQL command in your PostgreSQL client:
CREATE DATABASE rbac;


4.2 Create Tables
Use the provided SQL scripts in the repository to set up the tables required for the application. Execute the SQL scripts in the rbac database to create the tables and insert any sample data as required.
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255)
);


CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255)
);


CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    level VARCHAR(50) NOT NULL CHECK (level IN ('App', 'Module', 'Feature', 'Object', 'Record', 'Field')),
    level_id INT 
);


CREATE TABLE user_roles (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);


CREATE TABLE role_permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    can_read BOOLEAN DEFAULT FALSE,
    can_write BOOLEAN DEFAULT FALSE,
    can_edit BOOLEAN DEFAULT FALSE,
    can_delete BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (role_id, permission_id)
);




Step 5: Run the Application
5.1 Start the Backend Server
Start the backend server by running the following command in the backend directory:
npm start


5.2 Start the Frontend Server
In a separate terminal, navigate to the frontend directory and run the following command to start the Angular application:
ng serve



Step 6: Access the Application
Once both servers are running, open your web browser and go to:
http://localhost:4200


You should see the RBAC Management System interface, ready for use.

Summary of Commands

# Clone repository
git clone https://github.com/chandrapavan1104/RBAC.git
cd rbac-management-system

# Backend setup
cd backend
npm install

# Frontend setup
cd ../frontend
npm install

# Run backend
cd ../backend
npm start

# Run frontend
cd ../frontend
ng serve




Notes
Make sure that both the backend and frontend servers are configured to use the correct environment variables.
For any issues, refer to the documentation provided in the repository or contact the project maintainer.

7. API
7.1 Overview
The API endpoints for the RBAC Management System are documented here, providing details on methods, request bodies, and response formats.
7.2 Endpoints
User Management
GET /api/users/ - Fetch all users
POST /api/users/ - Create a new user
PUT /api/users/:id  - Update a user
DELETE /api/users/:id  - Delete a user
Role Management
GET /api/roles - Fetch all roles
POST /api/roles - Create a new role
PUT /api/roles/:id - Update a role
DELETE /api/roles/:id - Delete a role
Permission Management
GET /api/permissions - Fetch all permissions
POST /api/permissions - Create a new permission
PUT /api/permissions/:id  - Update a permission
DELETE /api/permissions/:id  - Delete a permission
8. Frontend 
8.1 Angular Components
User Management Component: Manages the UI for user CRUD operations.
Role Management Component: Manages the UI for role CRUD operations and role assignment.
Permission Management Component: Manages the UI for setting and editing permissions.
8.2 Services
UserService: Handles API calls related to users.
RoleService: Handles API calls related to roles.
PermissionService: Handles API calls related to permissions.
9. Backend Documentation
9.1 Folder Structure
controllers/: Contains all controller files (e.g., userController.js, roleController.js).
routes/: Defines the routes for users, roles, and permissions.
models/: Database schema and table definitions.
services/: Contains services like UserService, RoleService, and PermissionService.
db/: Database connection configuration.
9.2 Key Libraries Used
Express.js: For building RESTful APIs.
pg: PostgreSQL client for Node.js.
dotenv: To manage environment variables.

11. Usage Guide
11.1 Managing Users
Go to the User Management page.
Add, edit, or delete users.
Assign roles to users as needed.
11.2 Managing Roles
Go to the Role Management page.
Create, update, or delete roles.
Assign permissions to roles.
11.3 Managing Permissions
Go to the Permission Management page.
Create or edit permissions based on the resource levels (App, Module, Feature, etc.).
12. Troubleshooting
Issue: Cannot connect to the database.
Solution: Ensure the database is running and the connection parameters in .env are correct.
Issue: API endpoint returns a 404 error.
Solution: Check that the backend server is running and the routes are correctly configured.
Issue: Permissions not displaying correctly.
Solution: Verify that permissions are assigned properly in the database.
13. Future Enhancements
Role Hierarchy: Implement role inheritance for more complex role-based access.
Audit Logs: Track changes to roles, users, and permissions.


