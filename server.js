const inquirer = require('inquirer');
//import and require mysql2
const mysql = require('mysql2');

const table = require ('console.table');
const express = require('express');
const Connection = require('mysql/lib/Connection');




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
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee']
        }
    ])
    .then((answers) => {
        if (answers.list === "view All Departments") {
            viewAllDepartments();
        } else if (answers.list === "View All Roles") {
            viewAllRoles();
        } else if (answers.list === "View All Employees") {
            viewAllEmployees();
        } else if (answers.list === "Add A Department") {
            addDepartment();
        } else if (answers.list === "Add A Role") {
            addRole();
        } else if (answers.list === "Add An Employee") {
            addEmployee();
        } else if (answers.list === "Update An Employee") {
            updateEmployee();
        }
    });
}
//View All Departments
function viewAllDepartments() {
    console.log("Viewing Departments\n");
// query to join the data
    var query = 
    `SELECT d.id, d.name, r.salary AS budget
    FROM employee e
    LEFT JOIN role r
        ON e.role_id = r.id
    LEFT JOIN department d 
    ON d.id = r.department_id
    GROUP BY d.id, d.name`
//connsecting the query
    Connection.query(query, function (err, res) {
        if(err) throw err;

        const departments = res.map(data => ({
            value: data.id, name: data.name
        }));

        console.table(res);
        console.log("Successful Departments\n");

        promptDepartment(departments);
    });
}  
// prompt for when a user selects view all departments

function promptDepartment(departments) {

    inquirer.prompt([
        {
            type: "list",
            name: "departmentId",
            message: "Which department are you looking for?",
            choices: departments
        }
    ])
    .then(function(answer) {
        console.log("answer ", answer.departmentId);

        var query = 
        `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department
        FROM employee e
        JOIN department d
        ON d.id = r.department_id
        WHERE d.id = ?`

            Connection.query(query, answer.departmentId, function (err, res) {
                if (err) throw err;

                console.table("response ". res);
                console.log(res.affectedRows + "Viewing Employees\n");

                startPrompt();
            });
    });
}