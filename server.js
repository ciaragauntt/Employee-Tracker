const inquirer = require('inquirer');
//import and require mysql2
const mysql = require('mysql2');
const table = require ('console.table');
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
                endTracker();
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
function viewAllRoles() {
    console.log("Viewing All Roles");
    let roles = 
    `SELECT roles.id, roles.title, roles.salary, department.department_name FROM roles
    INNER JOIN department ON roles.department_i=department.id`
    db.query(roles, (err, results) => {
        if(err) throw err;

        console.log(`VIEWED ROLES\n`);
        console.table(results);
        startPrompt();
    });
}

// Add Department
function addDepartment () {
    return inquirer.prompt ({
        type: 'input',
        name: 'department_name',
        message: 'What would you like to name this department?',
        validate: function (department_name) {
            if (department_name.length <= 30) {
                return true;
            } else {
                console.log("Must not exceed 30 characters!");
                return false;
            }
        }
    })
    .then((input) => {
        db.query(
            `insert INTO department (department_name)
            VALUES ('${input.department_name}');`,
                (err, results) => {
                    if (err) throw err;

                    console.log(`CREATED DEPARTMENT\n`);
                    console.log(`${input.department_name} added to db`);
                    startPrompt();
                }
        );
    });
};

// Add New Role
function addRole() {
    let depArray = [];

    promisesql.createConnection(db)
        .then((connect) => {
            return connect.query(`SELECT id, department_name FROM department`);
        })
        .then((departments) => {
            for(i=0; i < departments.length; i++) {
            depArray.push(departments[i].department_name);
        }
        return departments;
    })
    .then((departments) => {
        inquirer.prompt([
            {
                name: 'role_name',
                type: 'input',
                message: 'What would you like to name this role?'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary for this role?',
                validate: input => {
                    if(isNaN(input)) {
                        console.log('Must enter salary');
                        return false;
                    } else {
                        return true;
                    }
                }
            },
            {
                name: 'department_role',
                type: 'list',
                message: 'Choose a department for this role?',
                choices: depArray
            }
        ])
        .then((input) => {
            let depId;

            for(i=0; i < departments.length; i++) {
                depId = departments[i].id;
            }

        db.query(`INSERT INTO roles (title, salary, department_id)
        VALUES ("${input.rolename}", ${input.salary}, ${depId})`, (err, res) => {
                if (err) return err;
                console.log(`\n ${input.rolename} has been added to the database! \n`);
                startPrompt();
            });
        });
    });
}

// Add Employee
function addEmployee() {

    let roleArray = [];
    let managerArray = [];

    promisesql.createConnection(db)
        .then((db) => {
            return Promise.all([

                db.query(`SELECT id, title FROM roles ORDER BY title ASC`),
                db.query("SELECT employee.id, concat(employee.first_name, ' ', employee.last_name AS Employee FROM employee ORDER BY Employee ASC" )

            ]);
        }).then(([roles, managers]) => {
            for (i = 0; i < roles.length; i++) {
            roleArray.push(roles[i].title);
        }
        for (i =0; i < managers.length; i++){
            managerArray.push(managers[i].Employee);
        }
        return Promise.all([roles, managers]);
    })
    .then(([roles, managers]) => {
        managerArray.unshift('--');

        inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: "Input first name of employee...",
                validate: function (first_name) {
                    if (first_name.length <= 30) {
                        return true;
                    } else {
                        console.log(`Must not exceed 30 characters!\n`)
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'last_name',
                message: "Input employees last name",
                validate: function (last_name) {
                    if (last_name.length <= 30) {
                        return true;
                    } else {
                        console.log(`Must not exceed 30 characters\n`)
                        return false;
                    }
                }
            },
            {
                name: 'role',
                type: 'list',
                message: 'Input employees role',
                choices: roleArray
            },
            {
                name: 'manager',
                type: 'list',
                message: 'Who is the employees manager?',
                choices: managerArray
            }
        ])
        .then ((input) => {
            let roleId;
            let managerId = null;

            for (i = 0; i < roles.length; i++) {
                if (input.role == roles[i].title){
                    roleId = roles[i].id;
                }
            }
            for ( i = 0; i < managers.length; i++) {
                if (input.manager == managers[i].Employee) {
                    managerId = managers[i].id;
                }
            }
            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES ("${input.first_name}", "${input.last_name}", ${roleId}, ${managerId})`, (err, res) => {
                   if (err) return err;
                   console.log(`\n ${input.first_name} ${input.last_name} ADDED TO DB! \n `);
                   startPrompt();
               }
               );
        });
    });

};

//Update Employee

function updateEmployee () {

    let employeeArray = [];
    let roleArray = [];

    promisesql.createConnection(db)
        .then((db) => {
            return Promise.all([
                db.query(`SELECT id, title FROM roles ORDER BY title ASC`),
                db.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC")
            ]);
        }).then(({ roles, employees}) => {
            for ( i = 0; i < roles.length; i++) {
                roleArray.push(roles[i].title);
            }
            for ( i = 0; i < employees.length; i++) {
                employeeArray.push(roles[i].title);
            }

            return Promise.all([roles, employees]);
        }).then(([roles, employees]) => {

            inquirer.prompt([
                {
                    name: 'employee',
                    type: 'list',
                    message: 'Which employee would you like to update?',
                    choices: employeeArray
                },
                {
                    name: 'role',
                    type: 'list',
                    message: 'What is their role?',
                    choices: roleArray
                },
            ])
            .then((input) => {
                let roleId;
                let employeeId;

                for ( i = 0; i < roles.length; i++) {
                    if (input.role == roles[i].title) {
                        roleId = roles[i].id;
                    }
                }
                for ( i = 0; i < employees.length; i++) {
                    if(input.employee == employees[i].Employee) {
                        employeeId = employees[i].id;
                    }
                }
                db.query(`UPDATE employee SET role_id = ${roleId} WHERE id = ${employeeId}`, (err, res) => {
                    if (err) return err;
                    console.log(`\n ${input.employee}'s role updated in db \n `);
                    startPrompt();
                });
            });
        });
}

function endTracker() {
    console.log('CLOSING EMPLOYEE TRACKER');
    db.end();
}