module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("task", {
      task: {
        type: Sequelize.STRING
      },
      desc: {
        type: Sequelize.STRING
      },
    });
    return User;
  };