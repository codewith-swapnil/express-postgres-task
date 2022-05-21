const db = require("../models");
const assignmentHistoryModels = require("../models/assignment_history.models");
const pool = require("../config/quires");
const XLSX = require("xlsx");
const { status } = require("express/lib/response");
const AssignmentHistory = db.assignmentHistory;
const Employee = db.employee;
const EmployeeOfDay = db.employeeOfDay;
const Op = db.Sequelize.Op;
const cron = require("node-cron");
const { employeeOfDay } = require("../models");

cron.schedule("0 0 * * *", () => {
  try {
    pool.query(
      `SELECT "employeeId", COUNT(status) FROM "assignment-histories" AS "assignment-history" WHERE "assignment-history"."status" = 'done' AND "assignment-history"."date" = '2-11-21' GROUP BY "employeeId" ORDER BY COUNT DESC `,
      (error, results) => {
        if (error) {
          throw error;
        }
        Employee.findByPk(results.rows[0].employeeId)
          .then((data) => {
            if (data) {
              let employeeOfDay = {
                emp_name: data.name,
                designation: data.designation,
                complete_task: results.rows[0].count,
              };
              EmployeeOfDay.create(employeeOfDay)
                .then((data) => {
                  res.status(200).json(data);
                })
                .catch((err) => {
                  res.status(500).send({
                    message:
                      err.message ||
                      "Some error occurred while creating the AssignmentHistory.",
                  });
                });
             
            } else {
              res.status(404).send({
                message: `Cannot find AssignmentHistory with id=${id}.`,
              });
            }
          })
          .catch((err) => {
            res.status(500).send({
              message: "Error retrieving AssignmentHistory with id=" + id,
            });
          });
      }
    );
  } catch (error) {
    console.log(error);
  }
});
// Create and Save a new AssignmentHistory
exports.create = (req, res) => {
  // Validate request
  if (!req.body.status) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  // Create a AssignmentHistory
  const assignmentHistory = {
    date: req.body.date,
    status: req.body.status,
    employeeId: req.body.employeeId,
    taskId: req.body.taskId,
  };
  // Save AssignmentHistory in the database

  AssignmentHistory.create(assignmentHistory)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the AssignmentHistory.",
      });
    });
};
// Retrieve all AssignmentHistorys from the database.
exports.findAll = (req, res) => {
  const employeeId = req.query.employeeId;
  var condition = employeeId
    ? { employeeId: { [Op.iLike]: `%${employeeId}%` } }
    : null;
  
  AssignmentHistory.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving assignmentHistorys.",
      });
    });
};
exports.createxlsx = async (req, res) => {
  const employeeId = req.query.employeeId;
  var condition = employeeId
    ? { employeeId: { [Op.iLike]: `%${employeeId}%` } }
    : null;
  // pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
  //   if (error) {
  //     throw error
  //   }
  //   res.status(200).json(results.rows)
  // })
  await AssignmentHistory.findAll({ where: { employeeId: employeeId } })
    .then((data) => {
      let values = [];
      data.forEach((element) => {
        values.push(element._previousDataValues);
      });
      const worksheet = XLSX.utils.json_to_sheet(values);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "task");
      XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
      // XLSX.write(workbook,{bookType:"xlsx",type:"binary"});
      XLSX.writeFile(workbook, "taskData.xlsx");
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving assignmentHistorys.",
      });
    });
};
// Find a single AssignmentHistory with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  AssignmentHistory.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find AssignmentHistory with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving AssignmentHistory with id=" + id,
      });
    });
};
exports.findEmployeeWeekMonth = (req, res) => {
  const id = req.params.id;
  pool.query(` SELECT "employeeId", COUNT(status) FROM "assignment-histories" AS "assignment-history" WHERE "assignment-history"."status" = 'done' AND "assignment-history"."date" >= ${START} GROUP BY "employeeId" ORDER BY COUNT DESC `, (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).json(results.rows)
    })
};
// Update a AssignmentHistory by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  AssignmentHistory.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        AssignmentHistory.findByPk(id).then((data) => {
          if (data) {
            res.send({
              message: "AssignmentHistory was updated successfully.",
              data: data,
            });
          } else {
            res.status(404).send({
              message: `Cannot find AssignmentHistory with id=${id}.`,
            });
          }
        });
      } else {
        res.send({
          message: `Cannot update AssignmentHistory with id=${id}. Maybe AssignmentHistory was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating AssignmentHistory with id=" + id,
      });
    });
};
// Delete a AssignmentHistory with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  AssignmentHistory.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "AssignmentHistory was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete AssignmentHistory with id=${id}. Maybe AssignmentHistory was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete AssignmentHistory with id=" + id,
      });
    });
};
// Delete all AssignmentHistorys from the database.
exports.deleteAll = (req, res) => {
  AssignmentHistory.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({
        message: `${nums} AssignmentHistorys were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while removing all assignmentHistorys.",
      });
    });
};
// Find all published AssignmentHistorys
exports.findAllPublished = (req, res) => {
  AssignmentHistory.findAll({ where: { published: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving assignmentHistorys.",
      });
    });
};
