# CRM
CRM (Customer Relationship Management)
User Authentication API (Backend)

This backend handles user registration, login, and role-based access control for the CRM project. It uses Node.js, Express, MongoDB, and JWT.

---

📁 Folder Structure (Important Files)

/models/User.js        → User schema with roles
/routes/auth.js        → Login and Register routes
/server.js             → Main server file
.env                   → MongoDB URI & JWT secret

---

⚙ Tech Used

Express.js for routing

MongoDB via Mongoose

bcryptjs for password hashing

jsonwebtoken (JWT) for secure login sessions

dotenv for environment variables

---

👥 User Roles Supported

Admin – can manage customers and users

User – can only access and update assigned customers


(The Superadmin role can be added later if needed)


---

🔐 API Endpoints

✅ Register a User

POST /api/auth/register

Body (JSON):

{
  "name": "Sam",
  "email": "sam@example.com",
  "password": "123456",
  "role": "Admin"
}

✅ Login

POST /api/auth/login

Body (JSON):

{
  "email": "sam@example.com",
  "password": "123456"
}

Response:

token → use this in Authorization header for protected routes

user object (id, name, role)

---

🛡 Protecting Routes (For Frontend)

To access protected routes (like /dashboard, /leads, etc.), the frontend must:

Send the JWT token in headers:


Authorization: Bearer <your_token_here>
---

🌐 .env Example

PORT=5000
MONGO_URI=mongodb://localhost:27017/crmdb
JWT_SECRET=your_jwt_secret_key

---

🧪 Postman Testing Tip

After login, copy the token from response and add it to your request headers when testing protected routes.
