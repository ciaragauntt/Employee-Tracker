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
    console.log("Viewing All Departments");
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
    console.log("Viewing All Roles");
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
    console.log("Adding A Department");
    inquirer
    .prompt ([
        {
        type: 'input',
        name: 'newDep',
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
    .then( input => {

        db.query(
            `insert INTO department (department_name)
            VALUES (?);`, input.newDep,
                (err, results) => {
                    if (err) throw err;

                    viewAllDepartments();
                }
        );
    });
};
//add new role
const addRole = () => {
console.log("Adding A New Role");
        inquirer.
        prompt([
            {
            type: 'input',
            name: 'newRole',
            message: 'What role do you want to add?',
            validate: addRole => {
                if (addRole) {
                    return true;
                } else {
                    return false;
                }
                }
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is this roles salary?',
            },
        ])
        .then (input => {
            const newRoleArray = [input.newRole, input.salary ];
            const newRoleSql = `Select department_name, id FROM department`;

            db.query(newRoleSql, (err, data) => {
                const dep = data.map(({department_name, id}) => (({name: department_name, value: id})));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'dep',
                        message: 'What department does this role belong in?',
                        choices: dep
                    }
                ])
                .then(depChoice => {
                    const dep = depChoice.dep;
                    newRoleArray.push(dep);

                    const sql = ` INSERT INTO roles (title, salary, department_id)
                                VALUES (?, ?, ?)`;
                    

                    db.query(sql, newRoleArray, (err, result) => {
                        if(err) throw err;

                        viewAllRoles();
                    });

                });
            });
        });
};
}
 
endTracker = () => {
    console.log('CLOSING EMPLOYEE TRACKER');
    db.end();
}
