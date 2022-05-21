module.exports = app => {
    const assignment_history = require("../controller/assignment_history.controller.js");
    var router = require("express").Router();
    const { authJwt } = require("../middleware");
    // Create a new Tutorial
    router.post("/", assignment_history.create);
    router.post("/week-month", assignment_history.findEmployeeWeekMonth);
    // Retrieve all Tutorials
    router.get("/", assignment_history.findAll);
    //create xlsx on server
    router.get("/", assignment_history.createxlsx);
    // Retrieve all published Tutorials
    router.get("/published", assignment_history.findAllPublished);
    // Retrieve a single Tutorial with id
    router.get("/:id", assignment_history.findOne);
    // Update a Tutorial with id
    router.put("/:id", assignment_history.update);
    // Delete a Tutorial with id
    router.delete("/:id", assignment_history.delete);
    // Create a new Tutorial
    router.delete("/", assignment_history.deleteAll);
    app.use('/api/assignment_history', router);
  };