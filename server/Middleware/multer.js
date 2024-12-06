const multer = require('multer');
const path = require('path');

console.log("Inside multer");

/**
 * @description Defines the storage configuration for multer file uploads
 * @function
 * @param {Object} req - The request object
 * @param {Object} file - The file object to be uploaded
 * @param {Function} cb - The callback function to indicate success or failure
 * @returns {void}
 */
const storage = multer.diskStorage({
    /**
     * @description Sets the destination for file uploads
     * @param {Object} req - The request object
     * @param {Object} file - The file object to be uploaded
     * @param {Function} cb - The callback function to set the destination
     */
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Store files in 'uploads/' directory
    },

    /**
     * @description Sets the filename for the uploaded file
     * @param {Object} req - The request object
     * @param {Object} file - The file object to be uploaded
     * @param {Function} cb - The callback function to set the filename
     * @returns {void}
     */
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`); // Rename the file with a timestamp
    },
});


/**
 * @description Filters the file types based on the allowed extensions
 * @function
 * @param {Object} req - The request object
 * @param {Object} file - The file object to be uploaded
 * @param {Function} cb - The callback function to indicate success or failure
 * @returns {void}
 */
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['.docx', '.png', '.jpeg', '.pdf'];
    const extname = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(extname)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only .docx, .png, .jpeg, and .pdf are allowed.'));
    }
};

/**
 * @description Configures and returns the multer upload middleware
 * @function
 * @returns {Object} - The multer upload middleware
 */
const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB size limit
    fileFilter,
});

module.exports = upload;
