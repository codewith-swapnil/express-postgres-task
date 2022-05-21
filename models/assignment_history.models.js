module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("assignment-history", {
      date: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
    });
    return User;
  };