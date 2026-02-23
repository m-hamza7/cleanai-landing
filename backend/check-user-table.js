// Check User Table Structure
require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkUserTable() {
  console.log('\n🔍 Checking user table structure...\n');

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'clean_ai',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Connected to database\n');

    // Get table structure
    const [columns] = await connection.query('DESCRIBE user');
    
    console.log('📋 Columns in "user" table:');
    console.log('='.repeat(70));
    columns.forEach(col => {
      console.log(`  ${col.Field.padEnd(20)} | ${col.Type.padEnd(20)} | ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    console.log('='.repeat(70));

    // Check if there are any existing users
    const [users] = await connection.query('SELECT * FROM user LIMIT 5');
    console.log(`\n👥 Existing users: ${users.length}`);
    if (users.length > 0) {
      console.log('\nSample user data:');
      users.forEach(user => {
        console.log(`  - ID: ${user.user_id || user.id}, Name: ${user.full_name || user.name || 'N/A'}`);
      });
    }

    await connection.end();

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

checkUserTable();
