const express = require('express');
const { uploadResume, deleteResume, updateResume, downloadResume } = require('../controllers/resumeController');

const upload = require('../Middleware/multer');
const router = express.Router();

/**
 * @description Upload a resume for a specific user
 * @route POST /api/users/:userId/resume
 * @access Public
 * @param {Object} req - The request object, containing userId and the resume file to upload
 * @param {Object} res - The response object to send success or failure message
 * @param {Function} next - The next middleware function, if needed
 */
router.post('/:userId/resume', upload.single('resume'), uploadResume);


/**
 * @description Update a resume for a specific user
 * @route PUT /api/users/:userId/resume
 * @access Public
 * @param {Object} req - The request object, containing userId and the updated resume file
 * @param {Object} res - The response object to return success or failure
 * @param {Function} next - The next middleware function, if needed
 */
router.put('/:userId/resume', upload.single('resume'), updateResume);

/**
 * @description Delete a resume for a specific user
 * @route DELETE /api/users/:userId/resume
 * @access Public
 * @param {Object} req - The request object, containing userId to identify the user
 * @param {Object} res - The response object to return success or failure message
 * @param {Function} next - The next middleware function, if needed
 */
router.delete('/:userId/resume', deleteResume);

/**
 * @description Download a resume for a specific user
 * @route GET /api/users/:userId/resume
 * @access Public
 * @param {Object} req - The request object, containing userId to locate the resume
 * @param {Object} res - The response object to send the resume file
 * @param {Function} next - The next middleware function, if needed
 */
router.get('/:userId/resume', downloadResume);

module.exports = router;
