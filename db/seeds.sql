INSERT INTO department (department_name)
VALUES ("Engineering"),
       ("Marketing"),
       ("Accounting"),
       ("IT")
       ("Legal");

INSERT INTO employee_role (title, salary, department_id)
VALUES ("Fullstack Developer", 100000, 001),
       ("Head of Marketing", 75000, 002),
       ("Financial Advisor", 50000, 003),
       ("Tech Support", 30000, 004),
       ("Lawyer", 123456, 005)

INSERT INTO employee_info (first_name, last_name, role_id, manager_id)
VALUES ("Sara", "Smith", 2, 123),
       ("Bob", "Burger", 3, 456),
       ("Pat", "Mcgee", 4, 678)
       ("John", "Doe", 4, 567)