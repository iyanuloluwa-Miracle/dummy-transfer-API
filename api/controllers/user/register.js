const bcrypt = require("bcrypt");

async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

module.exports = {
  friendlyName: "Register",
  description: "Register user.",
  inputs: {
    name: {
      type: "string",
      required: true,
    },
    email: {
      type: "string",
      required: true,
      unique: true,
      isEmail: true,
    },
    password: {
      type: "string",
      required: true,
    }
  },
  exits: {
    success: {
      description: "User successfully registered.",
    },
    badRequest: {
      description: "Invalid email or password.",
      responseType: "badRequest",
    },
    serverError: {
      description: "An error occurred while processing the request.",
      responseType: "serverError",
    },
  },
  fn: async function (inputs, exits) {
    try {
      const { name, email, password } = inputs;
      const newEmail = email.toLowerCase();
      const hashedPassword = await hashPassword(password);
      const newUser = {
        id: await sails.helpers.uuidGenerator(), // Generate a UUID for the user
        name,
        email: newEmail,
        password: hashedPassword,
      };
      const user = await User.create(newUser).fetch();
      await Wallet.create({ id:await sails.helpers.uuidGenerator(), user: user.id });
      return exits.success(user);
    } catch (error) {
      return exits.serverError(error);
    }
  },
};
