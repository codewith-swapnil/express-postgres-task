module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("employee", {
      name: {
        type: Sequelize.STRING
      },
      designation: {
        type: Sequelize.STRING
      },
    });
    return User;
  };