USE employee_db;

INSERT INTO department (department_name)
VALUES ("Engineering"),
       ("Marketing"),
       ("Accounting"),
       ("IT"),
       ("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES ("Fullstack Developer", 100000, 1),
       ("Head of Marketing", 75000, 2),
       ("Financial Advisor", 50000, 3),
       ("Tech Support", 30000, 4),
       ("Lawyer", 123456, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Sara", "Smith", 2, null),
       ("Bob", "Burger", 3, null),
       ("Pat", "Mcgee", 4, null),
       ("John", "Doe", 4, null);

-- UPDATE employee set manager_id = 4 where id = 2;
-- UPDATE employee set manager_id = 7 where id = 3;
-- UPDATE employee set manager_id = 5 where id = 4;
-- UPDATE employee set manager_id = 5 where id = 5;
