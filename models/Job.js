const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Please provide the company name'],
    maxlenghth: [50, 'Company name cannot be more than 50 characters'],
  },
  positionName: {
    type: String,
    required: [true, 'Please provide the position name'],
    maxlenghth: [100, 'Position name cannot be more than 100 characters'],
  },
  status: {
    type: String,
    enum: ['interview', 'declined', 'pending'],
    default: 'pending',
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);