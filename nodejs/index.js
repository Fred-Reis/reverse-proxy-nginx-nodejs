const express = require("express");
const app = express();
const mysql = require("mysql2");
const port = 3000;

const config = {
  host: "db",
  user: "root",
  password: "root",
  database: "nodedb",
};

const createTable = `CREATE TABLE IF NOT EXISTS nodedb.people (
  id INT AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY(id)  
);`;

const setSql = `INSERT INTO people(name) values('Dev')`;

const getSql = `SELECT * FROM people`;

const connection = mysql.createConnection(config);

let results = [];

connection
  .promise()
  .query(createTable)
  .catch(console.error)
  .then(() =>
    connection
      .promise()
      .query(setSql)
      .catch(console.error)
      .then(() =>
        connection
          .promise()
          .query(getSql)
          .then(([rows, fields]) => {
            results = rows;
          })
          .catch(console.error)
      )
      .finally(() => connection.end())
  );

app.get("/", (req, res) => {
  res.send(
    `<h1>Full Cycle Rocks!!</h1> 
    <h2>We have ${results.length} inserts in the people table</h2>
    ${results.map(
      (res) =>
        `<h2 key=${res.id}>the name in position #${res.id} is: ${res.name}</h2>`
    )}`
  );
});

app.listen(port, () => {
  console.log(`🚀 Running on port ${port}`);
});
