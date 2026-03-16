# Student App - Implementation Checklist & Action Items

## 🚨 CRITICAL FIXES (Do Not Delay)

### Critical Issue #1: Delete Endpoint Authentication (TC007)

**File:** `delete_student.php`
**Status:** ❌ FAILING
**Impact:** Security vulnerability - unauthorized deletion possible

**Checklist:**

- [ ] Review current delete_student.php implementation
- [ ] Add explicit authentication check at line start
- [ ] Return 401 Unauthorized for unauthenticated requests
- [ ] Update to use standardized error format
- [ ] Test with both authenticated and unauthenticated users
- [ ] Re-run TC007 test to confirm fix
- [ ] Commit with message: "SECURITY FIX: Enforce auth on delete endpoint"

**Code Template:**

```php
<?php
declare(strict_types=1);

include_once __DIR__ . '/auth_guard.php';
auth_send_cors_headers('POST, OPTIONS', true);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  auth_json_response(405, ["status" => "failed", "message" => "Method not allowed."]);
}

// FIX: ENFORCE authentication IMMEDIATELY
auth_start_session();
if (empty($_SESSION['authenticated']) || empty($_SESSION['username'])) {
  auth_json_response(401, [
    "status" => "failed",
    "message" => "Authentication required. Please log in first.",
    "authenticated" => false,
  ]);
}

// ... rest of delete logic
```

**Testing:**

```bash
# Test 1: With auth (should work)
curl -X POST http://localhost/api/delete_student.php \
  -H "Content-Type: application/json" \
  -b "PHPSESSID=your_session_id" \
  -d '{"id": 1}'

# Test 2: Without auth (should return 401)
curl -X POST http://localhost/api/delete_student.php \
  -H "Content-Type: application/json" \
  -d '{"id": 1}'
```

---

### Critical Issue #2: Update Endpoint Missing Authentication

**File:** `update_student.php`
**Status:** ⚠️ Security Gap
**Impact:** Unauthorized users can modify student records

**Checklist:**

- [ ] Add authentication enforcement at start of file
- [ ] Ensure auth_require_authenticated_session() is called
- [ ] Return proper error for unauthenticated requests
- [ ] Run test: unauthenticated update should fail
- [ ] Update API documentation

---

---

## 🟡 INPUT VALIDATION IMPROVEMENTS

### Task: Add Comprehensive Input Validation

**Files to Update:**

- [ ] `create_student.php`
- [ ] `update_student.php`

**Validation Rules to Implement:**

```
Firstname:
  - Required: Yes
  - Min length: 2
  - Max length: 100
  - Allowed chars: a-z, A-Z, spaces, apostrophes, hyphens
  - Pattern: /^[a-zA-Z\s\'-]+$/

Lastname:
  - Required: Yes
  - Min length: 2
  - Max length: 100
  - Allowed chars: a-z, A-Z, spaces, apostrophes, hyphens
  - Pattern: /^[a-zA-Z\s\'-]+$/

Ratings:
  - Required: Yes
  - Type: Number (float)
  - Min value: 0
  - Max value: 100
  - Decimal places: max 2
```

**Implementation Checklist:**

- [ ] Create validation.php utility file
- [ ] Implement validate_student_data() function
- [ ] Add unit tests for validation edge cases
- [ ] Test with XSS payloads in firstname
- [ ] Test with SQL injection attempts
- [ ] Test with empty/null values
- [ ] Test with very long strings (>100 chars)
- [ ] Test with special characters
- [ ] Document validation rules in API docs
- [ ] Update frontend to match validation rules

**Test Cases to Create:**

```
TC008: Create with empty firstname → should reject
TC009: Create with firstname > 100 chars → should reject
TC010: Create with firstname = "Robert'; DROP TABLE students;--" → should reject/sanitize
TC011: Create with ratings = -10 → should reject
TC012: Create with ratings = 999 → should reject
TC013: Create with ratings = 50.5 → should accept
TC014: Create with lastname containing numbers → should reject
TC015: Update with invalid data → should reject
```

---

## 🔐 SECURITY IMPROVEMENTS

### Task 1: Fix CORS Configuration

**Files to Update:**

- [ ] All API endpoints (7 files)
- [ ] Create auth_cors.php utility

**Checklist:**

- [ ] Define allowlist of origins (update in auth_cors.php):
  ```
  - http://localhost:8081
  - http://localhost:8082
  - http://192.168.0.78:8081
  - https://production-domain.com (when ready)
  ```
- [ ] Replace all `Access-Control-Allow-Origin: *` with validated origins
- [ ] Test CORS preflight requests
- [ ] Verify browser blocks unauthorized origins
- [ ] Document CORS configuration

**Code to Add:**

```php
// auth_cors.php
function send_cors_headers($allowed_methods = 'GET, POST, OPTIONS') {
    $allowed_origins = [
        'http://localhost:8081',
        'http://localhost:8082',
        'http://192.168.0.78:8081',
    ];

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: " . $origin);
        header("Access-Control-Allow-Methods: " . $allowed_methods);
        header("Access-Control-Allow-Headers: Content-Type");
        header("Access-Control-Allow-Credentials: true");
    }
}
```

### Task 2: Add Input Sanitization

**Locations:** All endpoints that accept user input

**Checklist:**

- [ ] Create sanitize.php utility
- [ ] Implement sanitize_input() function
- [ ] Apply to all POST/PUT data
- [ ] Test XSS protection
- [ ] Add unit tests

**Code:**

```php
function sanitize_input($input) {
    if (is_array($input)) {
        return array_map('sanitize_input', $input);
    }
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

// Usage in all endpoints
$firstname = sanitize_input($_POST['firstname'] ?? '');
$lastname = sanitize_input($_POST['lastname'] ?? '');
```

### Task 3: Add Session Security Headers

**File:** auth_session.php

**Checklist:**

- [ ] Add HttpOnly flag to session cookies
- [ ] Add Secure flag (HTTPS)
- [ ] Add SameSite attribute (Strict)
- [ ] Test cookie flags in browser dev tools

**Code:**

```php
session_set_cookie_params([
    'lifetime' => 3600,
    'path' => '/',
    'domain' => $_SERVER['HTTP_HOST'],
    'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on',
    'httponly' => true,
    'samesite' => 'Strict',
]);
```

---

## 🧪 TESTING IMPROVEMENTS

### Backend Additional Tests

**Create new test cases:**

**TC008: Input Validation - Empty Firstname**

```python
# Should reject with 400 and error message
POST /api/create_student.php
{
  "firstname": "",
  "lastname": "Doe",
  "ratings": 85
}
Expected: 400, "Firstname is required"
```

**TC009: Input Validation - Long Firstname**

```python
# Should reject with 400
POST /api/create_student.php
{
  "firstname": "xxxxx...xxxxx" (> 100 chars),
  "lastname": "Doe",
  "ratings": 85
}
Expected: 400, "Firstname must be between 2 and 100 characters"
```

**TC010: XSS Attempt in Firstname**

```python
# Should sanitize/reject XSS payload
POST /api/create_student.php
{
  "firstname": "<script>alert('xss')</script>",
  "lastname": "Doe",
  "ratings": 85
}
Expected: 400 or sanitized to safe value
```

**TC011: SQL Injection Attempt**

```python
# Should safely handle injection attempt
POST /api/create_student.php
{
  "firstname": "Robert'; DROP TABLE students;--",
  "lastname": "Doe",
  "ratings": 85
}
Expected: Either reject or safely sanitize (no table drop)
```

**TC012: Invalid Ratings**

```python
# Should reject ratings outside 0-100 range
POST /api/create_student.php
{
  "firstname": "John",
  "lastname": "Doe",
  "ratings": 150
}
Expected: 400, "Ratings must be between 0 and 100"
```

**TC013: Update Endpoint Missing Auth**

```python
# Should reject unauthenticated update
POST /api/update_student.php
(no session cookie)
{
  "id": 1,
  "firstname": "Jane",
  "lastname": "Doe",
  "ratings": 90
}
Expected: 401, "Authentication required"
```

**Checklist:**

- [ ] Create TC008-TC013 test cases
- [ ] Run all tests and verify results
- [ ] Update test report with new results
- [ ] Ensure 100% pass rate before deployment

---

## 📊 CODE QUALITY IMPROVEMENTS

### Task: Standardize Error Response Format

**Current:** Inconsistent error formats across endpoints
**Target:** Consistent format everywhere

**Standardized Format:**

```json
{
  "status": "ok|failed|error",
  "message": "Human readable message",
  "authenticated": true|false (if applicable),
  "data": {} (on success),
  "errors": ["field error 1", "field error 2"]
}
```

**Checklist:**

- [ ] Define error response constants in errors.php
- [ ] Update all endpoints to use standard format
- [ ] Create helper function: json_error_response()
- [ ] Create helper function: json_success_response()
- [ ] Update API documentation
- [ ] Test all error scenarios

**Error Code Mapping:**

```
200 - Success
400 - Bad Request (validation error)
401 - Unauthorized (auth required)
404 - Not Found (resource doesn't exist)
405 - Method Not Allowed
500 - Internal Server Error
```

---

## 🏗️ CONFIGURATION MANAGEMENT

### Task: Centralize Configuration

**Create config/ directory with:**

**Files to Create:**

- [ ] config/constants.php
- [ ] config/database.php
- [ ] config/errors.php
- [ ] config/validation.php
- [ ] .env.example

**config/constants.php:**

```php
<?php
// Field lengths
define('MIN_FIRSTNAME_LENGTH', 2);
define('MAX_FIRSTNAME_LENGTH', 100);
define('MIN_LASTNAME_LENGTH', 2);
define('MAX_LASTNAME_LENGTH', 100);

// Ratings
define('MIN_RATING', 0);
define('MAX_RATING', 100);

// Session
define('SESSION_TIMEOUT', 3600);

// CORS
$ALLOWED_ORIGINS = [
    'http://localhost:8081',
    'http://localhost:8082',
    'http://192.168.0.78:8081',
];
```

**Checklist:**

- [ ] Create config/ directory structure
- [ ] Move all constants to config files
- [ ] Update all includes to use centralized config
- [ ] Create .env.example template
- [ ] Document configuration options
- [ ] Add to .gitignore: .env (don't commit secrets)

---

## 📚 DOCUMENTATION

### Task: Create API Documentation

**Checklist:**

- [ ] Create API_DOCUMENTATION.md
- [ ] Document each endpoint with:
  - [ ] HTTP Method
  - [ ] URL path
  - [ ] Authentication required (yes/no)
  - [ ] Request body schema
  - [ ] Response schema examples
  - [ ] Error codes and meanings
  - [ ] Example curl commands
- [ ] Create AUTHENTICATION.md
- [ ] Create DEPLOYMENT.md
- [ ] Create DEVELOPMENT.md
- [ ] Update main README.md

**Example API Doc Entry:**

````markdown
## POST /api/create_student.php

**Authentication:** Required (session cookie)

**Request Body:**

```json
{
  "firstname": "John",
  "lastname": "Doe",
  "ratings": 85
}
```
````

**Response (Success 200):**

```json
{
  "status": "ok",
  "message": "Student created successfully",
  "data": {
    "id": 123,
    "firstname": "John",
    "lastname": "Doe",
    "ratings": 85
  }
}
```

**Response (Validation Error 400):**

```json
{
  "status": "failed",
  "message": "Validation failed",
  "errors": [
    "Firstname must be between 2 and 100 characters",
    "Ratings must be between 0 and 100"
  ]
}
```

**Response (Unauthorized 401):**

```json
{
  "status": "failed",
  "message": "Authentication required. Please log in first.",
  "authenticated": false
}
```

````

---

## 🚀 DEPLOYMENT CHECKLIST

### Pre-Deployment Verification

- [ ] All tests passing (100% success rate)
- [ ] No PHP errors in logs
- [ ] Code review completed
- [ ] Documentation updated
- [ ] Security checklist passed:
  - [ ] Input validation implemented
  - [ ] CORS properly configured
  - [ ] Session security headers set
  - [ ] SQL injection protection verified
  - [ ] XSS protection implemented
- [ ] Performance tested (response times < 200ms)
- [ ] Database backups configured
- [ ] Error logging to file (not stdout)
- [ ] DEBUG mode disabled in production

### Deployment Steps

1. **Pre-deployment:**
   ```bash
   # Create backup
   mysqldump -u root student > backup_$(date +%Y%m%d_%H%M%S).sql

   # Run all tests
   php test_runner.php
````

2. **Deploy code:**

   ```bash
   git pull origin main
   php composer install (if using composer)
   ```

3. **Post-deployment:**
   - [ ] Verify API endpoints responding
   - [ ] Check error logs
   - [ ] Monitor database queries
   - [ ] Test critical user flows

---

## 📈 PROGRESS TRACKING

### Week 1 Goals

- [ ] Fix TC007 (delete auth)
- [ ] Add auth to update endpoint
- [ ] Implement input validation
- [ ] Fix CORS configuration
- [ ] Create all TC008-TC013 tests
- [ ] Achieve 100% backend test pass rate

### Week 2 Goals

- [ ] Complete frontend tests
- [ ] Add security headers
- [ ] Create API documentation
- [ ] Refactor code structure
- [ ] Add rate limiting

### Week 3 Goals

- [ ] Performance optimization
- [ ] Error monitoring setup
- [ ] Production deployment
- [ ] Security audit
- [ ] Final testing

---

## 📞 QUICK START - Today's Tasks

**If you have 2 hours:**

1. ( ) Fix TC007 delete auth issue
2. ( ) Add input validation
3. ( ) Fix CORS configuration

**If you have 4 hours:**

1. ( ) All of above plus:
2. ( ) Add auth to update endpoint
3. ( ) Create TC008-TC013 tests
4. ( ) Run new tests

**If you have full day:**

1. ( ) All of above plus:
2. ( ) Standardize error responses
3. ( ) Create config structure
4. ( ) Start API documentation
5. ( ) Commit all changes to git

---

**Version:** 1.0
**Created:** 2026-03-16
**Last Updated:** 2026-03-16
**Next Review:** After critical fixes implementation
