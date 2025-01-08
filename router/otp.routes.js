const { createOtp, verifyOtpClient, deleteOtp, verifyOtpSpecialist } = require("../controller/otp.controller");

const router = require("express").Router()

router.post("/", createOtp); //create
router.post("/verifyclient", verifyOtpClient); //verify client
router.post("/verifyspecialist", verifyOtpSpecialist); //verify specialist

module.exports = router;