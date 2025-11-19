const { Store, Rating, User } = require('../index'); // <-- FIXED: matches new folder structure

exports.getOwnerRatings = async (req, res) => {
  try {
    const ownerId = Number(req.params.ownerId);

    if (!ownerId)
      return res.status(400).json({ message: "Invalid ownerId" });

    // Fetch all stores of the owner including ratings + respective user info
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

    // Create the final response structure
    const result = stores.map(store => {
      const ratingsArray = Array.isArray(store.ratings) ? store.ratings : [];

      const ratings = ratingsArray.map(r => ({
        id: r.id,
        user_id: r.user?.id || null,
        user_name: r.user?.name || "Unknown",
        email: r.user?.email || "",
        rating: Number(r.rating) || 0,
        comment: r.comment || "",
        created_at: r.createdAt || null
      }));

      const avgRating =
        ratings.length > 0
          ? Number(
              (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(2)
            )
          : null;

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        owner_name: store.owner?.name || null,
        average: avgRating,
        ratings
      };
    });

    return res.json({ stores: result });

  } catch (err) {
    console.error("getOwnerRatings error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
