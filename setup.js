const mysql = require('mysql2');

// Connect to the database
const connection = mysql.createConnection(process.env.DATABASE_URL);

console.log('Setting up Database...');

// Define all tables you want to create
const tables = [
  {
    name: 'games',
    sql: `
      CREATE TABLE IF NOT EXISTS games (
        id INT AUTO_INCREMENT,
        title VARCHAR(500) NOT NULL,
        platform VARCHAR(500) NOT NULL,
        year INT NOT NULL,
        CONSTRAINT games_pk PRIMARY KEY (id)
      );
    `
  },
  // Add more tables here if needed, e.g.:
  // {
  //   name: 'users',
  //   sql: `CREATE TABLE IF NOT EXISTS users (...)`
  // }
];

// Function to create a table safely
function createTable(table, callback) {
  connection.execute(table.sql, function(err, results, fields) {
    if (err) {
      console.error(`Error creating table ${table.name}:`, err);
    } else {
      console.log(`Table '${table.name}' created or already exists.`);
    }
    callback();
  });
}

// Sequentially create all tables
function setupTables(index = 0) {
  if (index >= tables.length) {
    console.log('All tables processed.');
    connection.end(); // Close connection
    return;
  }
  createTable(tables[index], () => setupTables(index + 1));
}

// Start setup
setupTables();