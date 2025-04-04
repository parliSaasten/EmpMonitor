<div align="right">
  <img src="https://img.shields.io/badge/OpenSource-000?style=for-the-badge&logo=ghost&logoColor=black&color=ffd700" alt="OpenSource-Badge">
</div>

![EmpMonitor](/EmpMonitor-OpenSource-main/assets/EMPMonitor%20logo.png)
<p align="center"><i>Your Workforce Productivity Compass</i></p>

> **_EmpMonitor: The Worlds #1 Leading Open-Source Platform for Workforce Management & Productivity Enhancement_**






# 💻 Frontend Architecture

**[EmpMonitor's Open Source Frontend Architecture](https://www.empmonitor.com/)**  Service plays a crucial role in ensuring a smooth and efficient user experience within the EmpMonitor open-source platform. It bridges the gap between the user interface and the backend services, ensuring that every interaction is fast, reliable, and well-structured.

To set up this service successfully, developers must meet specific environment requirements. The system requires PHP (8.3 or later), Composer (latest or 2.5.5), and Laravel (10 or later) to avoid compatibility issues and ensure seamless performance.

This architecture is designed to support scalable and secure operations. By maintaining an optimized environment, developers can ensure that the frontend interacts effectively with APIs, processes data efficiently, and delivers a responsive user experience.








## ➤ Pre-Requisites
Before proceeding with the **Frontend Architecture Service**, ensure your development environment meets the following requirements for a smooth setup:

| 🛠️ Requirement | 📌 Version |
|--------------|------------|
| <img src="https://img.icons8.com/color/48/000000/php.png" width="48"> **PHP** | `^8.3 or Latest` |
| <img src="https://upload.wikimedia.org/wikipedia/commons/2/26/Logo-composer-transparent.png" width="48"> **Composer** | `Latest or 2.5.5` |
| <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Laravel.svg" width="48"> **Laravel** | `^10` |



> [!NOTE] 
> 
> Ensure you have the latest versions of PHP(8.3) or above, Composer, and Laravel installed on your system to avoid compatibility issues.




## ➤  Installation Process
This beginner-friendly guide provides simple step-by-step instructions to help you successfully install the software on your own - no technical expertise required, just follow each step carefully to complete your setup


### 📍 Step 1: Requirement Check
####  Checking Installed Versions

#### 1. PHP
- Essential foundation
  - Laravel is built on PHP, making this the core requirement for the backend.
  - Version 8.1+ brings performance improvements and security patches.
  - Missing PHP will prevent any Laravel operations from executing. 

    ```sh
    php -v
    ```
  - ✔️ Expected output: `PHP 7.4.x or later`

➡️ [Download PHP](https://www.php.net/downloads)
> [!IMPORTANT]
> 
> Laravel 10 requires PHP 8.1 or higher. Older versions won't work.



#### 2. Composer
- The project's backbone
  - Manages all PHP packages and their relationships.
  - Handles autoloading of classes and dependencies.
  - Critical for installing Laravel itself and future packages.
    ```sh
    composer -V
    ```

  - ✔️ Expected output: `Latest Composer version`

➡️ [Download Composer](https://getcomposer.org/)



#### 3. Node.js & NPM
- Frontend power tools
  - Node.js executes JavaScript outside browsers (needed for build tools).
  - NPM manages JavaScript packages like Vite, Vue, or React.
  - Required for processing modern CSS/JS and hot-reloading during development.
    ```sh
    node -v
    npm -v
    ```
  - ✔️ Expected output: `Node.js 14.x.x` or later & `NPM 7.x.x` or later`

➡️ [Download Node.js](https://nodejs.org/)

> [!WARNING]
>
> Using outdated Node.js versions may cause compatibility issues with modern frontend tools.



---




### 📍 Step 2: Setting Up Laravel Project

#### 1. Create Project
- Laravel's blueprint setup
  - `laravel new project-name` (replace `project-name` with your desired project name)
  - This command will create a new Laravel project in the specified directory.

    ```sh
    composer create-project --prefer-dist laravel/laravel frontend-project
    ```
> [!NOTE]
> 
> `--prefer-dist` uses stable packaged version (faster than source).


#### 2. Project Navigation
- Working directory setup
  - Move into the project directory
  - `cd frontend-project`
  - This will change your current directory to the newly created project.
    ```sh
    cd frontend-project
    ```
> [!TIP]
> 
>  Use ls (Linux/Mac) or dir (Windows) to verify you're in the correct directory.



---




### 📍 Step 3: Install Dependencies

####  Install Laravel Frontend Dependencies
- Modern asset processing
  - Installs JavaScript/CSS packages listed in package.json (e.g., Vite, Vue, React).
  - Creates node_modules folder.
    ```sh
    npm install
    ```




---





### 📍 Step 4: Set up Environment Variables
- Environment variables setup
  - Copy the .env.example file file and rename it to .env. Then configure database and other necessary credentials.
    ```sh
      cp .env.example .env
    ```




---




### 📍 Step 5: Generate Application Key
- Laravel's security setup
  - **Purpose**: Creates a unique encryption key in .env file.
  - **Why?** Secures sessions, cookies, and encrypted data. Laravel won't run without it.
    ```sh
    php artisan key:generate
    ```
> [!NOTE]
>
> This ensures your Laravel application has a unique encryption key.



---



### 📍 Step 6: Run Development Server

####  Start Laravel Development Server
- **Purpose**: Starts the development server.
- **Why?** Allows you to access your application at `http://localhost:8000`.
    ```sh
    php artisan serve
    ```
    - ✔️ Expected output: Laravel development server started: `http://127.0.0.1:8000`




---




### 📍 Step 7: Compile Frontend Assets

#### Run Node for Asset Bundling
- **Purpose**: Compiles frontend assets (e.g., JavaScript, CSS).
- What it does:
    - Compiles SCSS/SASS to CSS.
    - Bundles JavaScript files (e.g., using Vite or Webpack).
    - Watches for file changes (hot-reload during development).
      ```sh
      npm run dev
      ```
    - ✔️ Expected output: Node server running at `http://localhost:5173`

✅ Your Laravel frontend is now set up and running! 🚀








<!-- ## ➤ What Does It Do?
The **Frontend Architecture Service** provides a production-ready foundation for building modern, high-performance web applications. It delivers:

- **Blazing-Fast User Experiences**: Ultra-responsive interfaces powered by Vite's lightning-fast builds and optimized asset delivery.
- **Modular & Scalable Architecture**: Component-based structure (Vue.js/Alpine.js) with reusable UI patterns and predictable state management.
- **Seamless Backend Integration**: Tight coupling with Laravel via Inertia.js or API-driven workflows for smooth data flow.
- **Enterprise-Grade Security**: Built-in protections against XSS, CSRF, and data leaks with CSP headers and secure coding practices.
- **Future-Proof Maintainability**: Clean code organization, thorough documentation, and testing frameworks to simplify long-term evolution.

 




## ➤ How it works?

- **Component Rendering**: The frontend framework (Vue.js/Alpine.js) renders UI components that fetch live data from the Laravel Backend via API calls or Inertia.js.
- **Build Optimization**: Vite processes all frontend assets, validating code integrity and optimizing them through tree-shaking and code splitting before production deployment.
- **Performance Delivery**: The optimized bundles are distributed via CDN for fastest possible loading times to end users worldwide.
- **Activity Monitoring**: All rendering performance metrics, user interactions, and errors are logged to Sentry for real-time monitoring and debugging.
- **Security Enforcement**: Every data request automatically includes CSRF tokens and sanitizes inputs to protect against XSS Attacks before reaching backend services. -->





## ➤ Want to Contribute?
Contributions are always appreciated! Please refer to the [README](/EmpMonitor-OpenSource-main/README.md) for detailed instructions on [how to contribute](/EmpMonitor-OpenSource-main/Contributions.md).
