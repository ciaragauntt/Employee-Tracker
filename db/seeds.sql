USE employee_db;

INSERT INTO department (name)
VALUES ("Engineering"),
       ("Marketing"),
       ("Accounting"),
       ("IT"),
       ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Fullstack Developer", 100000, 1),
       ("Head of Marketing", 75000, 2),
       ("Financial Advisor", 50000, 3),
       ("Tech Support", 30000, 4),
       ("Lawyer", 123456, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Sara", "Smith", 2, 1),
       ("Bob", "Burger", 3, 4),
       ("Pat", "Mcgee", 4, 6),
       ("John", "Doe", 4, 5);
