var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "127.0.0.1",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "bootcamp",

  // Your password
  password: "bootcamp",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  //runSearch();
});

for (var i = 0; i < 10; i++) {
  console.log("\n");
}
header();
function header() {
  console.log("ID\tProduct\t\t\t\tDepartment\t\tPrice\tQuantity");
  console.log(
    "____________________________________________________________________________________"
  );
}
function showAll() {
  var query = "SELECT * FROM products";
  connection.query(query, function(err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(
        res[i].item_id +
          "\t" +
          res[i].product_name +
          "\t\t\t" +
          res[i].department_name +
          "\t\t" +
          res[i].price +
          "\t" +
          res[i].stock_quantity
      );
    }
    console.log("\n");
    menu();
  });
}

function menu() {
  console.log("\n");
  inquirer
    .prompt([
      {
        name: "id",
        type: "input",
        message: "ID of the item to purchase?"
      },
      {
        name: "qty",
        type: "input",
        message: "Quantity?"
      }
    ])
    .then(function(answer) {
      var query = "SELECT * FROM products WHERE ?";
      connection.query(query, { item_id: answer.id }, function(err, res) {
        if (res[0].stock_quantity > answer.qty) {
          var newQty = res[0].stock_quantity - answer.qty;
          console.log("Updating ...  New quantity left: " + newQty);

          var query = "UPDATE products SET ? WHERE item_id='" + answer.id + "'";
          connection.query(query, { stock_quantity: newQty }, function(
            err,
            res
          ) {
            header();
            showAll();
          });
        } else {
          console.log(
            "Insufficient quantity! Maximum quantity is: " +
              res[0].stock_quantity
          );
          menu();
        }
      });
    });
}

showAll();
