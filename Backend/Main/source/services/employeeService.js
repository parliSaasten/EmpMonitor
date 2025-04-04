const mySqlSingleton = require('../config/db');
const WebAppActivityModel = require('../model/web_app_activity.model');

async function registerEmployee(employee) {
  try {
    const pool = await mySqlSingleton.getPool();
    const { firstName, lastName, email, password, mobileNumber, employeeCode, timeZone, role } = employee;
    const [result] = await pool.query('INSERT INTO employees (first_name, last_name, email, password, mobile_number, employee_code, time_zone, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [firstName, lastName, email, password, mobileNumber, employeeCode, timeZone, role]);
    return result.insertId;
  } catch (error) {
    console.error('Error registering employee:', error);
    throw error;
  }
}
async function getEmployeeById(id) {
  try {
    const pool = await mySqlSingleton.getPool();
    const [rows] = await pool.query('SELECT * FROM employees WHERE id = ?', [id]);
    return rows[0];
  } catch (error) {
    console.error(`Error getting employee by id ${id}:`, error);
    throw error;
  }
}

async function getEmployeeByEmail(email) {
  try {
    const pool = await mySqlSingleton.getPool();
    const [rows] = await pool.query('SELECT * FROM employees WHERE email = ?', [email]);
    return rows[0];
  } catch (error) {
    if (error.code === 'AUTH_SWITCH_PLUGIN_ERROR') {
      console.error(
        'Database Authentication Error: Please change your MySQL user authentication plugin to mysql_native_password.'
      );
      throw new Error(
        'Database Authentication Error: Incorrect Authentication Plugin. Please check server logs.'
      );
    }
    console.error(`Error getting employee by email ${email}:`, error);
    throw error;
  }
}

async function updateEmployee(id, employee) {
  try {
    const pool = await mySqlSingleton.getPool();
    const { firstName, lastName, role, mobileNumber, employeeCode, timeZone } = employee;
    await pool.query(
      'UPDATE employees SET first_name = ?, last_name = ?, role = ?, mobile_number = ?, employee_code = ?, time_zone = ? WHERE id = ?',
      [firstName, lastName, role, mobileNumber, employeeCode, timeZone, id]
    );
  } catch (error) {
    console.error(`Error updating employee with id ${id}:`, error);
    throw error;
  }
}

async function getAllEmployees(skip, limit) {
  try {
    const pool = await mySqlSingleton.getPool();
    const [rows] = await pool.query(
      'SELECT * FROM employees WHERE role = ? LIMIT ? OFFSET ?',
      ['employee', parseInt(limit, 10), parseInt(skip, 10)] // Ensure numeric values
    );
    return rows;
  } catch (error) {
    console.error('Error getting all employees:', error);
    throw error;
  }
}


async function countEmployees() {
  try {
    const pool = await mySqlSingleton.getPool();
    
    // Use COUNT(*) to get the total number of employees
    const [rows] = await pool.query('SELECT COUNT(*) as total FROM employees');
    
    return rows[0].total;
  } catch (error) {
    console.error('Error counting employees:', error);
    throw error;
  }
}

async function deleteEmployee(id) {
  try {
    const pool = await mySqlSingleton.getPool();
    await pool.query('DELETE FROM employees WHERE id = ?', [id]);
  } catch (error) {
    console.error(`Error deleting employee with id ${id}:`, error);
    throw error;
  }
}
async function getAllAttendance() {
  try {
    const pool = await mySqlSingleton.getPool();
    const [rows] = await pool.query('SELECT * FROM employee_attendance');
    return rows;
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    throw error;
  }
}

async function getWebAppActivityFiltered(employeeId, startDate, endDate, type) {
  try {
    const query = {
      employee_id: employeeId,
    };
    if (startDate) {
      query.yyyymmdd = { $gte: startDate.split('-').join('') };
    }

    if (endDate) {
      query.end_time = { $lte: endDate.split('-').join('') };
    }

    if(type === 1) {
      query.url = { $ne: null, $eq: "" };
    }
    
    if(type === 2) {
      query.url = { $ne: null, $ne: "" };
    }

    const webAppActivities = await WebAppActivityModel.find(query);
    return webAppActivities;
  } catch (error) {
    console.error('Error fetching filtered web app activity records from MongoDB:', error);
    throw error;
  }
}



module.exports = {
  registerEmployee,
  getEmployeeById,
  updateEmployee,
  getEmployeeByEmail,
  getAllEmployees,
  deleteEmployee,
  getAllAttendance,
  getWebAppActivityFiltered,
  countEmployees
};