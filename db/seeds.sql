USE emptrack_db;

INSERT INTO department (name)
VALUES
('IT'),
('Human Resources'),
('Sales & Marketing'),
('Finance & Accounting'),
('Operations'),
('Customer Service');

INSERT INTO role (title, salary, department_id)
VALUES ('Full Stack Developer', 80000, 1),
('Software Engineer', 120000, 1),
('Desktop Support Analyst', 76000, 1),
('Systems Administrator', 99000, 1),
('HR Associate', 63000, 2),
('Director of HR', 100000, 2),
('Sales Lead', 90000, 3),
('Marketing Coordinator', 70000, 3),
('Social Media Manager', 50000, 3),
('Accountant', 75000, 4),
('Financial Analyst', 100000, 4),
('Project Manager', 100000, 5),
('Operations Manager', 90000, 5),
('Customer Service Associate', 40000, 6),
('Customer Success Director', 95500, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('John', 'Perry', 1, 2),
('Beth', 'Sanchez', 2, NULL),
('Bob', 'Stewart', 3, 2),
('Mary', 'Pekins', 4, 2),
('James', 'Goggins', 5, 6),
('Amanda', 'Juno', 6, NULL),
('Jack', 'Herringbone', 7, NULL),
('Samantha', 'Stevens', 8, 7),
('Thomas', 'Newhart', 9, 7),
('Cindy', 'Hopper', 10, 11),
('Mark', 'Radcliffe', 11, NULL),
('Megan', 'Johnson', 12, 13),
('Beatrice', 'Smith', 13, NULL),
('Matt', 'Davis', 14, 15),
('Zoey', 'Brown', 15, NULL);

