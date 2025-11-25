const { google } = require('googleapis');
require('dotenv').config({ path: '.env.local' });

async function setupSheet() {
  try {
    console.log('Setting up Google Sheet...');

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Add headers to the first row
    const headers = ['Name', 'Email', 'Type', 'OtherType', 'Timestamp'];

    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Sheet1!A1:E1',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [headers],
      },
    });

    console.log('✅ Headers added successfully!');
    console.log('Headers:', headers.join(' | '));
    console.log('\nYour Google Sheet is ready to receive form submissions!');

  } catch (error) {
    console.error('❌ Error setting up sheet:', error.message);
    if (error.message.includes('permission')) {
      console.log('\n⚠️  Make sure you shared the sheet with:');
      console.log('   form-submissions@raw-accelerator.iam.gserviceaccount.com');
    }
  }
}

setupSheet();
