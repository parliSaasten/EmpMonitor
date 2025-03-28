'use strict';

const router = require('express').Router();
const employeeController = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');

class EmployeeRoutes {

    constructor() {
        this.myRoutes = router;
        this.core();
    }

    core() {
        this.myRoutes.post('/login', employeeController.employeeLogin);
        this.myRoutes.use(authMiddleware.authenticateToken);
        this.myRoutes.use(authMiddleware.authorizeRole(['employee']));
        this.myRoutes.put('/', authMiddleware.authenticateToken, employeeController.updateEmployee);
        this.myRoutes.get('/', authMiddleware.authenticateToken, employeeController.getEmployee);
    }

    getRouters() {
        return this.myRoutes;
    }
}

module.exports = EmployeeRoutes;