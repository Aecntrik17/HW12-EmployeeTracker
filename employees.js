var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "employees_db",
});

connection.connect(function (err) {
  if (err) throw err;
  modifyEmployee();
});

async function modifyEmployee() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      Message: "What would you like to do?",
      choices: [
        "View All Roles",
        "View All Employees",
        "View Departments",
        "Add a Role",
        "Add a Department",
        "Add an Employee",
        "Update a Role",
        "Exit",
      ],
    })

    .then(async function (answer) {
      switch (answer.action) {
        case "View All Roles":
          viewAllRoles();
          break;

        case "View All Employees":
          viewAllEmployees();
          break;

        case "View Departments":
          viewDepartments();
          break;

        case "Add a Role":
          const newRoleAnswer = await inquirer.prompt([
            {
              name: "addRole",
              type: "input",
              message: "What is the new Role title?",
            },
            {
              name: "addSalary",
              type: "input",
              message: "What is the new Role salary?",
            },
            {
              name: "addRoleDptId",
              type: "number",
              message: "What is the new Role department id?",
            },
          ]);

          addRole(newRoleAnswer);
          break;

        case "Add a Department":
          addDepartment();
          break;

        case "Add an Employee":
          addEmployee();
          break;

        case "Update a Role":
          const updateRoleAnswer = inquirer.prompt({
            name: "updateRole",
            type: "input",
            message: "What is the new Role title?",
          });
          const role = new Role(newRoleAnswer.name);
          updateRole();
          break;

        case "Exit":
          connection.end();
          break;
      }
    });
}

// view All Roles function
function viewAllRoles() {
  connection.query(
    "SELECT role.id, title, salary, name FROM role left join department on role.department_id = department.id",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      modifyEmployee();
    }
  );
}

// view all Employees function
function viewAllEmployees() {
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      modifyEmployee();
    }
  );
}

// view Departments function
function viewDepartments() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    console.table(res);
    modifyEmployee();
  });
}

// Add a Role function
function addRole(newRoleAnswer) {
  connection.query(
    "INSERT INTO role SET ? ",
    {
      title: newRoleAnswer.addRole,
      salary: newRoleAnswer.addSalary,
      department_id: newRoleAnswer.addRoleDptId,
    },
    function (err, res) {
      if (err) throw err;
      console.table(res);
      modifyEmployee();
    }
  );
}

// Add a Department function

// Add an Employee function

// Update a Role function
function updateRole() {
  connection.query(
    "UPDATE role WHERE ?",
    { role: updateRoleAnswer.name },
    function (err, res) {
      if (err) throw err;
      console.table(res);
      modifyEmployee();
    }
  );
}
