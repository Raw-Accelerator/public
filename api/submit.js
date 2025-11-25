const { google } = require('googleapis');

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    console.log('Starting form submission...');
    console.log('Has GOOGLE_CREDENTIALS:', !!process.env.GOOGLE_CREDENTIALS);
    console.log('Has SPREADSHEET_ID:', !!process.env.SPREADSHEET_ID);

    // Validate required fields first
    const { name, email, type, otherType } = req.body;
    if (!name || !email || !type) {
      console.log('Missing required fields');
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Parse credentials from environment variable
    let credentials;
    try {
      credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
      console.log('Credentials parsed successfully');
    } catch (parseError) {
      console.error('Failed to parse GOOGLE_CREDENTIALS:', parseError.message);
      throw new Error('Invalid GOOGLE_CREDENTIALS format');
    }

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    console.log('Google Sheets client initialized');

    const timestamp = new Date().toISOString();

    console.log('Attempting to append to sheet...');
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Sheet1!A:E',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[name, email, type, otherType || '', timestamp]],
      },
    });

    console.log('Successfully appended to sheet');
    res.status(200).json({ success: true, message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error submitting to Google Sheets:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    res.status(500).json({
      success: false,
      error: 'Failed to submit form',
      details: error.message
    });
  }
}
