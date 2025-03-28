# 🎨 EMPMonitor Frontend Setup

---

## 📌 Pre-Requisites

| 🛠️ Requirement | 📌 Version |
|--------------|------------|
| <img src="https://img.icons8.com/color/48/000000/php.png" width="48"> **PHP** | `^8.2 or Latest` |
| <img src="https://upload.wikimedia.org/wikipedia/commons/2/26/Logo-composer-transparent.png" width="48"> **Composer** | `Latest` |
| <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Laravel.svg" width="48"> **Laravel** | `^8.1` |
| <img src="https://img.icons8.com/color/48/000000/nodejs.png" width="48"> **Node.js** | `^22 or Latest` |
| <img src="https://img.icons8.com/color/48/000000/npm.png" width="48"> **NPM** | `^11.2.0 or Latest` |

---

## 🎯 Installation Process

1️⃣ **Requirement Check**  
2️⃣ **Set Up Laravel Project**  
3️⃣ **Install Dependencies**  
4️⃣ **Generate Application Key**  
5️⃣ **Run Development Server**  
6️⃣ **Compile Assets**  

---

## ✅ Step 1: Requirement Check

### 🔍 Checking Installed Versions

#### ✅ PHP
```sh
php -v
```
_Expected output:_ `PHP 7.4.x or later`

➡️ [Download PHP](https://www.php.net/downloads)

#### ✅ Composer
```sh
composer -V
```
_Expected output:_ `Latest Composer version`

➡️ [Download Composer](https://getcomposer.org/)

#### ✅ Node.js & NPM
```sh
node -v
npm -v
```
_Expected output:_ `Node.js 14.x.x` or later & `NPM 7.x.x` or later`

➡️ [Download Node.js](https://nodejs.org/)

---

## ⚙️ Step 2: Setting Up Laravel Project

### 🖥️ Create a New Laravel Project
```sh
composer create-project --prefer-dist laravel/laravel frontend-project
```

### 🏁 Navigate to Project Directory
```sh
cd frontend-project
```

---

## 📦 Step 3: Install Dependencies

### 🔹 Install Laravel Frontend Dependencies
```sh
npm install
```

---

## 🔑 Step 4: Generate Application Key
```sh
php artisan key:generate
```

_This ensures your Laravel application has a unique encryption key._

---

## 🚀 Step 5: Run Development Server

### ▶️ Start Laravel Development Server
```sh
php artisan serve
```
_Expected output:_ `Laravel development server started: http://127.0.0.1:8000`

---

## 🎨 Step 6: Compile Frontend Assets

### 🔹 Run Node for Asset Bundling
```sh
npm run dev
```
_Expected output:_ `Node server running at http://localhost:5173`

✅ Your Laravel frontend is now set up and running! 🚀

