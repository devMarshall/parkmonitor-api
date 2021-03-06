/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  _config: {
    actions: false,
    shortcuts: false,
    rest: false,
  },
  read: async (req, res) => {
    try {
      const { id } = req.user;
      const user = await User.findOne(id);
      if (!user) return ResponseHelper.json(404, res, 'Unable to retrieve user ');
      return ResponseHelper.json(200, res, 'User retrieved successfully', user);
    } catch (e) {
      return ResponseHelper.error(e, res);
    }
  },
  list: async (req, res) => {
    try {
      const { per_page, page: _page } = req.query;
      const perPage = per_page || 20;
      const page = _page || 1;
      const skip = perPage * (page - 1);
      const records = await User.find({ limit: perPage, skip });
      const count = await User.count();
      const meta = {
        page,
        prev_page: page > 1 ? page - 1 : false,
        per_page: perPage,
        next_page: count - (skip + perPage) > 0 ? page + 1 : false,
        page_count: Math.ceil(count / perPage),
        total: count,
      };
      return ResponseHelper.json(200, res, 'Users retrieved successfully', records, meta);
    } catch (e) {
      return ResponseHelper.error(e, res);
    }
  },
};
