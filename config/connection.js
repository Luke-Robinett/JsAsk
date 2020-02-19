const mysql = require("mysql");

const connection = mysql.createConnection({
 host: "localhost",
 user: "luke",
 password: "bootcamp",
 database: "test_db"
});

connection.connect(err => {
 if (err) {
  console.error(err);
  return;
 }
 console.log("Now connected to localhost.");
});

module.exports = connection;