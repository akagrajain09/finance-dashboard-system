const express = require('express');
const router = express.Router();
const { getRecords, createRecord, updateRecord, deleteRecord } = require('../controllers/recordController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/role');

router.use(auth); // Protect all routes

router.route('/')
  .get(roleCheck(['Viewer', 'Analyst', 'Admin']), getRecords)
  .post(roleCheck(['Admin']), createRecord);

router.route('/:id')
  .put(roleCheck(['Admin']), updateRecord)
  .delete(roleCheck(['Admin']), deleteRecord);

module.exports = router;
