const config = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.employee = require("../models/employee.models.js")(sequelize, Sequelize);
db.task = require("../models/task.models.js")(sequelize, Sequelize);
db.assignmentHistory= require("../models/assignment_history.models.js")(sequelize, Sequelize);
db.employeeOfDay= require("../models/employee_of_day.models.js")(sequelize, Sequelize);
db.assignmentHistory.belongsTo(db.employee, {
  foreignKey: "employeeId",
  as: "employee",
});
db.assignmentHistory.belongsTo(db.task, {
  foreignKey: "taskId",
  as: "task",
});
db.ROLES = ["user", "admin", "moderator"];
module.exports = db;