const Employee = require("../models/Employee");
const router = require("express").Router();
const { employeeValidation } = require("../validation");
const verify = require("../routes/verifyToken");
const validateObjectId = require("../validateObjectId");
const admin = require("./admin");

router.get("/", (req, res) => {
  Employee.find((err, employees) => res.send(employees));
});

router.post("/", [verify, admin], async (req, res) => {
  const { error } = employeeValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const employee = new Employee({
    picture: req.body.picture,
    position: req.body.position,
    fullName: req.body.fullName,
    email: req.body.email
  });

  await employee.save();

  res.send(employee);
});

router.put("/:id", [validateObjectId, verify, admin], async (req, res) => {
  const { error } = employeeValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const employee = await Employee.findByIdAndRemove(req.params.id);

  const newEmployee = new Employee({
    picture: req.body.picture,
    position: req.body.position,
    fullName: req.body.fullName,
    email: req.body.email
  });

  await newEmployee.save();

  res.send(newEmployee);
});

router.get("/:id", async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee)
    return res.status(404).send("The employee with the given ID was not found.");

  res.send(employee);
});

router.delete("/:id", [validateObjectId, verify, admin], async (req, res) => {
  try {
    const employee = await Employee.findByIdAndRemove(req.params.id);
    res.send(employee);
  } catch (error) {
    if (error)
      return res.status(404).send("The employee with the given ID was not found.");
  }
});

module.exports = router;
