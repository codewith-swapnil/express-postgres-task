module.exports = app => {
    const employee = require("../controller/employee.controller.js");
    var router = require("express").Router();
    const { authJwt } = require("../middleware");
    // Create a new Tutorial
    router.post("/", employee.create);
    // Retrieve all Tutorials
    router.get("/", employee.findAll);
    // Retrieve all published Tutorials
    router.get("/published", employee.findAllPublished);
    // Retrieve a single Tutorial with id
    router.get("/:id", employee.findOne);
    // Update a Tutorial with id
    router.put("/:id", employee.update);
    // Delete a Tutorial with id
    router.delete("/:id", employee.delete);
    // Create a new Tutorial
    router.delete("/", employee.deleteAll);
    app.use('/api/employee', router);
  };