const {
    createWorkingDaySpec,
    getSpecWorkingDays,
    getSpecWorkingDayById,
    updateSpecWorkingDay,
    deleteSpecWorkingDay
} = require("../controller/spec_working_day.controller");

const router = require("express").Router()

router.post("/", createWorkingDaySpec);
router.get("/", getSpecWorkingDays);
router.get("/:id", getSpecWorkingDayById);
router.put("/:id", updateSpecWorkingDay);
router.delete("/:id", deleteSpecWorkingDay);

module.exports = router;