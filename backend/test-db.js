// Test Database Connection Script
require('dotenv').config();
const mysql = require('mysql2/promise');

async function testDatabaseConnection() {
  console.log('\n🔍 Testing CleanAI Database Connection...\n');
  console.log('Configuration:');
  console.log(`  Host: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`  User: ${process.env.DB_USER || 'root'}`);
  console.log(`  Database: ${process.env.DB_NAME || 'cleanai_db'}`);
  console.log(`  Port: ${process.env.DB_PORT || 3306}`);
  console.log(`  Password: ${process.env.DB_PASSWORD ? '***set***' : '(empty)'}\n`);

  try {
    // Create connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'cleanai_db',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Successfully connected to MySQL database!\n');

    // Test query - get all tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log('📋 Found tables in database:');
    tables.forEach((table, index) => {
      const tableName = Object.values(table)[0];
      console.log(`  ${index + 1}. ${tableName}`);
    });

    // Check if required tables exist
    const requiredTables = [
      'user',
      'reports',
      'ai_classification',
      'satellite_verification',
      'cleanup_tasks',
      'alerts',
      'system_logs',
      'geospatial_zones'
    ];

    console.log('\n🔎 Checking required tables:');
    const existingTables = tables.map(t => Object.values(t)[0]);
    let allTablesExist = true;

    requiredTables.forEach(table => {
      if (existingTables.includes(table)) {
        console.log(`  ✅ ${table}`);
      } else {
        console.log(`  ❌ ${table} - MISSING!`);
        allTablesExist = false;
      }
    });

    // Get user count
    const [userCount] = await connection.query('SELECT COUNT(*) as count FROM user');
    console.log(`\n👥 Users in database: ${userCount[0].count}`);

    // Get reports count
    const [reportsCount] = await connection.query('SELECT COUNT(*) as count FROM reports');
    console.log(`📊 Reports in database: ${reportsCount[0].count}`);

    await connection.end();

    console.log('\n' + '='.repeat(50));
    if (allTablesExist) {
      console.log('✅ Database setup is complete and ready to use!');
    } else {
      console.log('⚠️  Some tables are missing. Please create them in phpMyAdmin.');
    }
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('\n❌ Database connection failed!\n');
    console.error('Error:', error.message);
    console.error('\n📝 Common issues:\n');
    console.error('  1. XAMPP MySQL is not running');
    console.error('     → Open XAMPP Control Panel and start MySQL\n');
    console.error('  2. Database name is incorrect');
    console.error('     → Check if "cleanai_db" exists in phpMyAdmin\n');
    console.error('  3. MySQL password is set but not in .env');
    console.error('     → Update DB_PASSWORD in .env file\n');
    console.error('  4. MySQL port is different');
    console.error('     → Check XAMPP MySQL port (default: 3306)\n');
    process.exit(1);
  }
}

// Run test
testDatabaseConnection();
