'use strict';

const router = require('express').Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

class AdminRoutes {

    constructor() {
        this.myRoutes = router;
        this.core();
    }

    core() {
        this.myRoutes.post('/login', adminController.adminLogin);
        this.myRoutes.use(authMiddleware.authenticateToken);
        this.myRoutes.use(authMiddleware.authorizeRole(['admin']));
        this.myRoutes.post('/register', adminController.adminRegister);
        this.myRoutes.get('/employees', adminController.getAllEmployees);
        this.myRoutes.get('/employees/:id', adminController.getEmployeeById);
        this.myRoutes.delete('/employees/:id', adminController.deleteEmployee);
        this.myRoutes.get('/attendance', adminController.getAttendance);
        this.myRoutes.get('/web-app-activity', adminController.getWebAppActivity);
    }

    getRouters() {
        return this.myRoutes;
    }
}

module.exports = AdminRoutes;
