import mongoose from "mongoose";

const ruleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    severity: {
        type: Number,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    pattern:{
        type: String,
        required: true
    }
});

const Rule = mongoose.model('Rule', ruleSchema);

export default Rule;
