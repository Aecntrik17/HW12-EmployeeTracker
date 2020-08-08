var mysql = require("mysql");
var inquirer = require("inquirer");
console.log(process.env.mysqlpassword);

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

function modifyEmployee() {
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
      ],
    })

    .then(function (answer) {
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

// view all employees function
function viewAllEmployees() {
  connection.query(
    "SELECT employee.id, first_name, last_name, role_id, manager_id FROM employee inner join role on role_id = role.id",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      modifyEmployee();
    }
  );
}

// view departments function

// Add a Role function

// Add a Department function

// Add an Employee function

// update an Employee function
