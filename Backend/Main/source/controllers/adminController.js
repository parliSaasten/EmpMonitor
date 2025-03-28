const authService = require('../services/authService');
const employeeService = require('../services/employeeService');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const moment = require('moment-timezone');

const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || 'password123';

async function adminLogin(req, res) {
  try {
    const { email, password } = req.body;
    if (email === DEFAULT_ADMIN_EMAIL && password === DEFAULT_ADMIN_PASSWORD) {
      const token = authService.generateToken({ id: 1, role: 'admin' });
      res.json({ token });
    } else {
      const employee = await employeeService.getEmployeeByEmail(email);
      if (employee && (await authService.decryptPassword(password, employee.password)) && employee.role === 'admin') {
        const token = authService.generateToken({ id: employee.id, role: employee.role });
        delete employee.password;
        res.json({ token, ...employee });
      } else {
        res.status(401).send('Invalid credentials');
      }
    }
  } catch (error) {
    console.error('Error in adminLogin:', error);
    res.status(500).send('Internal server error');
  }
}
async function adminRegister(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized. No user information.' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admin role required' });
    }

    const { firstName, lastName, email, password, mobileNumber, employeeCode, timeZone } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!firstName || !lastName || !email || !password) return res.status(400).json({ error: 'Validation Error' });

    const hashedPassword = await authService.encryptPassword(password);

    const employeeId = await employeeService.registerEmployee({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      mobileNumber,
      employeeCode,
      timeZone,
      role: 'employee',
    });
    res.status(201).json({
      id: employeeId,
      firstName,
      lastName,
      email,
      mobileNumber,
      employeeCode,
      timeZone,
      role: 'employee'
    });
  } catch (error) {
    console.error('Error in adminRegister:', error);
    res.status(500).send('Internal server error');
  }
}
async function getAllEmployees(req, res) {
  try {
    let { skip = 0, limit = 10 } = req.query;
    const employees = await employeeService.getAllEmployees(skip, limit);
    const count = await employeeService.countEmployees();
    res.json({ employees, totalCount: count });
  } catch (err) {
    console.error('Error in getAllEmployees:', err);
    res.status(500).send(err.message);
  }
}

async function deleteEmployee(req, res) {
  try {
    const { id } = req.params;
    await employeeService.deleteEmployee(id);
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


async function getEmployeeById(req, res) {
  try {
    const { id } = req.params;
    let resp = await employeeService.getEmployeeById(id);
    let password = await authService.decryptPassword(null, resp.password);
    resp.password = password;
    res.status(200).json({ message: 'Success', data: resp });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getAttendance(req, res) {
  try {
    const attendanceRecords = await employeeService.getAllAttendance();
    res.json(attendanceRecords);
  } catch (error) {
    console.error('Error in getAttendance:', error);
    res.status(500).send('Internal server error');
  }
}

async function getWebAppActivity(req, res) {
  try {
    const { employeeId, startDate, endDate } = req.query;
    startDate = moment(startDate).format('YYYY-MM-DD');
    if(moment(startDate).isSame(endDate)) endDate = moment(endDate).endOf('day').format('YYYY-MM-DD');
    if (!employeeId) {
      return res.status(400).json({ message: 'employeeId and startDate are required.' });
    }

    const activityRecords = await employeeService.getWebAppActivityFiltered(
      parseInt(employeeId),
      startDate,
      endDate
    );
    res.json(activityRecords);
  } catch (error) {
    console.error('Error in getWebAppActivity:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  adminRegister,
  adminLogin,
  getAllEmployees,
  deleteEmployee,
  getAttendance,
  getWebAppActivity,
  getEmployeeById
};