import User from '../models/User.js';
import Log from '../models/Log.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching users'
    });
  }
};

// @desc    Create new user
// @route   POST /api/users
// @access  Private (Admin only)
export const createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Validation
    if (!username || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username, password, and role'
      });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }

    // Validate role
    const validRoles = ['viewer', 'editor', 'site_admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be viewer, editor, or site_admin'
      });
    }

    // Create user
    const user = await User.create({
      username,
      password,
      role,
      isFirstLogin: true
    });

    // Create log entry
    await Log.create({
      action: 'USER_CREATED',
      reason: 'New user created by admin',
      details: `User ${username} created with role: ${role}`,
      userId: req.user.id,
      username: req.user.username
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        isFirstLogin: user.isFirstLogin,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating user'
    });
  }
};

// @desc    Update user role
// @route   PUT /api/users/:id
// @access  Private (Admin only)
export const updateUser = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    // Validation
    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide role'
      });
    }

    // Validate role
    const validRoles = ['viewer', 'editor', 'site_admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be viewer, editor, or site_admin'
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from changing their own role
    if (user._id.toString() === req.user.id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own role'
      });
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();

    // Create log entry
    await Log.create({
      action: 'USER_UPDATED',
      reason: 'User role updated by admin',
      details: `User ${user.username} role changed from ${oldRole} to ${role}`,
      userId: req.user.id,
      username: req.user.username
    });

    res.json({
      success: true,
      message: 'User role updated successfully',
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating user'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    // Prevent deleting the last admin
    if (user.role === 'site_admin') {
      const adminCount = await User.countDocuments({ role: 'site_admin' });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the last admin user'
        });
      }
    }

    const deletedUsername = user.username;
    await User.findByIdAndDelete(userId);

    // Create log entry
    await Log.create({
      action: 'USER_DELETED',
      reason: 'User deleted by admin',
      details: `User ${deletedUsername} was deleted`,
      userId: req.user.id,
      username: req.user.username
    });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting user'
    });
  }
};
