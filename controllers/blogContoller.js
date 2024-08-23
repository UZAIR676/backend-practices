// const BlogModel = require('../models/BlogModel.js');
const Usermodel = require('../models/userModel.js'); // Import User model

// Get all blogs
exports.getAllblogsController = async (req, res) => {
    try {
        const blogs = await BlogModel.find().populate('user'); // Populate user details

        if (!blogs.length) {
            return res.status(404).json({
                data: {
                    message: 'No blogs found',
                    success: false
                }
            });
        }

        res.status(200).json({
            data: {
                message: 'All blogs',
                success: true,
                BlogCount: blogs.length,
                blogs,
            }
        });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({
            success: false,
            message: 'An error occurred'
        });
    }
};

// Create a new blog
exports.createBlogController = async (req, res) => {
    try {
        const { title, description, images, userId } = req.body; // Include userId

        // Validation
        if (!title || !description || !images || !userId) {
            return res.status(400).json({
                message: 'All fields are required',
                success: false,
            });
        }

        // Check if the user exists
        const user = await Usermodel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false,
            });
        }

        // Create a new blog
        const newBlog = new BlogModel({ title, description, images, user: userId });
        await newBlog.save();

        res.status(201).json({
            message: 'Blog created successfully',
            success: true,
            newBlog,
        });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({
            message: 'An error occurred',
            success: false,
        });
    }
};

// Update a blog
exports.updateBlogController = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, images } = req.body;
        
        // Update the blog
        const updatedBlog = await BlogModel.findByIdAndUpdate(id, { title, description, images }, { new: true });

        if (!updatedBlog) {
            return res.status(404).json({
                message: 'Blog not found',
                success: false,
            });
        }

        res.status(200).json({
            message: 'Blog updated successfully',
            success: true,
            blog: updatedBlog,
        });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({
            message: 'An error occurred',
            success: false,
        });
    }
};

// Delete a blog
exports.deleteBlogController = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete the blog
        const deletedBlog = await BlogModel.findByIdAndDelete(id);

        if (!deletedBlog) {
            return res.status(404).json({
                message: 'Blog not found',
                success: false,
            });
        }

        res.status(200).json({
            message: 'Blog deleted successfully',
            success: true,
        });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({
            message: 'An error occurred',
            success: false,
        });
    }
};

exports.userBlogController = async (req, res) => {
    try {
        // Find the user by ID and populate the blogs
        const userBlog = await Usermodel.findById(req.params.Id).populate('blogs');

        if (!userBlog) {
            return res.status(404).send({
                message: 'User not found',
                success: false,
            });
        }

        if (userBlog.blogs.length === 0) {
            return res.status(404).send({
                message: 'No blogs found for this user',
                success: false,
            });
        }

        return res.status(200).send({
            success: true,
            message: 'Blogs found for user',
            blogCount: userBlog.blogs.length, // Count of blogs
            blogs: userBlog.blogs, // Return the user's blogs
        });
    } catch (error) {
        console.log(error); // Log error for debugging
        res.status(500).json({
            message: 'An error occurred',
            success: false,
        });
    }
};

