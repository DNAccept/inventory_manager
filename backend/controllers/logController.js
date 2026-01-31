import Log from '../models/Log.js';

// @desc    Get all logs
// @route   GET /api/logs
// @access  Private
export const getLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, action, userId } = req.query;

    // Build filter
    const filter = {};
    if (action) filter.action = action;
    if (userId) filter.userId = userId;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get logs with pagination
    const logs = await Log.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'username role');

    // Get total count
    const total = await Log.countDocuments(filter);

    res.json({
      success: true,
      count: logs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      logs
    });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching logs'
    });
  }
};

// @desc    Get recent activity (last 10 logs)
// @route   GET /api/logs/recent
// @access  Private
export const getRecentActivity = async (req, res) => {
  try {
    const logs = await Log.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('userId', 'username role');

    res.json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    console.error('Get recent activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching recent activity'
    });
  }
};

// @desc    Get logs by action type
// @route   GET /api/logs/action/:action
// @access  Private
export const getLogsByAction = async (req, res) => {
  try {
    const { action } = req.params;
    const { limit = 20 } = req.query;

    const logs = await Log.find({ action })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .populate('userId', 'username role');

    res.json({
      success: true,
      count: logs.length,
      action,
      logs
    });
  } catch (error) {
    console.error('Get logs by action error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching logs'
    });
  }
};

// @desc    Get user's activity logs
// @route   GET /api/logs/user/:userId
// @access  Private (Admin only or own logs)
export const getUserLogs = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;

    // Check if user is accessing their own logs or is admin
    if (userId !== req.user.id && req.user.role !== 'site_admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these logs'
      });
    }

    const logs = await Log.find({ userId })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    console.error('Get user logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user logs'
    });
  }
};
