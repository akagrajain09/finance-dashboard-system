const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  type: { 
    type: String, 
    enum: ['income', 'expense'], 
    required: true 
  },
  category: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  notes: { type: String },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Record', RecordSchema);
