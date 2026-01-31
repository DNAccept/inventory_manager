import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ['ADD', 'UPDATE', 'DELETE', 'USER_CREATED', 'USER_DELETED', 'USER_UPDATED', 'LOGIN', 'LOGOUT'],
    required: true
  },
  reason: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, 'Reason cannot exceed 200 characters']
  },
  details: {
    type: String,
    trim: true,
    default: ''
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  },
  itemName: {
    type: String
  },
  previousData: {
    type: mongoose.Schema.Types.Mixed
  },
  newData: {
    type: mongoose.Schema.Types.Mixed
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false
});

// Index for faster queries
logSchema.index({ timestamp: -1 });
logSchema.index({ userId: 1 });
logSchema.index({ action: 1 });

const Log = mongoose.model('Log', logSchema);

export default Log;
