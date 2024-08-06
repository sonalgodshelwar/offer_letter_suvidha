const express=require('express');
const { body, validationResult } = require('express-validator');
const { addNew, updateDetails, deleteDetails, selectById, selectUser,getLastuid } = require('../controllers/offerdataController.js');
const { validateUser } = require('../middleware/offerdataVerification.js');
const router=express.Router();
const mailController = require('../controllers/mailController.js');
const userController = require('../controllers/userControllers.js');
const uidController = require('../controllers/uidController');
const pdfController=require('../controllers/pdfController.js')





router.route('/addNew').post(validateUser,addNew)
router.route('/updateDetails/:uid').put(validateUser,updateDetails)
router.route('/deleteDetails/:uid').delete(deleteDetails)
router.route('/fetchDetailsbyId/:uid').get(selectById)
router.route('/selectUser').get(selectUser)

router.get('/selectUser', userController.getUsers);
router.post('/generatePdf', pdfController.createPDFandDownload);
router.post('/sendMail', pdfController.createPDFandMail);






// Route to get the latest UID
router.get('/latest-uid', uidController.getLatestUID);



module.exports=router;

