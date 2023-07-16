const Orders = require('../../api/v1/orders/model');

const getAllOrders = async (req) => {
  const { limit = 10, page = 1, startDate, endDate } = req.query;//di beri pagination limit 10
  let condition = {};

  if (req.user.role !== 'owner') {
    condition = { ...condition, 'historyEvent.organizer': req.user.organizer };
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59);//set jam agar tidak error
    condition = {
      ...condition,
      date: {
        $gte: start, //lebih dari
        $lt: end,//kurang dari
      },
    };
  }

  const result = await Orders.find(condition)//untuk limit data
    .limit(limit)
    .skip(limit * (page - 1));

  const count = await Orders.countDocuments(condition);

  return { data: result, pages: Math.ceil(count / limit), total: count };
};

module.exports = {
  getAllOrders,
};
