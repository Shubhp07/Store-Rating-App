const sequelize = require('../config/db');

// GET /owner/dashboard
const getDashboard = async (req, res) => {
  try {
    // Get store owned by this user
    const [store] = await sequelize.query(
      `SELECT id, name, email, address FROM stores WHERE owner_id = $1`,
      { bind: [req.user.id], type: sequelize.QueryTypes.SELECT }
    );

    if (!store) return res.status(404).json({ message: 'No store found for this owner' });

    // Get average rating
    const [ratingData] = await sequelize.query(
      `SELECT ROUND(AVG(rating), 2) AS average_rating, COUNT(*) AS total_ratings
       FROM ratings WHERE store_id = $1`,
      { bind: [store.id], type: sequelize.QueryTypes.SELECT }
    );

    // Get list of users who rated
    const raters = await sequelize.query(
      `SELECT u.id, u.name, u.email, r.rating, r.updated_at AS rated_at
       FROM ratings r
       JOIN users u ON u.id = r.user_id
       WHERE r.store_id = $1
       ORDER BY r.updated_at DESC`,
      { bind: [store.id], type: sequelize.QueryTypes.SELECT }
    );

    return res.status(200).json({
      store,
      average_rating: ratingData.average_rating || 0,
      total_ratings:  parseInt(ratingData.total_ratings),
      raters
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getDashboard };