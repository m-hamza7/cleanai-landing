// Quick API Test Script
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('\n🧪 Testing CleanAI Backend API...\n');
  
  try {
    // 1. Health Check
    console.log('1️⃣ Testing Health Endpoint...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Server is healthy:', health.data.message);
    
    // 2. Register a new user
    console.log('\n2️⃣ Registering new user...');
    const registerData = {
      username: 'hamza',
      email: 'hamza@cleanai.com',
      password: 'hamza',
      full_name: 'Hamza Ahmed',
      phone: '+923001234567',
      address: 'Karachi University',
      role: 'citizen'
    };
    
    try {
      const register = await axios.post(`${BASE_URL}/auth/register`, registerData);
      console.log('✅ User registered successfully!');
      console.log('   User ID:', register.data.user.user_id);
      console.log('   Username:', register.data.user.username);
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.message.includes('already exists')) {
        console.log('ℹ️  User already exists (that\'s okay!)');
      } else {
        throw err;
      }
    }
    
    // 3. Login
    console.log('\n3️⃣ Testing Login...');
    const login = await axios.post(`${BASE_URL}/auth/login`, {
      username: 'hamza',
      password: 'hamza'
    });
    console.log('✅ Login successful!');
    console.log('   Token received:', login.data.token.substring(0, 30) + '...');
    console.log('   User:', login.data.user.username);
    console.log('   Role:', login.data.user.role);
    
    const token = login.data.token;
    
    // 4. Get current user info
    console.log('\n4️⃣ Testing Protected Endpoint...');
    const me = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ User info retrieved:', me.data.username);
    
    // 5. Get reports (should be empty initially)
    console.log('\n5️⃣ Fetching reports...');
    const reports = await axios.get(`${BASE_URL}/reports`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Reports count:', reports.data.length);
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 All API tests passed successfully!');
    console.log('='.repeat(50));
    console.log('\n📝 Your login credentials:');
    console.log('   Username: hamza');
    console.log('   Password: hamza');
    console.log('\n🔗 You can now use the frontend with these credentials!\n');
    
  } catch (error) {
    console.error('\n❌ API Test Failed!');
    console.error('Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

testAPI();
