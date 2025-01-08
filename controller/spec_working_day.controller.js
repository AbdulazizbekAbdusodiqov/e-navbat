const pool = require("../config/db")
const errorHandler = require("../helpers/errorHandler")

const createWorkingDaySpec = async (req, res) => {
    try {
        const {
            spec_id,
            day_of_week,
            start_time,
            finish_time,
            rest_start_time,
            rest_finish_time,
        } = req.body

        const newWorkDay = await pool.query(
            `INSERT INTO spec_working_day(spec_id,day_of_week,start_time, finish_time, rest_start_time, rest_finish_time)
            VALUES($1, $2, $3, $4, $5, $6)
            returning *`,
            [spec_id, day_of_week, start_time, finish_time, rest_start_time, rest_finish_time]
        )

        return res.status(201).send({ newWorkDay: newWorkDay.rows[0] });

    } catch (error) {
        errorHandler(error, res)
    }
}

const getSpecWorkingDays = async (req, res) => {
    try {

        const workingDays = await pool.query(
            `SELECT * FROM spec_working_day`
        );

        if (!workingDays.rows[0]) {
            return res.status(400).send({ message: "specialist working day not found" })
        };

        return res.status(200).send({ SpecialistWorkingDays: workingDays.rows })

    } catch (error) {
        errorHandler(error, res)
    }
}
const getSpecWorkingDayById = async (req, res) => {
    try {
        const id = req.params.id

        const workingDays = await pool.query(
            `SELECT * FROM spec_working_day
            WHERE id = $1`,
            [id]
        );

        if (!workingDays.rows[0]) {
            return res.status(400).send({ message: "specialist working day not found" })
        };

        return res.status(200).send({ SpecialistWorkingDay: workingDays.rows[0] })

    } catch (error) {
        errorHandler(error, res)
    }
}


const updateSpecWorkingDay = async (req, res) => {
    try {

        const id = req.params.id

        const {
            spec_id,
            day_of_week,
            start_time,
            finish_time,
            rest_start_time,
            rest_finish_time,
        } = req.body

        const updatedWorkingDay = await pool.query(
            `UPDATE spec_working_day
            SET spec_id = $1,
            day_of_week = $2,
            start_time = $3,
            finish_time = $4, 
            rest_start_time = $5, 
            rest_finish_time = $6
            WHERE id = $7
            RETURNING *`,
            [
                spec_id,
                day_of_week,
                start_time,
                finish_time,
                rest_start_time,
                rest_finish_time,
                id
            ]
        );

        return res.status(201).send({ updatedSpecWorkingDay: updatedWorkingDay.rows[0] })

    } catch (error) {
        errorHandler(error, res)
    }
}


const deleteSpecWorkingDay = async (req, res) => {
    try {

        const id = req.params.id


        const deletedWorkingDay = await pool.query(
            `DELETE FROM spec_working_day
            WHERE id = $1
            RETURNING *`,
            [id]
        );

        return res.status(201).send({ deleteedSpecWorkingDay: deletedWorkingDay.rows[0] })

    } catch (error) {
        errorHandler(error, res)
    }
}

module.exports = {
    createWorkingDaySpec,
    getSpecWorkingDays,
    getSpecWorkingDayById,
    updateSpecWorkingDay,
    deleteSpecWorkingDay
}