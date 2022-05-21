const db = require("../models");
const taskModels = require("../models/task.models");
const pool = require('../config/quires')
const Task = db.task;
const Op = db.Sequelize.Op;
// Create and Save a new Task
exports.create = (req, res) => {
  // Validate request
  if (!req.body.task) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  // Create a Task
  const task = {
    task: req.body.task,
    desc: req.body.desc
  };
  // Save Task in the database
  
  Task.create(task)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Task.",
      });
    });
};
// Retrieve all Tasks from the database.
exports.findAll = (req, res) => {
  const title = req.query.task;
  var condition = Task ? { task: { [Op.iLike]: `%${task}%` } } : null;
  // pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
  //   if (error) {
  //     throw error
  //   }
  //   res.status(200).json(results.rows)
  // })
  Task.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tasks.",
      });
    });
};
// Find a single Task with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Task.findByPk(id,)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Task with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Task with id=" + id,
      });
    });
};
// Update a Task by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Task.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        Task.findByPk(id).then((data) => {
          if (data) {
            res.send({
              message: "Task was updated successfully.",
              data: data,
            });
          } else {
            res.status(404).send({
              message: `Cannot find Task with id=${id}.`,
            });
          }
        });
      } else {
        res.send({
          message: `Cannot update Task with id=${id}. Maybe Task was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Task with id=" + id,
      });
    });
};
// Delete a Task with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Task.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Task was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Task with id=${id}. Maybe Task was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Task with id=" + id,
      });
    });
};
// Delete all Tasks from the database.
exports.deleteAll = (req, res) => {
  Task.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Tasks were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tasks.",
      });
    });
};
// Find all published Tasks
exports.findAllPublished = (req, res) => {
  Task.findAll({ where: { published: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tasks.",
      });
    });
};
