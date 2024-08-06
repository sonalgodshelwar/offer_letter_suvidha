const db = require("../config/db.js");

const addNew = async (req, resp) => {
  try {
    const { uid, salutation, name, post, start, end, email } = req.body;

    const data = await db.query(
      `INSERT INTO offer (uid, salutation, name, post, start, end, email, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [uid, salutation, name, post, start, end, email, new Date()]
    );
    
    if (!data) {
      return resp.status(404).send({
        success: false,
        message: "Error in adding record",
      });
    }
    resp.status(200).send({
      success: true,
      message: "Record Saved",
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: error.message,
      error,
    });
  } 
};

const updateDetails = async (req, resp) => {
  try {
    const uid = req.params.uid;
    if (!uid)
      return resp.status(404).send({
        success: false,
        message: "Uid Not Found",
      });

    // Check if the record exists
    

   
    const { salutation, name, post, start, end, email } = req.body;
    const data = await db.query(
      `UPDATE offer SET salutation = ?, name = ?, post = ?, start = ?, end = ?, email = ? WHERE uid = ?`,
      [salutation, name, post, start, end, email, uid]
    );

    if (!data) {
      return resp.status(500).send({
        success: false,
        message: "Error in updating data",
      });
    }
    resp.status(200).send({
      success: true,
      message: "Successfully Updated",
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "Error in update API",
      error,
    });
  }
};

const deleteDetails = async (req, resp) => {
  try {
    const uid = req.params.uid;
    if (!uid)
      return resp.status(404).send({
        success: false,
        message: "Uid Not Found",
      });

    const data = await db.query(`DELETE FROM offer WHERE uid = ?`, [uid]);
    resp.status(200).send({
      success: true,
      message: "Successfully Deleted",
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "Error in delete API",
      error,
    });
  }
};

const selectById = async (req, resp) => {
  try {
    const uid = req.params.uid;
    if (!uid)
      return resp.status(404).send({
        success: false,
        message: "Uid Not Found",
      });

    const [data] = await db.query(`SELECT * FROM offer WHERE uid = ?`, [uid]);

    if (!data || data.length === 0) {
      return resp.status(404).send({
        success: false,
        message: "No records found",
      });
    }
    resp.status(200).send(
      
       data[0]
    );
  } catch (error) {
   
    resp.status(500).send({
      success: false,
      message: "Error in fetch API",
      error,
    });
  }
};

const selectUser = async (req, resp) => {
  try {
    const data = await db.query(`
      SELECT * FROM offer
      ORDER BY timestamp DESC
      LIMIT 10
    `);
    
    if (!data || data.length === 0) {
      return resp.status(404).send({
        success: false,
        message: "No records found",
      });
    }

    resp.status(200).send(data[0]);
    
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "Error in selectUser API",
      error, 
    });
  }
};
const getLastuid=async(req,resp)=>{
   const  query = 'SELECT uid FROM offer ORDER BY uid DESC LIMIT 1';
   await db.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return resp.status(500).json({ error: err.message });
      }
      if (results.length > 0) {
        console.log({ latestUID: results[0].uid })
        return resp.json({ latestUID: results[0].uid });
      } else {
        console.log({ latestUID: results[0].uid })
        return resp.json({ latestUID: 'SMM2024INT96100' }); // Default UID if no records exist
      }
    });
}

module.exports = { addNew, updateDetails, deleteDetails, selectById, selectUser ,getLastuid};
