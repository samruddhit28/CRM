# 🧩 CRM Backend (MERN Stack)

This is the backend for a Customer Relationship Management (CRM) system built using Node.js, Express.js, and MongoDB. It handles **user authentication**, **role-based access**, **lead management**, and **dashboard insights** for different user types: **Superadmin**, **Admin**, and **User**.

---

## 🔧 Technologies Used

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (JSON Web Token) for authentication
- bcryptjs for password hashing
- dotenv for managing environment variables
- Postman (for API testing)

---

## 🗂️ Project Structure (Files Included)

| File/Folders               | Description                                                                 |
|---------------------------|-----------------------------------------------------------------------------|
| `.env`                    | Environment variables: Mongo URI, JWT secret, port                         |
| `server.js`               | Main backend server setup and MongoDB connection                           |
| `models/User.js`          | User schema with role support (`Superadmin`, `Admin`, `User`)              |
| `models/Lead.js`          | Lead schema with status and next follow-up date                            |
| `middleware/authMiddleware.js` | Verifies JWT and attaches user to request                               |
| `middleware/superadminMiddleware.js` | Allows access only if role is `Superadmin`                     |
| `routes/auth.js`          | Register and login routes (returns JWT)                                     |
| `routes/leads.js`         | CRUD operations for leads (Create, Read, Update, Delete)                    |
| `routes/protected.js`     | Test route to verify JWT works                                              |
| `routes/superadmin.js`    | Superadmin-only routes (create user, view users)                            |
| `routes/dashboard.js`     | Returns dashboard data based on the role                                    |

---
~server.js
Main entry point for the server. It sets up:
Express server
Middleware (CORS, JSON parsing)
MongoDB connection using Mongoose
Route registrations (/api/auth, /api/leads, /api/dashboard, etc.)

~middleware/authMiddleware.js
Verifies JWT token in protected routes.
If valid, attaches the user’s ID and role to req.user.

~middleware/superadminMiddleware.js
Checks if the authenticated user’s role is Superadmin.
Only allows access to Superadmin-protected routes.

~models/User.js
Defines the User schema with the following fields:
name
email
password
role (allowed values: Superadmin, Admin, User)

~models/Lead.js
Defines the Lead schema with the following fields:
name, email, phone
status (New, Contacted, Qualified, Closed, Lost)
nextFollowUp (Date for follow-up reminders)
user (refers to the assigned User ID)

~routes/auth.js
Handles:
Register: POST /api/auth/register
Accepts name, email, password, and optional role. Default role is "User".
Login: POST /api/auth/login
Returns a JWT token and user data.

~routes/superadmin.js
Protected by both authMiddleware and superadminMiddleware.
Routes include:
POST /api/superadmin/create-user → Superadmin can create Admin/User accounts
GET /api/superadmin/users → Superadmin can view all registered users

~routes/dashboard.js
Displays different dashboard data based on the user’s role:
Superadmin:
Total users, admins, and leads
Recent users (last 5)
Admin:
Total leads
Breakdown of leads by status
User:
Their own lead count
Upcoming follow-ups (next 5)
Route: GET /api/dashboard (JWT token required in headers)

~routes/leads.js
Handles lead CRUD operations (all require JWT token):
POST /api/leads → Create a lead
GET /api/leads → Get all leads
PUT /api/leads/:id → Update lead
DELETE /api/leads/:id → Delete lead
Note: Each lead is linked to a user via user field.

~routes/protected.js
Test route to verify JWT token. Returns a welcome message.
Route: GET /api/dashboard (JWT required)

## 👥 User Roles Explained

| Role         | Description                                                                 |
|--------------|-----------------------------------------------------------------------------|
| `Superadmin` | Can create Admins/Users, view all users, and access system-wide dashboard  |
| `Admin`      | Can manage leads and view lead statistics                                  |
| `User`       | Can view and update their own leads with follow-up tracking                |

---

## 🔐 .env Configuration

Create a `.env` file in the root with the following:

PORT=5000
MONGO_URI=mongodb://localhost:27017/crmdb
JWT_SECRET=your_jwt_secret_key

yaml


---

## 🚀 How to Run

```bash
npm install
node server.js
Backend will run on:
http://localhost:5000

🧪 Postman Testing Guide
1.Register a Superadmin
POST to /api/auth/register with:
name, email, password, role: "Superadmin"

2.Login as Superadmin
POST to /api/auth/login
→ Copy the returned token

3.Create Admin/User (Superadmin only)
POST to /api/superadmin/create-user
Headers:
Authorization: Bearer token
Content-Type: application/json
Body: name, email, password, role ("Admin" or "User")

4.View All Users (Superadmin only)
GET /api/superadmin/users
Headers: Authorization: Bearer token

5.Create a Lead
POST /api/leads
Body: name, email, phone, status, nextFollowUp, user

6.View Leads
GET /api/leads
Headers: Authorization

7.Update Lead
PUT /api/leads/:id
Headers: Authorization
Body: any updated fields

8.Delete Lead
DELETE /api/leads/:id
Headers: Authorization

9.Dashboard
GET /api/dashboard
Headers: Authorization: Bearer token
Superadmin sees totals + users
Admin sees leads and status breakdown
User sees their leads and follow-ups


📊 Dashboard Role-Based Data
Role	Dashboard Data Returned
Superadmin	Total users, total admins, total leads, recent users
Admin	Total leads + lead breakdown by status
User	Their own leads + upcoming follow-up reminders

Roles & Permissions Summary
Superadmin
Can create Admins and Users
Can view all users
Can view full dashboard stats

Admin
Can manage leads
Can view dashboard stats related to leads

User
Can only manage and view their assigned leads
Can view their own dashboard

