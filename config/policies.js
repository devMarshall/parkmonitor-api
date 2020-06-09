/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {
  // '*': true,

  AuthController: {
    signup: true,
    login: true,
  },

  UserController: {
    read: ['isAuthorized'], // We dont need authorization here, allowing public access
  },
};
