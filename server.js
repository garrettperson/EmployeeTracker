const mysql = require('mysql2');
const inquirer = require('inquirer')

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'emptrack_db'
  },
  console.log(`Connected to the emptrack_db database.`)
);

db.connect(function(err) {
    if (err) throw err;
    start();
})

start = ()  => {
    inquirer.prompt({
        name: 'options',
        type: 'list',
        message: 'Please select from the following options',
        choices: [
            'view all departments', 
            'view all roles', 
            'view all employees', 
            'add a department', 
            'add a role', 
            'add an employee', 
            'update an employee role',
            'exit'
        ]
    })
    .then((answer) => {
        try {
            if (answer.options === 'view all departments') {
                viewDepartments();
            } else if (answer.options === 'view all roles') {
                viewRoles();
            } else if (answer.options === 'view all employees') {
                viewEmployees();
            } else if (answer.options === 'add a department') {
                addDepartment();
            } else if (answer.options === 'add a role') {
                addRole();
            } else if (answer.options === 'add an employee') {
                addEmployee();
            } else if (answer.options === 'update an employee role') {
                updateRole();
            } else if (answer.options === 'exit') {
                db.end();
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    })
}

viewDepartments = async () => {
    try {
      const query = 'SELECT * FROM department';
      const [res] = await db.promise().query(query);
  
      console.log('DEPARTMENTS:');
      res.forEach(department => {
        console.log(`ID: ${department.id} | Name: ${department.name}`);
      });
  
      start();
    } catch (error) {
      console.error('Error viewing departments:', error);
    }
  };

viewRoles = async () => {
    try {
      const query = 'SELECT * FROM role';
      const [res] = await db.promise().query(query);
  
      console.log('ROLES:');
      res.forEach(role => {
        console.log(`ID: ${role.id} | Title: ${role.title} | Salary: ${role.salary} | Department ID: ${role.department_id}`);
      });
  
      start();
    } catch (error) {
      console.error('Error viewing roles:', error);
    }
  };

viewEmployees = async () => {
    try {
      const query = 'SELECT * FROM employee';
      const [res] = await db.promise().query(query);
  
      console.log('EMPLOYEES:');
      res.forEach(employee => {
        console.log(`ID: ${employee.id} | Name: ${employee.first_name} ${employee.last_name} | Role ID: ${employee.role_id} | Manager ID: ${employee.manager_id}`);
      });
  
      start();
    } catch (error) {
      console.error('Error viewing employees:', error);
    }
  };

addDepartment = async () => {
    try {
      const answer = await inquirer.prompt({
        name: 'department',
        message: 'What is the new department?',
        type: 'input'
      });
  
      const query = 'INSERT INTO department (name) VALUES (?)';
      await db.promise().query(query, [answer.department]);
  
      console.log(`Added department: ${answer.department}`);
      viewDepartments();
    } catch (error) {
      console.error('Error adding department:', error);
    }
  };

addRole = async () => {
    try {
        const answer = await inquirer.prompt([
            {
                name: 'role',
                message: 'What is the new role?',
                type: 'input',
            },
            {
                name: 'salary',
                message: 'What is the salary for the role?',
                type: 'input',
            }
        ]);

        const params = [answer.role, answer.salary];

        const [data] = await db.promise().query('SELECT name, id FROM department');
        const deptChoices = data.map(({ name, id }) => ({ name, value: id }));

        const deptChoice = await inquirer.prompt({
            name: 'dept',
            message: 'Which department is the role in?',
            type: 'list',
            choices: deptChoices
        });

        const dept = deptChoice.dept;
        params.push(dept);

        const sql = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
        await db.promise().query(sql, params);

        console.log(`${answer.role} added to roles`);
        viewRoles();
    } catch (error) {
        console.error('Error adding role:', error);
    }
};

addEmployee = async () => {
    try {
      const answer = await inquirer.prompt([
        {
          name: 'firstName',
          message: "What is the employee's first name?",
          type: 'input',
        },
        {
          name: 'lastName',
          message: "What is the employee's last name?",
          type: 'input',
        }
      ]);
  
      const params = [answer.firstName, answer.lastName];
  
      const [roleData] = await db.promise().query('SELECT role.id, role.title FROM role');
      const roles = roleData.map(({ id, title }) => ({ name: title, value: id }));
  
      const roleChoice = await inquirer.prompt({
        name: 'role',
        message: "What is the employee's role?",
        type: 'list',
        choices: roles,
      });
  
      const role = roleChoice.role;
      params.push(role);
  
      const [managerData] = await db.promise().query('SELECT * FROM employee');
      const managers = managerData.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
  
      const managerSelection = await inquirer.prompt({
        name: 'manager',
        message: "Who is the manager for the employee?",
        type: 'list',
        choices: managers,
      });
  
      const manager = managerSelection.manager;
      params.push(manager);
  
      const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
      await db.promise().query(sql, params);
  
      console.log('Employee has been added!');
      viewEmployees();
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

updateRole = async () => {
    try {
      const [employeeData] = await db.promise().query('SELECT * FROM employee');
      const employees = employeeData.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
      }));
  
      const { employee: selectedEmployee } = await inquirer.prompt({
        name: 'employee',
        message: 'Select the employee whose role you would like to update',
        type: 'list',
        choices: employees
      });
  
      const params = [selectedEmployee];
  
      const [roleData] = await db.promise().query('SELECT * FROM role');
      const roles = roleData.map(({ id, title }) => ({ name: title, value: id }));
  
      const { role: selectedRole } = await inquirer.prompt({
        name: 'role',
        message: "What is the employee's new role?",
        type: 'list',
        choices: roles
      });
  
      params.push(selectedRole);
  
      const sql = 'UPDATE employee SET role_id = ? WHERE id = ?';
      await db.promise().query(sql, params);
  
      console.log('Employee role updated');
      viewEmployees();
    } catch (error) {
      console.error('Error updating employee role:', error);
    }
};

