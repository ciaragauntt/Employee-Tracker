const express = require('express');
//import and require mysql2
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

//express middleware
app.use(express.urlencoded({extened: false}));
app.use(express.json());

//connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        //mysql username
        user: 'root',
        //add mysql password
        password: '@Ciaraculverhouse365',
        database: 'employee_db',
    },
    console.log('Connected to the employee_db database.')
);

app.listen(PORT, () => {
    console.log(`Sever running on port ${PORT}`);
});

var employeeTracker = function () {
    inquirer.prompt ({
        //presented with specific options view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
        type: 'list',
        name: 'prompt',
        message: 'Please choose one of the following...',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee']
    })
}