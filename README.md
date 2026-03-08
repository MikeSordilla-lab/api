# Student App

A simple student management system with a PHP/MySQL backend and a React Native (Expo) mobile app.

---

## Prerequisites

- [XAMPP](https://www.apachefriends.org/) (Apache + MySQL)
- [Node.js](https://nodejs.org/) (v18 or later)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) — install with `npm install -g expo-cli`
- Expo Go app on your phone (or an Android/iOS emulator)

---

## 1. Set Up the Backend (PHP API)

1. Install and open XAMPP. Start **Apache** and **MySQL**.

2. Copy the `api` folder into your XAMPP `htdocs` directory:

   ```
   C:\xampp\htdocs\api\
   ```

3. Open **phpMyAdmin** at `http://localhost/phpmyadmin` and create a database named `student`.

4. Run the following SQL to create the required table:

   ```sql
   CREATE TABLE student_list (
     id INT AUTO_INCREMENT PRIMARY KEY,
     firstname VARCHAR(100) NOT NULL,
     lastname VARCHAR(100) NOT NULL,
     ratings FLOAT NOT NULL
   );
   ```

5. Open `db.php` and update the connection settings if needed:

   ```php
   $host     = "localhost";
   $user     = "root";
   $password = "";        // your MySQL password
   $database = "student";
   $port     = 3307;      // default MySQL port is 3306; adjust to match your XAMPP config
   ```

6. Verify the API works by visiting `http://localhost/api/students.php` in your browser — you should see a JSON response.

---

## 2. Set Up the Mobile App

1. Open a terminal and navigate to the `StudentApp` folder:

   ```bash
   cd StudentApp
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Find your machine's **local IP address** (e.g. `192.168.1.x`):
   - Windows: run `ipconfig` in a terminal and look for **IPv4 Address**

4. Open `App.js` and update `BASE_URL` to point to your machine:

   ```js
   const BASE_URL = "http://<your-local-ip>/api";
   // Example: const BASE_URL = "http://192.168.1.10/api";
   ```

   > Make sure your phone and your computer are on the **same Wi-Fi network**.

5. Start the Expo development server:

   ```bash
   npm start
   ```

6. Scan the QR code with the **Expo Go** app on your phone, or press `a` for Android emulator / `i` for iOS simulator.

---

## Project Structure

```
api/
├── db.php               # Database connection
├── students.php         # GET all students
├── create_student.php   # POST create student
├── update_student.php   # PUT update student
├── delete_student.php   # DELETE student
└── StudentApp/          # React Native mobile app
    ├── App.js
    ├── components/
    │   ├── StudentCard.js
    │   └── StudentForm.js
    └── theme/  
        └── bootstrap.js
```
