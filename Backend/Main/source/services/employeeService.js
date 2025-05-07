const mySqlSingleton = require('../config/db');
const WebAppActivityModel = require('../model/web_app_activity.model');

async function registerEmployee(employee) {
  try {
    const pool = await mySqlSingleton.getPool();
    const { firstName, lastName, email, password, mobileNumber, employeeCode, timeZone, role, departmentId } = employee;
    const [result] = await pool.query('INSERT INTO employees (first_name, last_name, email, password, mobile_number, employee_code, time_zone, role, department_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [firstName, lastName, email, password, mobileNumber, employeeCode, timeZone, role, departmentId]);
    return result.insertId;
  } catch (error) {
    console.error('Error registering employee:', error);
    throw error;
  }
}
async function getEmployeeById(id) {
  try {
    const pool = await mySqlSingleton.getPool();
    const [rows] = await pool.query(
      `SELECT employees.*, departments.name AS department_name
       FROM employees
       INNER JOIN departments ON employees.department_id = departments.id
       WHERE employees.id = ?`,
      [id]
    );
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
    const { firstName, lastName, role, mobileNumber, employeeCode, timeZone, email, password } = employee;
    await pool.query(
      'UPDATE employees SET first_name = ?, last_name = ?, role = ?, mobile_number = ?, employee_code = ?, time_zone = ?, email = ?, password = ? WHERE id = ?',
      [firstName, lastName, role, mobileNumber, employeeCode, timeZone, email, password, id]
    );
  } catch (error) {
    console.error(`Error updating employee with id ${id}:`, error);
    throw error;
  }
}

async function getAllEmployees(skip, limit, name, count = 0) {
  try {
    const pool = await mySqlSingleton.getPool();
    let query = '';
    const params = ['employee'];

    if (count) {
      query = `
        SELECT COUNT(*) AS total 
        FROM employees 
        INNER JOIN departments ON employees.department_id = departments.id 
        WHERE employees.role = ?
      `;
    } else {
      query = `
        SELECT employees.*, departments.name AS department_name 
        FROM employees 
        INNER JOIN departments ON employees.department_id = departments.id 
        WHERE employees.role = ?
      `;
    }

    if (name) {
      query += ` AND (employees.first_name LIKE ? OR employees.last_name LIKE ? OR employees.email LIKE ?)`;
      params.push(`%${name}%`, `%${name}%`, `%${name}%`);
    }

    if (!count) {
      query += ` LIMIT ? OFFSET ?`;
      params.push(limit, skip);
    }

    const [rows] = await pool.query(query, params);
    if (count) return rows[0]?.total || 0;
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
    await pool.query('DELETE FROM employee_attendance WHERE employee_id = ?', [id]);
    await pool.query('DELETE FROM employees WHERE id = ?', [id]);
  } catch (error) {
    console.error(`Error deleting employee with id ${id}:`, error);
    throw error;
  }
}

async function getAllAttendance(start_date, end_date, skip, limit, employee_id, name, count) {
  try {
    const pool = await mySqlSingleton.getPool();

    let query = '';
    if(count){
      query = 'SELECT COUNT(*) AS total FROM employee_attendance ea JOIN employees e ON e.id = ea.employee_id WHERE date BETWEEN ? AND ?';
    }else{
      query = 'SELECT * FROM employee_attendance ea JOIN employees e ON e.id = ea.employee_id WHERE date BETWEEN ? AND ?';
    }
    const params = [start_date, end_date];

    if (employee_id) {
      query += ' AND employee_id = ?';
      params.push(employee_id);
    }

    if (name) {
      query += ' AND (e.first_name LIKE ? OR e.last_name LIKE ? OR e.email LIKE ?)';
      params.push(`%${name}%`,  `%${name}%`, `%${name}%`);
    }

    if(!count){
      query += ' LIMIT ?, ?';
      params.push(skip, limit);
    }

    const [rows] = await pool.query(query, params);
    if(count) return rows[0]?.total || 0;
    return rows;
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    throw error;
  }
}

async function getAttendanceCount(start_date, end_date, employee_id) {
  try {
    const pool = await mySqlSingleton.getPool();

    let query = 'SELECT COUNT(*) AS total FROM employee_attendance ea JOIN employees e ON e.id = ea.employee_id WHERE date BETWEEN ? AND ?';
    const params = [start_date, end_date];

    if (employee_id) {
      query += ' AND employee_id = ?';
      params.push(employee_id);
    }

    const [rows] = await pool.query(query, params);
    return rows[0].total;
  } catch (error) {
    console.error('Error fetching attendance count:', error);
    throw error;
  }
}


async function getAllAttendanceById(id, start_date, end_date, skip, limit) {
  try {
    const pool = await mySqlSingleton.getPool();
    const [rows] = await pool.query(
      'SELECT * FROM employee_attendance WHERE employee_id = ? AND date BETWEEN ? AND ? LIMIT ?, ?',
      [id, start_date, end_date, skip, limit]
    );
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
async function getDepartments() {
  try {
    const pool = await mySqlSingleton.getPool();
    const [rows] = await pool.query('SELECT * FROM departments');
    return rows;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
}

async function addDepartment(departmentName) {
  try {
    const pool = await mySqlSingleton.getPool();
    const [result] = await pool.query('INSERT INTO departments (name) VALUES (?)', [departmentName]);
    return result.insertId;
  } catch (error) {
    console.error('Error adding department:', error);
    throw error;
  }
}

async function updateDepartment(id, departmentName) {
  try {
    const pool = await mySqlSingleton.getPool();
    await pool.query('UPDATE departments SET name = ? WHERE id = ?', [departmentName, id]);
  } catch (error) {
    console.error(`Error updating department with id ${id}:`, error);
    throw error;
  }
}

async function deleteDepartment(id) {
  try {
    const pool = await mySqlSingleton.getPool();
    await pool.query('DELETE FROM departments WHERE id = ?', [id]);
  } catch (error) {
    console.error(`Error deleting department with id ${id}:`, error);
    throw error;
  }
}

async function getDepartmentByName(name) {
  try {
    const pool = await mySqlSingleton.getPool();
    const [rows] = await pool.query('SELECT * FROM departments WHERE name = ?', [name]);
    return rows[0];
  } catch (error) {
    console.error(`Error getting department by name ${name}:`, error);
    throw error;
  }
}

async function isDepartmentUsed(departmentId) {
  try {
    const pool = await mySqlSingleton.getPool();
    const [rows] = await pool.query('SELECT COUNT(*) AS count FROM employees WHERE department_id = ?', [departmentId]);
    return rows[0].count > 0;
  } catch (error) {
    console.error(`Error checking if department with id ${departmentId} is used:`, error);
    throw error;
  }
}

async function getDepartmentById(id) {
  try {
    const pool = await mySqlSingleton.getPool();
    const [rows] = await pool.query('SELECT * FROM departments WHERE id = ?', [id]);
    return rows[0];
  } catch (error) {
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
  countEmployees,
  getAllAttendanceById,
  getAttendanceCount,
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentByName,
  isDepartmentUsed,
  getDepartmentById,
};