# Student App - Project Documentation

**Last Updated:** March 18, 2026  
**Status:** Production Ready

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Backend API](#backend-api)
6. [Frontend Application](#frontend-application)
7. [Database Schema](#database-schema)
8. [Authentication & Security](#authentication--security)
9. [Setup & Installation](#setup--installation)
10. [Running the Application](#running-the-application)
11. [API Usage Examples](#api-usage-examples)
12. [Key Components & Functions](#key-components--functions)

---

## 🎯 Project Overview

**Student App** is a full-stack web and mobile application for managing student records. The system provides secure CRUD (Create, Read, Update, Delete) operations for student data with built-in authentication, validation, and XSS protection.

### Key Features

- ✅ User authentication with session management
- ✅ Secure CRUD operations for student records
- ✅ Input validation and sanitization
- ✅ XSS prevention
- ✅ CORS security configuration
- ✅ Session timeout enforcement
- ✅ React Native cross-platform application
- ✅ Responsive web interface

---

## 🏗️ Architecture

### System Design

```
┌─────────────────────┐
│   Frontend (React)  │
│   - StudentApp/     │
│   - Web & Mobile    │
└──────────┬──────────┘
           │
      HTTP/CORS
           │
┌──────────▼──────────┐
│  Backend (PHP)      │
│  - API Endpoints    │
│  - Sessions         │
│  - Validation       │
└──────────┬──────────┘
           │
       MySQL (XPATH)
           │
┌──────────▼──────────┐
│  Database (MySQL)   │
│  - student_list     │
└─────────────────────┘
```

### Request Flow

1. **Client Request**: Frontend sends HTTP request with credentials included
2. **CORS Validation**: Backend checks CORS headers and origin
3. **Session Check**: Validates active session and timeout
4. **Input Processing**: Validates and sanitizes input data
5. **Database Operation**: Executes the requested CRUD operation
6. **Response**: Returns JSON with appropriate status code

---

## 💻 Technology Stack

### Backend

- **Language**: PHP 8.2+
- **Database**: MySQL/MariaDB (10.4+)
- **Session Management**: PHP Native Sessions
- **Server**: Apache (XAMPP)

### Frontend

- **Framework**: React Native (v0.81.5)
- **Runtime**: Expo (v54.0.0)
- **UI Framework**: React Native Web
- **Build Tool**: Metro
- **Package Manager**: npm

### Security Libraries

- **Crypto**: PHP password_hash/verify
- **Validation**: Custom validation.php
- **Sanitization**: Custom sanitize.php with HTML entity encoding

---

## 📁 Project Structure

```
/c/xampp/htdocs/api/
├── StudentApp/                 # React Native Application
│   ├── App.js                 # Main app component
│   ├── index.js               # Entry point
│   ├── app.json               # Expo configuration
│   ├── package.json           # Dependencies
│   ├── metro.config.js        # Metro bundler config
│   ├── components/            # React components
│   │   ├── StudentCard.js
│   │   └── ...
│   ├── services/              # API service layer
│   │   └── studentApi.js      # API calls
│   ├── utils/                 # Utility functions
│   │   ├── config.js
│   │   └── alerts.js
│   ├── theme/                 # Styling
│   │   └── styles.js
│   └── assets/                # Images and static files
│
├── Backend API Endpoints
│   ├── login.php              # User authentication
│   ├── logout.php             # Session termination
│   ├── me.php                 # Current user info
│   ├── students.php           # List all students
│   ├── create_student.php     # Create new student
│   ├── update_student.php     # Update existing student
│   └── delete_student.php     # Delete student
│
├── Authentication & Security
│   ├── auth_config.php        # Auth constants
│   ├── auth_guard.php         # Auth middleware
│   ├── auth_session.php       # Session management
│   ├── validation.php         # Input validation
│   └── sanitize.php           # XSS prevention
│
├── Database
│   ├── db.php                 # Database connection
│   └── student.sql            # Database schema
│
├── assets/                    # Shared static files
├── apps/                      # Additional applications
└── PROJECT_DOCUMENTATION.md   # This file
```

---

## 🔌 Backend API

### Authentication Endpoints

#### Login

```
POST /api/login.php
Content-Type: application/json

Request:
{
  "username": "admin",
  "password": "admin123"
}

Response (200 OK):
{
  "status": "ok",
  "message": "Login successful",
  "username": "admin"
}

Error (401):
{
  "status": "failed",
  "message": "Invalid credentials"
}
```

#### Logout

```
POST /api/logout.php
Credentials: required (session cookie)

Response (200 OK):
{
  "status": "ok",
  "message": "Logout successful"
}
```

#### Get Current User

```
GET /api/me.php
Credentials: required (session cookie)

Response (200 OK):
{
  "status": "ok",
  "username": "admin",
  "authenticated": true
}

Error (401):
{
  "status": "failed",
  "authenticated": false
}
```

### Student CRUD Endpoints

#### Get All Students

```
GET /api/students.php
Credentials: required (session cookie)

Response (200 OK):
[
  {
    "id": 1,
    "firstname": "John",
    "lastname": "Doe",
    "ratings": 85.5,
    "last_update": "2026-03-18 10:30:00"
  },
  ...
]

Error (401):
{
  "status": "failed",
  "message": "Unauthorized. Please log in first."
}
```

#### Create Student

```
POST /api/create_student.php
Content-Type: application/json
Credentials: required (session cookie)

Request:
{
  "firstname": "Jane",
  "lastname": "Smith",
  "ratings": 92
}

Response (200 OK):
{
  "status": "ok",
  "message": "New student has been created."
}

Validation Errors (400):
{
  "status": "failed",
  "message": "Validation failed",
  "errors": [
    "firstname is required"
  ]
}
```

#### Update Student

```
POST /api/update_student.php
Content-Type: application/json
Credentials: required (session cookie)

Request:
{
  "id": 1,
  "firstname": "Jane",
  "lastname": "Smith",
  "ratings": 95
}

Response (200 OK):
{
  "status": "ok",
  "message": "Student's information has been updated."
}

Not Found (200):
{
  "status": "failed",
  "message": "Student not found."
}
```

#### Delete Student

```
POST /api/delete_student.php
Content-Type: application/json
Credentials: required (session cookie)

Request:
{
  "id": 1
}

Response (200 OK):
{
  "status": "ok",
  "message": "Student information has been deleted."
}

Not Found (200):
{
  "status": "failed",
  "message": "Student not found."
}
```

---

## 🎨 Frontend Application

### Main Application Structure

**StudentApp/App.js** - Main application component

- Renders the student management interface
- Handles CRUD operations
- Manages UI state and alerts

### Key Components

#### StudentCard.js

Displays individual student information with edit/delete actions.

#### Components Features

- Dynamic rendering of student data
- Delete confirmation dialogs
- Edit form modal
- Real-time validation feedback

### Services

#### studentApi.js - API Service Layer

Provides methods for all API interactions:

```javascript
// Authentication
export const login = async({ username, password });
export const logout = async();
export const getAuthStatus = async();

// Student Operations
export const getStudents = async();
export const createStudent = async({ firstname, lastname, ratings });
export const updateStudent = async({ id, firstname, lastname, ratings });
export const deleteStudent = async(id);
```

**Key Features:**

- Automatic credential handling with `credentials: "include"`
- JSON request/response handling
- Error message extraction from API responses
- Centralized error handling

### Utilities

#### config.js

- API base URL configuration
- Environment-specific settings

#### alerts.js

- SweetAlert2 integration
- Delete confirmation dialogs
- Success/error notifications

---

## 🗄️ Database Schema

### Database: `student`

#### Table: `student_list`

```sql
CREATE TABLE `student_list` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `ratings` decimal(5,2) DEFAULT NULL,
  `last_update` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### Column Descriptions

| Column        | Type         | Description                     |
| ------------- | ------------ | ------------------------------- |
| `id`          | INT          | Primary key, auto-incremented   |
| `firstname`   | VARCHAR(50)  | Student's first name (required) |
| `lastname`    | VARCHAR(50)  | Student's last name (required)  |
| `ratings`     | DECIMAL(5,2) | Student rating (0-100)          |
| `last_update` | DATETIME     | Timestamp of last modification  |

#### Validation Rules

- **firstname & lastname**: 1-100 characters, alphanumeric and spaces only
- **ratings**: 0-100 range, numeric values only
- Empty fields are rejected
- XSS payloads are sanitized (HTML entities)

---

## 🔐 Authentication & Security

### Session Management

**Configuration** (`auth_config.php`):

```php
AUTH_USERNAME = 'admin'              // Default username
AUTH_PASSWORD = 'admin123'           // Default password
AUTH_SESSION_TIMEOUT_SECONDS = 3600  // 1 hour timeout
AUTH_SESSION_NAME = 'studentapp_session'
```

Environment variables can override defaults:

```bash
STUDENTAPP_AUTH_USER=your_username
STUDENTAPP_AUTH_PASS=your_password
```

### Authentication Flow

1. **Login Request**: User submits credentials to `/api/login.php`
2. **Credential Validation**: Username/password verified against config
3. **Session Creation**: PHP native session created with secure cookie
4. **Session Cookie**: Returned with `HttpOnly`, `Secure`, `SameSite=Strict`
5. **Subsequent Requests**: Session cookie validated on each request

### Security Features

#### CORS Protection

- Whitelist-based origin validation
- Credentials restricted to whitelisted origins
- `Access-Control-Allow-Credentials: true` for authenticated requests

#### XSS Prevention

- HTML entity encoding in `sanitize.php`
- Special characters converted to HTML entities
- Applied after validation but before database storage

#### Input Validation

Strict validation in `validation.php`:

- Required field checks
- Character set validation (alphanumeric + spaces)
- Length constraints
- Range validation for ratings (0-100)
- Type checking

#### Session Security

- Session timeout: 1 hour inactivity
- Cookie flags: `HttpOnly`, `Secure`, `SameSite=Strict`
- Session destruction on logout
- Token-less but cookie-based authentication

### Error Responses

#### 401 Unauthorized

Returned when session is missing or expired:

```json
{
  "status": "failed",
  "message": "Unauthorized. Please log in first."
}
```

#### 405 Method Not Allowed

```json
{
  "status": "failed",
  "message": "Method not allowed."
}
```

#### 400 Bad Request (Validation)

```json
{
  "status": "failed",
  "message": "Validation failed",
  "errors": ["specific error messages"]
}
```

---

## ⚙️ Setup & Installation

### Prerequisites

- PHP 8.2+
- MySQL 10.4+
- Node.js 18+
- npm or yarn
- Apache (XAMPP recommended)

### Database Setup

1. **Create Database:**

   ```sql
   CREATE DATABASE student;
   ```

2. **Import Schema:**

   ```bash
   mysql -u root -p student < student.sql
   ```

3. **Verify Table:**
   ```sql
   USE student;
   SHOW TABLES;
   DESCRIBE student_list;
   ```

### Backend Setup

1. **Place Files:** Copy all PHP files to XAMPP htdocs directory
2. **Configure Database:** Update `db.php` if needed
3. **Set Permissions:** Ensure PHP can write to session directory
4. **Test Connection:**
   ```bash
   curl -X POST http://localhost/api/login.php \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'
   ```

### Frontend Setup

```bash
# Navigate to StudentApp directory
cd StudentApp

# Install dependencies
npm install

# Configure API endpoint (if needed)
# Edit utils/config.js with your API base URL
```

---

## 🚀 Running the Application

### Start Backend Server

The backend runs on your local XAMPP Apache server (default: `http://localhost`)

```bash
# Ensure XAMPP Apache is running
# Verify at http://localhost/api/login.php
```

### Start Frontend Application

#### Web Development

```bash
cd StudentApp
npm run web

# Opens at http://localhost:8081 (or another available port)
```

#### Android (with connected device/emulator)

```bash
cd StudentApp
npm run android
```

#### iOS (macOS only)

```bash
cd StudentApp
npm run ios
```

### Verify Setup

1. Open application in browser
2. Login with credentials:
   - Username: `admin`
   - Password: `admin123`
3. Test CRUD operations:
   - Create a new student
   - View student list
   - Update student details
   - Delete student record

---

## 📡 API Usage Examples

### Authentication Example

```javascript
// Login
const response = await fetch("http://localhost/api/login.php", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    username: "admin",
    password: "admin123",
  }),
});

const result = await response.json();
// Result: { status: 'ok', message: 'Login successful', username: 'admin' }
```

### CRUD Operations Example

```javascript
// Get all students (requires session cookie)
const getResponse = await fetch("http://localhost/api/students.php", {
  method: "GET",
  credentials: "include",
});
const students = await getResponse.json();

// Create student
const createResponse = await fetch("http://localhost/api/create_student.php", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    firstname: "John",
    lastname: "Doe",
    ratings: 85,
  }),
});

// Update student
const updateResponse = await fetch("http://localhost/api/update_student.php", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    id: 1,
    firstname: "Jane",
    lastname: "Doe",
    ratings: 92,
  }),
});

// Delete student
const deleteResponse = await fetch("http://localhost/api/delete_student.php", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ id: 1 }),
});
```

---

## 🔧 Key Components & Functions

### Backend Functions

#### `auth_guard.php`

```php
// Send CORS headers
auth_send_cors_headers($methods, $allowCredentials)

// Return JSON response with HTTP status
auth_json_response($statusCode, $payload)

// Check authentication and return 401 if not authenticated
auth_require_authenticated_session()

// Return 401 unauthorized error
auth_unauthorized($message)
```

#### `auth_session.php`

```php
// Initialize PHP session
auth_start_session()

// Check if session has expired
auth_is_session_expired()

// Update last activity timestamp
auth_touch_session()

// Enforce timeout and destroy if expired
auth_enforce_session_timeout()
```

#### `validation.php`

```php
// Validate all student data
validate_student_data($data)
// Returns array of validation errors (empty if valid)
```

#### `sanitize.php`

```php
// Sanitize input data (HTML entity encoding)
sanitize_input($data)
// Returns sanitized data with HTML entities encoded
```

### Frontend Functions

#### `studentApi.js`

```javascript
// Create API error from HTTP response
createApiError(response);

// Make POST request with JSON
postJson(path, payload, { withCredentials });

// Authentication functions
login({ username, password });
logout();
getAuthStatus();

// Student CRUD functions
getStudents();
createStudent({ firstname, lastname, ratings });
updateStudent({ id, firstname, lastname, ratings });
deleteStudent(id);
```

#### `alerts.js`

```javascript
// Show delete confirmation dialog
showDeleteConfirmation(studentName);

// Show success message
showSuccessAlert(message);

// Show error message
showErrorAlert(message);
```

---

## 📝 Common Issues & Solutions

### Issue: 401 Unauthorized on CRUD Operations

**Solution:** Ensure credentials are included in fetch requests:

```javascript
credentials: "include"; // For fetch()
withCredentials: true; // For axios
```

### Issue: CORS Errors

**Solution:** Verify CORS headers are being sent. Check `auth_send_cors_headers()` is called before any output.

### Issue: Validation Fails for Valid Input

**Solution:** Review validation rules in `validation.php`. Ensure input meets all constraints:

- Alphanumeric + spaces only
- Length: 1-100 characters
- Ratings: 0-100 range

### Issue: Session Expires Too Quickly

**Solution:** Modify `AUTH_SESSION_TIMEOUT_SECONDS` in `auth_config.php` or use environment variable:

```bash
STUDENTAPP_AUTH_TIMEOUT=7200  # 2 hours
```

---

## 📞 Support & Maintenance

### Testing

Manual API testing can be performed using curl:

```bash
# Test login
curl -X POST http://localhost/api/login.php \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  -c cookies.txt

# Test protected endpoint (using saved cookies)
curl -X GET http://localhost/api/students.php \
  -b cookies.txt
```

### Performance Monitoring

- Monitor session table size in `/tmp` or Windows temp
- Check database query performance with slow query log
- Profile frontend with React DevTools

### Backups

Regular backups recommended:

```bash
# Database backup
mysqldump -u root -p student > backup_$(date +%Y%m%d).sql

# Application backup
tar -czf studentapp_backup_$(date +%Y%m%d).tar.gz /path/to/api/
```

---

**End of Documentation**
