const { Rating, Store, sequelize } = require('../index'); // UPDATED PATH

exports.submitOrUpdateRating = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const user_id = req.user.id;
    const { store_id, rating, comment } = req.body;

    if (!store_id || rating === undefined)
      return res.status(400).json({ message: "store_id and rating are required" });

    const ratingValue = Number(rating);

    // Validate rating range (1–5)
    if (ratingValue < 1 || ratingValue > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Check if rating exists
    let existing = await Rating.findOne({
      where: { user_id, store_id },
      transaction: t
    });

    if (existing) {
      existing.rating = ratingValue;
      existing.comment = comment || "";
      await existing.save({ transaction: t });
    } else {
      existing = await Rating.create(
        { user_id, store_id, rating: ratingValue, comment: comment || "" },
        { transaction: t }
      );
    }

    // Recalculate store average rating
    const ratings = await Rating.findAll({
      where: { store_id },
      transaction: t
    });

    const avg =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + Number(r.rating), 0) / ratings.length
        : 0;

    await Store.update(
      { average_rating: Number(avg.toFixed(2)) },
      { where: { id: store_id }, transaction: t }
    );

    await t.commit();
    return res.json({
      message: existing._options.isNewRecord ? "Rating submitted" : "Rating updated",
      rating: existing
    });

  } catch (err) {
    await t.rollback();
    console.error("submitOrUpdateRating error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
