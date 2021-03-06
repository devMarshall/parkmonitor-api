/**
 * AuthController
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
  signup: async (req, res) => {
    try {
      const { email } = req.body;
      const user_exists = await User.findOne({ email });
      if (user_exists) return ResponseHelper.json(400, res, 'Email already taken');
      let user = await User.create({ ...req.body }).fetch();
      user = { ...user };
      delete user.password;
      const token = TokenService.sign({ user });
      return ResponseHelper.json(201, res, 'User registered successfully', { user, token });
    } catch (e) {
      return ResponseHelper.error(e, res);
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const errors = [];

      if (!email)
        errors.push({
          field: 'email',
          rules: [['required', 'Email is required']],
        });

      if (!password)
        errors.push({
          field: 'password',
          rules: [['required', 'Password is required']],
        });

      if (errors.length > 0) return ResponseHelper.customError(res, errors);

      const user = await User.findOne({ email });
      if (!user) return ResponseHelper.json(401, res, 'Invalid user credentials');
      const is_valid = await Bcrypt.compare(password, user.password);
      if (!is_valid) return ResponseHelper.json(401, res, 'Invalid user credentials');
      const token = TokenService.sign({ user });
      return ResponseHelper.json(200, res, 'User logged in successfully', {
        user,
        token,
      });
    } catch (e) {
      return ResponseHelper.error(e, res);
    }
  },
};
