# api Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-08

## Active Technologies
- JavaScript (React 19, React Native 0.79, Expo SDK 54), PHP 8+ (existing backend) + expo, react-native, react-native-web, sweetalert2, react-native-awesome-alerts (main)
- MySQL via existing PHP backend (`student.student_list`) (main)
- PHP 8+ scripts on XAMPP, JavaScript with React 19 / React Native 0.79 / Expo SDK 54 + Native PHP sessions, MySQLi, Expo/React Native, existing frontend `fetch` service layer (001-i-want-you-to-create-a-login-before-i-can-add-a-student)
- MySQL (`student.student_list`) for student data; PHP session storage for auth state; no new DB tables (001-i-want-you-to-create-a-login-before-i-can-add-a-student)

- JavaScript (React 19.2.0) / React Native 0.83.2 / Expo SDK ~55.0.4 + expo ~55.0.4, react-native 0.83.2, react-native-web ^0.21.0 — no new dependencies required (001-bootstrap-ui-redesign)

## Project Structure

```text
src/
tests/
```

## Commands

npm test; npm run lint

## Code Style

JavaScript (React 19.2.0) / React Native 0.83.2 / Expo SDK ~55.0.4: Follow standard conventions

## Recent Changes
- 001-i-want-you-to-create-a-login-before-i-can-add-a-student: Added PHP 8+ scripts on XAMPP, JavaScript with React 19 / React Native 0.79 / Expo SDK 54 + Native PHP sessions, MySQLi, Expo/React Native, existing frontend `fetch` service layer
- main: Added JavaScript (React 19, React Native 0.79, Expo SDK 54), PHP 8+ (existing backend) + expo, react-native, react-native-web, sweetalert2, react-native-awesome-alerts

- 001-bootstrap-ui-redesign: Added JavaScript (React 19.2.0) / React Native 0.83.2 / Expo SDK ~55.0.4 + expo ~55.0.4, react-native 0.83.2, react-native-web ^0.21.0 — no new dependencies required

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
