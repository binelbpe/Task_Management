import mongoose from 'mongoose';

const distributionSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    notes: {
        type: String,
        trim: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
        required: true
    }
}, {
    timestamps: true
});

const Distribution = mongoose.model('Distribution', distributionSchema);
export default Distribution; 