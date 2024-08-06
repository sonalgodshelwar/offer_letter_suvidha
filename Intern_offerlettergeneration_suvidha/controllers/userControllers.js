const db = require('../config/db'); // Import database configuration

// Fetch records with pagination
exports.getUsers = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query; // Default values for pagination

    // Query to get paginated records
    const [rows] = await db.query(
      'SELECT * FROM  LIMIT ? OFFSET ?',
      [parseInt(limit), parseInt(offset)]
    );

    // Query to get total count of records
    const [[{ total }]] = await db.query('SELECT FOUND_ROWS() AS total');

    res.json({
      records: rows,
      totalRecords: total,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
