const router = require("express").Router()

const clientRouter = require('./client.routes')
const specialistRouter = require('./specialist.routes')
const otpRouter = require("./otp.routes")
const specWorkDayRouter = require("./spec_working_day.routes")

router.use('/client', clientRouter)
router.use('/specialist', specialistRouter)
router.use('/otp', otpRouter)
router.use('/specworkingday', specWorkDayRouter)

module.exports = router;