var mysql = require('mysql')

// MySQL connection configuration
var connection = mysql.createConnection({
    host: 'localhost',
    port: 5432,
    user: 'root',
    database: 'money_management'
});

// Connect to MySQL
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL!');
});

module.exports = connection