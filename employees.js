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
      choices: ["View All Roles"],
    })

    .then(function (answer) {
      switch (answer.action) {
        case "View All Roles":
          viewAllRoles();
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
