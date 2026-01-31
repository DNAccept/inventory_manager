import mongoose from 'mongoose';

const systemStatsSchema = new mongoose.Schema({
    lastStats: {
        items: { type: Number, default: 0 },
        quantity: { type: Number, default: 0 },
        value: { type: Number, default: 0 }
    },
    trends: {
        items: { type: String, enum: ['increase', 'decrease', 'neutral'], default: 'neutral' },
        quantity: { type: String, enum: ['increase', 'decrease', 'neutral'], default: 'neutral' },
        value: { type: String, enum: ['increase', 'decrease', 'neutral'], default: 'neutral' }
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

const SystemStats = mongoose.model('SystemStats', systemStatsSchema);

export default SystemStats;
