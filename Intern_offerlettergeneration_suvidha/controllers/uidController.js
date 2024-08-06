
const db = require('../config/db'); // Adjust the path as necessary

// Function to get the latest UID
async function getLatestUID(req, res) {
  
  try {
    const [rows] = await db.query('SELECT uid FROM offer ORDER BY uid DESC LIMIT 1');
    if (rows.length > 0) {
      const latestUID = rows[0].uid;
      // Assuming UID is numeric and you want to increment it
      const nextUID = parseInt(latestUID.replace('SMM2024INT', '')) + 1;
      res.json({ uid: `SMM2024INT${nextUID.toString().padStart(5, '0')}` });
    } else {
      // Handle case where no UIDs are present in the table
      res.json({ uid: 'SMM2024INT00001' }); // Default UID
    }
  } catch (error) {
    console.error('Error fetching latest UID:', error);
    res.status(500).json({ error: 'Failed to fetch latest UID' });
  } 
}

module.exports = { getLatestUID };
