
const { Store, Rating, User } = require('../models');

exports.getOwnerRatings = async (req, res) => {
  try {
    const ownerId = Number(req.params.ownerId);

    // Fetching all stores of this owner with ratings + user info
    const stores = await Store.findAll({
      where: { owner_id: ownerId },
      include: [
        {
          model: Rating,
          as: "ratings",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "email"]
            }
          ]
        },
        {
          model: User,
          as: "owner",
          attributes: ["id", "name"]
        }
      ]
    });

    // response
    const result = stores.map(store => {
      const ratings = Array.isArray(store.ratings)
        ? store.ratings.map(r => ({
          id: r.id,
          user_id: r.user?.id ?? null,
          user_name: r.user?.name ?? "Unknown",
          email: r.user?.email ?? "",
          rating: Number(r.rating) || 0,
          comment: r.comment ?? "",
          created_at: r.createdAt ?? null
        }))
        : [];

      const avg = ratings.length
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : null;

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        owner_name: store.owner?.name ?? null,
        average: avg !== null ? Number(avg.toFixed(2)) : null,
        ratings
      };
    });

    return res.json({ stores: result });

  } catch (err) {
    console.error("getOwnerRatings error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
