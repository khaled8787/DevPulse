# DevPulse API

Live API: https://devpulse-2.onrender.com/

## Features
 User authentication with JWT
 Role-based authorization
 Create/update/delete issues
 Filtering and sorting issues
 PostgreSQL database integration
 Raw SQL queries

 ## Tech Stack
 Node.js
 Express.js
 TypeScript
 PostgreSQL
 JWT
 bcrypt

 ## Setup Instructions
```bash
npm install
npm run dev

 ## API Endpoint List
 POST /api/auth/signup
 POST /api/auth/login

 GET /api/issues
 GET /api/issues/:id
 POST /api/issues
 PATCH /api/issues/:id
 DELETE /api/issues/:id


 ## Database Schema
### users
 id
 name
 email
 password
 role

### issues
 id
 title
 description
 type
 status
 reporter_id