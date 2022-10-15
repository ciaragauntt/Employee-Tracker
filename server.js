const inquirer = require('inquirer');
//import and require mysql2
const mysql = require('mysql2');
const consoleTable = require ('console.table');
const promisesql = require('promise-mysql');

//connect to database
const connection = 
    {
        host: 'localhost',
        user: 'root',
        password: 'Sister365',
        database: 'employee_db',
    };

const db = mysql.createConnection(
    connection,
    console.log(`Connected to Database`),
    startPrompt()
);

function startPrompt () {
    inquirer
    .prompt ([
        {
        type: 'list',
        name: 'prompt',
        message: 'Please choose one of the following...',
        choices: [
                'View All Departments', 
                'View All Roles', 
                'View All Employees', 
                'Add A Department', 
                'Add A Role', 
                'Add An Employee', 
                'Update An Employee',
                'End',]
        }
    ])
    .then((userSelection => {
        const {prompt} = userSelection;

        if (prompt === "View All Departments") {
            viewAllDepartments();
        }
        if (prompt === "View All Employees") {
            viewAllEmployees();
        }
        if (prompt === "View All Roles") {
            viewAllRoles();
        }
        if (prompt === "Add A Department") {
            addDepartment();
        }
        if (prompt === "Add A Role") {
            addRole();
        }
        if (prompt === "Add An Employee") {
            addEmployee();
        }
        if (prompt === "Update An Employee") {
            updateEmployee();
        }
        if (prompt === "End") {
            endTracker();
        };

    }));
//view all departments
viewAllDepartments = () => {
    console.log("VIEWING DEPARTMENTS");
    let dep = `SELECT * FROM department`
    db.query(dep, (err, results) => {
        if (err) throw err;

        console.table(results);
        startPrompt();
    });
} 
// View All Employees
function viewAllEmployees (){
    console.log("Viewing All Employees");
    let employee =
    `SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.department_name AS department,roles.salary, 
        CONCAT (manager.first_name, " ", manager.last_name) AS manager
        FROM employee 
        LEFT JOIN roles ON employee.role_id = roles.id
        LEFT JOIN department ON roles.department_id = department.id
        LEFT JOIN employee manager ON employee.manager_id = manager.id`;

    db.query(employee, (err, results) => {
        if(err) throw err;

        console.table(results);
        startPrompt();
    });
}

// View All Roles
function viewAllRoles() {
    let roles = 
    `SELECT roles.id, roles.title, roles.salary, department.department_name FROM roles
    INNER JOIN department ON roles.department_id=department.id`
    db.query(roles, (err, results) => {
        if(err) throw err;

        console.table(results);
        startPrompt();
    });
};

// Add Department
addDepartment = () => {
    inquirer
    .prompt ([
        {
        type: 'input',
        name: 'department_name',
        message: 'What would you like to name this department?',
        validate: function (department_name) {
            if (department_name) {
                return true;
            } else {
                return false;
            }
        }
    }
])
    .then((input) => {
        db.query(
            `insert INTO department (department_name)
            VALUES ('${input.department_name}');`,
                (err, results) => {
                    if (err) throw err;

                    console.log(`${input.department_name} added to db`);
                    startPrompt();
                }
        );
    });
};
}
endTracker = () => {
    console.log('CLOSING EMPLOYEE TRACKER');
    db.end();
}
