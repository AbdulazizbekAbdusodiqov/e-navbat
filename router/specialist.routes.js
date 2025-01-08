const { createSpecialist, getSpecialists, getSpecialistById, updateSpecialist, deleteSpecialist } = require("../controller/specialist.controller");

const router = require("express").Router()

router.post("/", createSpecialist);
router.get("/", getSpecialists);
router.get("/:id", getSpecialistById);
router.put("/:id", updateSpecialist);
router.delete("/:id", deleteSpecialist);

module.exports = router;