const inquirer = require('inquirer');
//import and require mysql2
const mysql = require('mysql2');
const consoleTable = require ('console.table');
const Connection = require('mysql/lib/Connection');
const promisesql = require('promise-mysql');




//connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        port: 3306,
        //mysql username
        user: 'root',
        //add mysql password
        password: '@Ciaraculverhouse365',
        database: 'employee_db',
    });

db.connect(function(err) {
    if(err)throw err;
    startPrompt();
});

function startPrompt() {
    inquirer.prompt ([
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
    .then(function({prompt}) {
        switch (prompt) {
            case "View All Departments":
                viewAllDepartments();
                break;
            case "View All Employees":
                viewAllEmployees();
                break;
            case "View All Roles":
                viewAllRoles();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Add a Role":
                addRole();
                break;
            case "Add an Employee":
                addEmployee();
                break;
            case "Update Employee":
                updateEmployee();
                break;
            case "End":
                Connection.end();
                break;
            
        }
    });

}
function viewAllDepartments() {
    console.log("VIEWING DEPARTMENTS");
    let departments = `SELECT * FROM department`
    db.query(departments, (err, results) => {
        if (err) throw err;

        console.log(`DEPARTMENTS VIEWED\n`);
        console.table(results);
        startPrompt();
    });
} 
// View All Employees
function viewAllEmployees() {
    console.log("Viewing All Employees");
    let employees =
    `SELECT e.id, e.first_name, e.lasy_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    LEFT JOIN role r
        ON e.role_id = r.id
    LEFT JOIN employee m
        ON m.id = e.manager_id`

    db.query(employees, (err, results) => {
        if(err) throw err;

        console.log(`EMPLOYEES VIEWED\n`);
        console.table(results);
        startPrompt();
    });
}

// View All Roles

 