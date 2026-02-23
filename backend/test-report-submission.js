// Test script to verify report submission
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

async function testReportSubmission() {
  try {
    console.log('=== Testing Report Submission ===\n');

    // Step 1: Login to get token
    console.log('Step 1: Logging in...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'hamza@cleanai.com',
        password: 'hamza'
      })
    });

    const loginData = await loginResponse.json();
    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginData.error}`);
    }

    const token = loginData.token;
    console.log('✓ Login successful');
    console.log(`Token: ${token.substring(0, 20)}...\n`);

    // Step 2: Create a test image (1x1 pixel PNG)
    console.log('Step 2: Creating test image...');
    const testImagePath = path.join(__dirname, 'test-image.png');
    const pngBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    fs.writeFileSync(testImagePath, pngBuffer);
    console.log('✓ Test image created\n');

    // Step 3: Submit report
    console.log('Step 3: Submitting report...');
    const formData = new FormData();
    formData.append('image', fs.createReadStream(testImagePath));
    formData.append('latitude', '31.5204');
    formData.append('longitude', '74.3587');
    formData.append('gps_accuracy', '10');

    const reportResponse = await fetch('http://localhost:5000/api/reports', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        ...formData.getHeaders()
      },
      body: formData
    });

    const reportData = await reportResponse.json();
    
    if (!reportResponse.ok) {
      throw new Error(`Report submission failed: ${JSON.stringify(reportData)}`);
    }

    console.log('✓ Report submitted successfully!');
    console.log('Report Data:', JSON.stringify(reportData, null, 2));

    // Step 4: Verify report in database
    console.log('\nStep 4: Fetching reports...');
    const reportsResponse = await fetch('http://localhost:5000/api/reports', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const reportsData = await reportsResponse.json();
    console.log('✓ Reports fetched successfully');
    console.log(`Total reports: ${reportsData.count}`);
    console.log('Latest report:', JSON.stringify(reportsData.reports[0], null, 2));

    // Cleanup
    fs.unlinkSync(testImagePath);
    console.log('\n✓ Test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  }
}

testReportSubmission();
