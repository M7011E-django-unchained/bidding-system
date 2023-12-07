module.exports = {
  authorize: () => {
    return "token";
  },
  isAuthorized: (secret) => secret === "wizard",
};
