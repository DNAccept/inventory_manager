import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Log from '../models/Log.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const checkInit = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({
      success: true,
      initialized: count > 0
    });
  } catch (error) {
    console.error('Check init error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error checking initialization status'
    });
  }
};

// @desc    Register first admin user
// @route   POST /api/auth/register-initial
// @access  Public (Only if no users exist)
export const registerFirstUser = async (req, res) => {
  try {
    const count = await User.countDocuments();
    if (count > 0) {
      return res.status(403).json({
        success: false,
        message: 'System already initialized. Admin account exists.'
      });
    }

    const { username, password, fullName } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password'
      });
    }

    const user = await User.create({
      username,
      password,
      fullName: fullName || 'System Administrator',
      role: 'site_admin',
      isFirstLogin: false
    });

    // Create log entry (manually since no user in req yet)
    await Log.create({
      action: 'SYSTEM_INIT',
      reason: 'Initial admin account created',
      details: `Initial admin user ${username} created`,
      userId: user._id,
      username: user.username
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { username, password, fullName } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password'
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Username already taken'
      });
    }

    // Create user (default role is editor)
    const user = await User.create({
      username,
      password,
      fullName: fullName || '',
      role: 'editor',
      isFirstLogin: true
    });

    // Create log entry
    await Log.create({
      action: 'USER_CREATED',
      reason: 'User self-registration',
      details: `User ${username} registered successfully`,
      userId: user._id,
      username: user.username
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        isFirstLogin: user.isFirstLogin
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// @desc    Login user
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password'
      });
    }

    // Check if user exists
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create login log
    await Log.create({
      action: 'LOGIN',
      reason: 'User logged in',
      details: `User ${username} logged in successfully`,
      userId: user._id,
      username: user.username
    });

    // Generate token
    const token = generateToken(user._id);

    // Send response
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        isFirstLogin: user.isFirstLogin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { username, fullName, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const oldUsername = user.username;
    let usernameChanged = false;

    // Update username if provided and different
    if (username && username !== user.username) {
      // Check if username is already taken
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken'
        });
      }
      user.username = username;
      usernameChanged = true;
    }

    // Update full name if provided
    if (fullName !== undefined) {
      user.fullName = fullName;
    }

    // Update password if provided
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is required to set new password'
        });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      user.password = newPassword;
    }

    // Mark first login as complete
    if (user.isFirstLogin) {
      user.isFirstLogin = false;
    }

    await user.save();

    // Create log entry
    await Log.create({
      action: 'USER_UPDATED',
      reason: 'Profile updated',
      details: `User updated their profile${usernameChanged ? ` (username changed from ${oldUsername} to ${username})` : ''}`,
      userId: user._id,
      username: user.username
    });

    // If username changed, notify admins (log it for now)
    if (usernameChanged) {
      const admins = await User.find({ role: 'site_admin' });
      // In a real app, you'd send emails or in-app notifications here
      console.log(`Username changed: ${oldUsername} -> ${username}. Admins notified:`, admins.map(a => a.username));

      // Create notification log
      await Log.create({
        action: 'USER_UPDATED',
        reason: 'Username changed - Admin notification',
        details: `Username changed from ${oldUsername} to ${username}`,
        userId: user._id,
        username: user.username
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        isFirstLogin: user.isFirstLogin
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  try {
    // Create logout log
    await Log.create({
      action: 'LOGOUT',
      reason: 'User logged out',
      details: `User ${req.user.username} logged out`,
      userId: req.user.id,
      username: req.user.username
    });

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
};
