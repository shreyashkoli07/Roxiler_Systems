const { Rating, Store, sequelize } = require('../models');

exports.submitOrUpdateRating = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const user_id = req.user.id;
    const { store_id, rating, comment } = req.body;

    let existing = await Rating.findOne({
      where: { user_id, store_id },
      transaction: t
    });

    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
      await existing.save({ transaction: t });
    } else {
      existing = await Rating.create(
        { user_id, store_id, rating, comment },
        { transaction: t }
      );
    }

    // Recalculating store average
    const ratings = await Rating.findAll({ where: { store_id }, transaction: t });

    const avg =
      ratings.reduce((a, b) => a + b.rating, 0) / ratings.length;

    await Store.update(
      { average_rating: avg },
      { where: { id: store_id }, transaction: t }
    );

    await t.commit();
    res.json(existing);

  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
