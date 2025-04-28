const authService = require('../services/authService');
const employeeService = require('../services/employeeService');
const moment = require('moment-timezone');
const jwt = require('jsonwebtoken');

async function employeeLogin(req, res) {
  try {
    const { email, password } = req.body;
    const employee = await employeeService.getEmployeeByEmail(email);
    if (employee && (await authService.decryptPassword(password, employee.password))) {
      const token = authService.generateToken({ id: employee.id, role: employee.role });
      delete employee.password;
      res.json({ token, ...employee });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

async function updateEmployee(req, res) {
  try {
      const { firstName, lastName, role, mobileNumber, employeeCode, timeZone } = req.body;

      if (!firstName || !lastName || !role) {
          return res.status(400).json({ error: 'Missing required fields' });
      }

      await employeeService.updateEmployee(req.user.id, {
          firstName,
          lastName,
          role,
          mobileNumber,
          employeeCode,
          timeZone,
      });
      res.status(200).json({ message: 'Employee updated' });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
}

async function getEmployee(req, res) {
  try {
      const employee = await employeeService.getEmployeeById(req.user.id);
      if (!employee) {
          return res.status(404).json({ error: 'Employee not found' });
      }
      res.json(employee);
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
}

async function getWebAppActivity(req, res) {
  try {
    let employeeId = +req.user.id;
    let { startDate, endDate, type = 1 } = req.query;
    startDate = moment(startDate).format('YYYY-MM-DD');
    if(moment(startDate).isSame(endDate)) endDate = moment(endDate).endOf('day').format('YYYY-MM-DD');
    if (!employeeId) {
      return res.status(400).json({ message: 'employeeId and startDate are required.' });
    }

    const activityRecords = await employeeService.getWebAppActivityFiltered(
      employeeId,
      startDate,
      endDate,
      +type
    );
    return res.json({code: 200, data: activityRecords, error: null, message: 'Success'});
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
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization header missing or malformed' });
    }
    const token = authHeader.split(' ')[1];
    const { id } = await jwt.decode(token);
    let { start_date, end_date, skip = 0, limit = 10 } = req.body; 
    start_date = moment(start_date).format("YYYY-MM-DD");
    end_date = moment(end_date).format("YYYY-MM-DD");

    const [attendanceRecords, attendanceRecordCount] = await Promise.all([
      employeeService.getAllAttendanceById(id, start_date, end_date, +skip, +limit),
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
    console.log('rrt', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}


module.exports = {
  employeeLogin,
  updateEmployee,
  getEmployee,
  getWebAppActivity,
  getEmployeeById,
  getAttendance
};