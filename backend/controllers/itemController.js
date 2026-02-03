import Item from '../models/Item.js';
import Log from '../models/Log.js';
import SystemStats from '../models/SystemStats.js';

// Helper to update system trends
const updateTrends = async () => {
  try {
    const items = await Item.find();
    const currentItems = items.length;
    const currentQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const currentValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    let stats = await SystemStats.findOne();

    if (!stats) {
      stats = await SystemStats.create({
        lastStats: { items: currentItems, quantity: currentQuantity, value: currentValue },
        trends: { items: 'neutral', quantity: 'neutral', value: 'neutral' }
      });
      return stats.trends;
    }

    const prev = stats.lastStats;
    const newTrends = { ...stats.trends };

    // Determine trends (only change if value changed)
    // Use a small epsilon for float comparison on value
    if (currentItems > prev.items) newTrends.items = 'increase';
    else if (currentItems < prev.items) newTrends.items = 'decrease';

    if (currentQuantity > prev.quantity) newTrends.quantity = 'increase';
    else if (currentQuantity < prev.quantity) newTrends.quantity = 'decrease';

    if (currentValue > prev.value + 0.01) newTrends.value = 'increase';
    else if (currentValue < prev.value - 0.01) newTrends.value = 'decrease';

    stats.lastStats = { items: currentItems, quantity: currentQuantity, value: currentValue };
    stats.trends = newTrends;
    stats.lastUpdated = Date.now();

    await stats.save();
    return newTrends;
  } catch (err) {
    console.error('Error updating trends:', err);
    return null;
  }
};

// @desc    Get all items
// @route   GET /api/items
// @access  Private
export const getItems = async (req, res) => {
  try {
    const items = await Item.find({ userId: req.user.id }).sort({ createdAt: -1 });
    const stats = await SystemStats.findOne();
    const trends = stats ? stats.trends : { items: 'neutral', quantity: 'neutral', value: 'neutral' };

    res.json({
      success: true,
      count: items.length,
      items,
      trends
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching items'
    });
  }
};

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Private
export const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      item
    });
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching item'
    });
  }
};

// @desc    Create new item
// @route   POST /api/items
// @access  Private (Editor/Admin only)
export const createItem = async (req, res) => {
  try {
    const { name, category, quantity, price, description, reason, lowStockThreshold } = req.body;

    // Validation
    if (!name || !category || quantity === undefined || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, category, quantity, and price'
      });
    }

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a reason for adding this item'
      });
    }

    // Create item
    const item = await Item.create({
      name,
      category,
      quantity,
      price,
      description: description || '',
      lowStockThreshold: lowStockThreshold || 10,
      userId: req.user.id
    });

    // Create log entry
    await Log.create({
      action: 'ADD',
      reason,
      details: `Added new item: ${name} (Qty: ${quantity}, Price: $${price})`,
      userId: req.user.id,
      username: req.user.username,
      itemId: item._id,
      itemName: item.name,
      newData: {
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        price: item.price,
        description: item.description
      }
    });



    // Update system trends
    await updateTrends();

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      item
    });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating item'
    });
  }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private (Editor/Admin only)
export const updateItem = async (req, res) => {
  try {
    const { name, category, quantity, price, description, reason, lowStockThreshold } = req.body;
    const itemId = req.params.id;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a reason for updating this item'
      });
    }

    // Find item
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Verify ownership
    if (item.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this item'
      });
    }

    // Store previous data for logging
    const previousData = {
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      price: item.price,
      description: item.description,
      lowStockThreshold: item.lowStockThreshold
    };

    // Update fields
    if (name !== undefined) item.name = name;
    if (category !== undefined) item.category = category;
    if (quantity !== undefined) item.quantity = quantity;
    if (price !== undefined) item.price = price;
    if (description !== undefined) item.description = description;
    if (lowStockThreshold !== undefined) item.lowStockThreshold = lowStockThreshold;

    await item.save();

    // Create log entry
    const changes = [];
    if (previousData.name !== item.name) changes.push(`name: ${previousData.name} → ${item.name}`);
    if (previousData.category !== item.category) changes.push(`category: ${previousData.category} → ${item.category}`);
    if (previousData.quantity !== item.quantity) changes.push(`quantity: ${previousData.quantity} → ${item.quantity}`);
    if (previousData.price !== item.price) changes.push(`price: $${previousData.price} → $${item.price}`);
    if (previousData.description !== item.description) changes.push('description updated');
    if (previousData.lowStockThreshold !== item.lowStockThreshold) changes.push(`threshold: ${previousData.lowStockThreshold} → ${item.lowStockThreshold}`);

    await Log.create({
      action: 'UPDATE',
      reason,
      details: `Updated item: ${item.name}. Changes: ${changes.join(', ')}`,
      userId: req.user.id,
      username: req.user.username,
      itemId: item._id,
      itemName: item.name,
      previousData,
      newData: {
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        price: item.price,
        description: item.description,
        lowStockThreshold: item.lowStockThreshold
      }
    });

    // Update system trends
    await updateTrends();

    res.json({
      success: true,
      message: 'Item updated successfully',
      item
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating item'
    });
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private (Editor/Admin only)
export const deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a reason for deleting this item'
      });
    }

    // Find item
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Verify ownership
    if (item.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this item'
      });
    }

    // Store item data for logging
    const itemData = {
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      price: item.price,
      description: item.description
    };

    await Item.findByIdAndDelete(itemId);

    // Create log entry
    await Log.create({
      action: 'DELETE',
      reason,
      details: `Deleted item: ${itemData.name} (Qty: ${itemData.quantity}, Price: $${itemData.price})`,
      userId: req.user.id,
      username: req.user.username,
      itemId: itemId,
      itemName: itemData.name,
      previousData: itemData
    });

    // Update system trends
    await updateTrends();

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting item'
    });
  }
};

// @desc    Get inventory statistics
// @route   GET /api/items/stats
// @access  Private
export const getStats = async (req, res) => {
  try {
    const totalItems = await Item.countDocuments({ userId: req.user.id });
    const items = await Item.find({ userId: req.user.id });

    const lowStockItems = items.filter(item => item.quantity <= item.lowStockThreshold).length;
    const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    // Get unique categories
    const categories = [...new Set(items.map(item => item.category))];

    res.json({
      success: true,
      stats: {
        totalItems,
        lowStockItems,
        totalValue: totalValue.toFixed(2),
        categories: categories.length
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching statistics'
    });
  }
};
