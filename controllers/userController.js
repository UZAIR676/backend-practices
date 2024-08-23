const Usermodel = require('../models/userModel.js');
const BlogModel = require('../models/BlogModel.js');
const bcrypt = require('bcrypt');

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await Usermodel.find();
        res.status(200).json(users);
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: 'Error fetching users' });
    }
};

// Register a user
exports.registerController = async (req, res) => {
    const { name, email, password, isAdmin } = req.body;
    try {
        // Check if user already exists
        const existingUser = await Usermodel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new Usermodel({ name, email, password: hashedPassword, isAdmin });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', newUser });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: 'Error registering user' });
    }
};

// Login a user
exports.loginController = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Usermodel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'User not found! Please create an account' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: 'Error logging in' });
    }
};

// Delete a user and their associated blogs
exports.deleteUser = async function(req, res) {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await Usermodel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // Delete user's blogs
        await BlogModel.deleteMany({ user: user._id });

        // Delete the user
        await Usermodel.deleteOne({ email });
        res.status(200).json({ message: 'User and associated blogs deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting user' });
    }
};

// Get all blogs for a specific user
exports.userBlogController = async (req, res) => {
    try {
        // Find the user by ID and populate the blogs field
        const userBlog = await Usermodel.findById(req.params.Id).populate('blogs');

        if (!userBlog) {
            return res.status(404).send({
                message: 'User not found',
                success: false,
            });
        }

        return res.status(200).send({
            success: true,
            message: 'Blogs found for user',
            blogs: userBlog.blogs, // Return the user's blogs
        });
    } catch (error) {
        console.log(error); 
        res.status(500).json({
            message: 'An error occurred',
            success: false,
        });
    }
};

// Create a blog for a user
exports.createBlogController = async (req, res) => {
    try {
        const { title, description, images, userId } = req.body;

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

        // Link the blog with the user
        user.blogs.push(newBlog._id); // Add the blog ID to the user's blogs array
        await user.save(); // Save the updated user

        res.status(201).json({
            message: 'Blog created successfully',
            success: true,
            newBlog,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred',
            success: false,
        });
    }
};
