const Record = require('../models/Record');

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
// @access  Private (All Roles)
const getDashboardSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let matchStage = {};

    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) matchStage.date.$gte = new Date(startDate);
      if (endDate) matchStage.date.$lte = new Date(endDate);
    }

    // Single aggregation pipeline for all basic stats
    const stats = await Record.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] }
          },
          totalExpense: {
            $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] }
          }
        }
      }
    ]);

    const totals = stats.length > 0 ? stats[0] : { totalIncome: 0, totalExpense: 0 };
    const netBalance = totals.totalIncome - totals.totalExpense;

    // Category breakdown
    const categoryTotals = await Record.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { type: '$type', category: '$category' },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { total: -1 } }
    ]);

    const categories = { income: [], expense: [] };
    categoryTotals.forEach(item => {
      if (item._id.type) {
        categories[item._id.type].push({ category: item._id.category, total: item.total });
      }
    });

    // Recent activity (last 5 records)
    const recentActivity = await Record.find(matchStage)
      .sort({ date: -1, createdAt: -1 })
      .limit(5);

    res.json({
      totalIncome: totals.totalIncome,
      totalExpense: totals.totalExpense,
      netBalance,
      categories,
      recentActivity
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardSummary
};
