const authService = require('../services/authService');
const employeeService = require('../services/employeeService');

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
    console.error('Error in employeeLogin:', error);
    res.status(500).json({ error: 'Internal server error' });
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
      console.error('Error in updateEmployee', err);
      res.status(500).json({ error: err.message });
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
      console.error('error in getEmployee', err);
      res.status(500).json({ error: err.message });
  }
}

module.exports = {
  employeeLogin,
  updateEmployee,
  getEmployee,
};