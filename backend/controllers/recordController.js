const Record = require('../models/Record');

// @desc    Get all records
// @route   GET /api/records
// @access  Private
const getRecords = async (req, res) => {
  try {
    const { type, category, startDate, endDate, limit, page } = req.query;
    
    let query = {};
    if (type) query.type = type;
    if (category) query.category = category;
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 50;
    const skip = (pageNum - 1) * limitNum;

    const records = await Record.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('createdBy', 'name email');

    const total = await Record.countDocuments(query);

    res.json({
      records,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a record
// @route   POST /api/records
// @access  Private/Admin
const createRecord = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    if (!amount || !type || !category) {
      return res.status(400).json({ message: 'Please provide amount, type, and category' });
    }

    const record = await Record.create({
      amount,
      type,
      category,
      date: date || Date.now(),
      notes,
      createdBy: req.user.id
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a record
// @route   PUT /api/records/:id
// @access  Private/Admin
const updateRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    const updatedRecord = await Record.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a record
// @route   DELETE /api/records/:id
// @access  Private/Admin
const deleteRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    await record.deleteOne();
    res.json({ id: req.params.id, message: 'Record deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRecords,
  createRecord,
  updateRecord,
  deleteRecord
};
