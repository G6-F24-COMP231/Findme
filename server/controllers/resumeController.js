const fs = require('fs');
const User = require('../models/User');

/**
 * Uploads a resume for a user.
 * @param {Object} req - The request object, containing the userId in the URL params and the file in the request body.
 * @param {Object} res - The response object, used to send the result or error back to the client.
 */
exports.uploadResume = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Store resume file information in user document
        user.resume = {
            data: fs.readFileSync(req.file.path),
            contentType: req.file.mimetype,
            filename: req.file.filename,
        };

        await user.save();

        // Delete the file from the uploads folder after saving to the database
        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            }
        });

        res.status(200).json({ message: 'Resume uploaded successfully', resume: user.resume.filename });
    } catch (error) {
        console.error('Error uploading resume:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * Deletes a resume for a user.
 * @param {Object} req - The request object, containing the userId in the URL params.
 * @param {Object} res - The response object, used to send the result or error back to the client.
 */
exports.deleteResume = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.resume || !user.resume.data) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        user.resume = undefined; // Remove resume data from user document

        await user.save();
        res.status(200).json({ message: 'Resume deleted successfully' });
    } catch (error) {
        console.error('Error deleting resume:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * Updates an existing resume for a user.
 * @param {Object} req - The request object, containing the userId in the URL params and the new file in the request body.
 * @param {Object} res - The response object, used to send the result or error back to the client.
 */
exports.updateResume = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update resume data
        user.resume = {
            data: fs.readFileSync(req.file.path),
            contentType: req.file.mimetype,
            filename: req.file.filename,
        };

        await user.save();

        // Delete the file from the uploads folder after saving to the database
        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            }
        });

        res.status(200).json({ message: 'Resume updated successfully', resume: user.resume.filename });
    } catch (error) {
        console.error('Error updating resume:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * Downloads the resume of a user.
 * @param {Object} req - The request object, containing the userId in the URL params.
 * @param {Object} res - The response object, used to send the resume data back to the client.
 */
exports.downloadResume = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.resume || !user.resume.data) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        

        // Set the content type and send the resume data
        res.contentType(user.resume.contentType);
        res.setHeader('Content-Disposition', `attachment; filename=${user.resume.filename}`);
        res.send(user.resume.data);

    } catch (error) {
        console.error('Error downloading resume:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
