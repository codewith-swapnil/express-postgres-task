module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("employee-of-day", {
      emp_name: {
        type: Sequelize.STRING
      },
      designation: {
        type: Sequelize.STRING
      },
      complete_task: {
        type: Sequelize.STRING
      },
    });
    return User;
  };