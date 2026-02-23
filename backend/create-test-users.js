// Create Test User for CleanAI
require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function createTestUsers() {
  console.log('\n🔧 Creating test users in database...\n');

  try {
    // Create connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'clean_ai',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Connected to database\n');    // Hash password
    const hashedPassword = await bcrypt.hash('hamza', 10);

    // Create citizen user (matching your table structure: user_id, name, email, phone, password_hash, role, created_at, status)
    const citizenData = {
      name: 'Hamza Ahmed',
      email: 'hamza@cleanai.com',
      phone: '+923001234567',
      password_hash: hashedPassword,
      role: 'citizen',
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
      status: 1
    };

    // Check if user already exists
    const [existing] = await connection.query(
      'SELECT * FROM user WHERE email = ?',
      [citizenData.email]
    );

    if (existing.length > 0) {
      console.log('ℹ️  User "hamza@cleanai.com" already exists in database');
      console.log('   You can login with:');
      console.log('   Email: hamza@cleanai.com');
      console.log('   Password: hamza\n');
    } else {
      // Insert user
      await connection.query(
        `INSERT INTO user (name, email, phone, password_hash, role, created_at, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          citizenData.name,
          citizenData.email,
          citizenData.phone,
          citizenData.password_hash,
          citizenData.role,
          citizenData.created_at,
          citizenData.status
        ]
      );

      console.log('✅ Test user created successfully!\n');
      console.log('   Login credentials:');
      console.log('   Email: hamza@cleanai.com');
      console.log('   Password: hamza\n');
    }    // Create admin user (optional)
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminData = {
      name: 'Admin User',
      email: 'admin@cleanai.com',
      phone: '+923009999999',
      password_hash: adminPassword,
      role: 'admin',
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
      status: 1
    };

    const [existingAdmin] = await connection.query(
      'SELECT * FROM user WHERE email = ?',
      [adminData.email]
    );

    if (existingAdmin.length > 0) {
      console.log('ℹ️  Admin user already exists');
    } else {
      await connection.query(
        `INSERT INTO user (name, email, phone, password_hash, role, created_at, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          adminData.name,
          adminData.email,
          adminData.phone,
          adminData.password_hash,
          adminData.role,
          adminData.created_at,
          adminData.status
        ]
      );

      console.log('✅ Admin user created successfully!\n');
      console.log('   Admin credentials:');
      console.log('   Email: admin@cleanai.com');
      console.log('   Password: admin123\n');
    }

    await connection.end();    console.log('='.repeat(50));
    console.log('✅ Database setup complete!');
    console.log('='.repeat(50));
    console.log('\n🚀 Next steps:');
    console.log('   1. Backend server is running on http://localhost:5000');
    console.log('   2. Start frontend: npm run dev (in main directory)');
    console.log('   3. Open http://localhost:3000/login');
    console.log('   4. Login with: hamza@cleanai.com / hamza\n');

  } catch (error) {
    console.error('\n❌ Error creating test users:', error.message);
    process.exit(1);
  }
}

createTestUsers();
