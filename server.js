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