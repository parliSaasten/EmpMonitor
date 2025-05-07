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
    return res.status(500).json({ message: 'Internal server error', error: error.message });
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

    const { firstName, lastName, email, password, mobileNumber, employeeCode, timeZone, departmentId } = req.body;
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
      departmentId
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
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}


async function getAllEmployees(req, res) {
  try {
    let { skip = 0, limit = 10, name } = req.query;

    const [employees, count] = await Promise.all([
      employeeService.getAllEmployees(+skip, +limit, name),
      employeeService.getAllEmployees(+skip, +limit, name, 1)
    ]);
 
    return res.status(200).json({ employees, totalCount: count });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
}

async function deleteEmployee(req, res) {
  try {
    const { id } = req.params;
    await employeeService.deleteEmployee(id);
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}


async function deleteEmployees(req, res) {
  try {
    const { user_ids } = req.body;
    await Promise.all(user_ids.map(id => employeeService.deleteEmployee(id)));
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
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
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

async function getAttendance(req, res) {
  try {
    let { start_date, end_date, skip = 0, limit = 10, employee_id, name } = req.body;
    start_date = moment(start_date).format("YYYY-MM-DD");
    end_date = moment(end_date).format("YYYY-MM-DD");

    // Run both queries in parallel
    const [attendanceRecords, attendanceRecordCount] = await Promise.all([
      employeeService.getAllAttendance(start_date, end_date, +skip, +limit, employee_id, name, 0),
      employeeService.getAllAttendance(start_date, end_date, null, null, employee_id, name, 1)
    ]);

    return res.json({
      code: 200,
      data: {
        totalCount: attendanceRecordCount,
        data: attendanceRecords
      },
      message: "Success"
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}


async function getAttendanceById(req, res) {
  try {
    const { id } = req.params;
    let { start_date, end_date, skip = 0, limit = 10 } = req.body;
    
    start_date = moment(start_date).format("YYYY-MM-DD");
    end_date = moment(end_date).format("YYYY-MM-DD");

    // Run both queries in parallel
    const [attendanceRecords, attendanceRecordCount] = await Promise.all([
      employeeService.getAllAttendanceById(id, start_date, end_date, skip, limit),
      employeeService.getAttendanceCount(start_date, end_date, id)
    ]);

    return res.json({
      code: 200,
      data: {
        totalCount: attendanceRecordCount,
        data: attendanceRecords
      },
      message: "Success"
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

async function getWebAppActivity(req, res) {
  try {
    let { employeeId, startDate, endDate, type = 1 } = req.query;
    startDate = moment(startDate).format('YYYY-MM-DD');
    if(moment(startDate).isSame(endDate)) endDate = moment(endDate).endOf('day').format('YYYY-MM-DD');
    if (!employeeId) {
      return res.status(400).json({ message: 'employeeId and startDate are required.' });
    }

    const activityRecords = await employeeService.getWebAppActivityFiltered(
      parseInt(employeeId),
      startDate,
      endDate,
      +type
    );
    return res.json({code: 200, data: activityRecords, error: null, message: 'Success'});
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

  async function updateEmployee(req, res) { 
    try {
       const {id, role} = await authService.getLoginUserData(req);
       if(role !== 'admin') return res.status(400).json({ message: 'Admin can update employee', error: null });

       const {employeeId, firstName, lastName, employeeRole, mobileNumber, employeeCode, timeZone, password, email} = req.body;
       if(!(employeeId && firstName && lastName && employeeRole && email && password && mobileNumber && employeeCode && timeZone && email)) return res.json({code: 400, data: null, error: null, message: 'Invalid inputs'});

       const hashedPassword = await authService.encryptPassword(password);
       const employeeData = {
        firstName,
        lastName,
        role: employeeRole,
        email,
        password: hashedPassword,
        mobileNumber,
        employeeCode,
        timeZone,
       };

       await employeeService.updateEmployee(employeeId, employeeData);
      employeeData.employeeId = employeeId;
      return res.json({code: 200, data: employeeData, error: null, message: 'Success'});
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}


async function getDepartments(req, res) {
  try {
    const departments = await employeeService.getDepartments();
    return res.json({ code: 200, data: departments, error: null, message: 'Success' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

async function addDepartment(req, res) {
  try {
    const { departmentName } = req.body;
    if (!departmentName) return res.status(400).json({ code: 400, data: null, error: null, message: 'Invalid inputs' });
    // check if department already exists
    const existingDepartment = await employeeService.getDepartmentByName(departmentName);
    if (existingDepartment) return res.status(400).json({ code: 400, data: null, error: null, message: 'Department already exists' });
    const departmentId = await employeeService.addDepartment(departmentName);
    return res.json({ code: 200, data: { id: departmentId, departmentName }, error: null, message: 'Success' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

async function updateDepartment(req, res) {
  try {
    const { id, departmentName } = req.body;
    if (!id || !departmentName) return res.status(400).json({ code: 400, data: null, error: null, message: 'Invalid inputs' });
    const department = await employeeService.getDepartmentById(id);
    if (!department)
      return res.status(404).json({ code: 404, data: null, error: null, message: `Department with id ${id} not found` });

    await employeeService.updateDepartment(id, departmentName);
    return res.json({ code: 200, data: { id, departmentName }, error: null, message: 'Success' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

async function deleteDepartment(req, res) {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ code: 400, data: null, error: null, message: 'Invalid inputs' });
    const department = await employeeService.getDepartmentById(id);
    if (!department) return res.status(404).json({ code: 404, data: null, error: null, message: `Department with id ${id} not found` });
    const isDepartmentUsed = await employeeService.isDepartmentUsed(id);
    if (isDepartmentUsed) return res.status(400).json({ code: 400, data: null, error: null, message: 'Department is being used by an employee' });
    await employeeService.deleteDepartment(id);
    return res.json({ code: 200, data: null, error: null, message: 'Success' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

module.exports = {
  adminRegister,
  adminLogin,
  getAllEmployees,
  deleteEmployee,
  getAttendance,
  getWebAppActivity,
  getEmployeeById,
  getAttendanceById,
  deleteEmployees,
  updateEmployee,
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment
};