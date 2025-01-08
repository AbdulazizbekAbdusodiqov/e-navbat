const pool = require("../config/db")
const errorHandler = require("../helpers/errorHandler")

const createSpecialist = async (req, res) => {
    try {
        const {
            position,
            last_name,
            first_name,
            middle_name,
            brith_day,
            photo,
            phone_number,
            info,
            is_active,
            show_position,
            show_last_name,
            show_middle_name,
            show_photo,
            show_social,
            show_info,
            show_brith_day,
            show_phone_number,
            otp_id
        } = req.body



        const newSpecialist = await pool.query(
            `INSERT INTO specialist(
            position,
            last_name,
            first_name,
            middle_name,
            brith_day,
            photo,
            phone_number,
            info,
            is_active,
            show_position,
            show_last_name,
            show_middle_name,
            show_photo,
            show_social,
            show_info,
            show_brith_day,
            show_phone_number,
            otp_id)
            VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) 
            RETURNING *`,
            [
                position,
                last_name,
                first_name,
                middle_name,
                brith_day,
                photo,
                phone_number,
                info,
                is_active,
                show_position,
                show_last_name,
                show_middle_name,
                show_photo,
                show_social,
                show_info,
                show_brith_day,
                show_phone_number,
                otp_id
            ]
        );

        console.log(newSpecialist);

        return res.status(201).send({ ok: true, newSpecialist : newSpecialist.rows[0] })

    } catch (error) {
        errorHandler(error, res)
    }
}

const getSpecialists = async (req, res) => {
    try {
        const specialists = await pool.query(
            `SELECT * FROM specialist`
        )
        if (!specialists.rows[0]) {
            return res.status(400).send({ message: "Specialist not found" })
        }

        return res.status(200).send(specialists.rows)


    } catch (error) {
        errorHandler()
    }
}

const getSpecialistById = async (req, res) => {
    try {
        const id = req.params.id

        const specialists = await pool.query(
            `SELECT * FROM specialist
            WHERE id = $1`,
            [id]
        );

        if (!specialists.rows[0]) {
            return res.status(400).send({ message: "Specialist not found" })
        }

        return res.status(200).send({ Specialist: specialists.rows[0] });

    } catch (error) {
        errorHandler()
    }
}


const updateSpecialist = async (req, res) => {
    try {
        const id = req.params.id

        const {
            position,
            last_name,
            first_name,
            middle_name,
            brith_day,
            photo,
            phone_number,
            info,
            is_active,
            show_position,
            show_last_name,
            show_middle_name,
            show_photo,
            show_social,
            show_info,
            show_brith_day,
            show_phone_number,
            otp_id
        } = req.body



        const updatedSpecialist = await pool.query(
            `UPDATE specialist
            SET position = $1,
            last_name = $2,
            first_name = $3,
            middle_name = $4,
            brith_day = $5,
            photo = $6,
            phone_number = $7,
            info = $8,
            is_active = $9,
            show_position = $10,
            show_last_name = $11,
            show_middle_name = $12,
            show_photo = $13,
            show_social = $14,
            show_info = $15,
            show_brith_day = $16,
            show_phone_number = $17 ,
            otp_id = $18
            WHERE id = $19
            RETURNING *`,
            [
                position,
                last_name,
                first_name,
                middle_name,
                brith_day,
                photo,
                phone_number,
                info,
                is_active,
                show_position,
                show_last_name,
                show_middle_name,
                show_photo,
                show_social,
                show_info,
                show_brith_day,
                show_phone_number,
                otp_id,
                id
            ]
        );

        console.log(updatedSpecialist);

        return res.status(201).send({ ok: true, updateSpecialist: updatedSpecialist })

    } catch (error) {
        console.log(error);
        
        errorHandler(error, res)
    }
}

const deleteSpecialist = async (req, res) => {
    try {

        const id = req.params.id

        const delSpec = await pool.query(
            `DELETE FROM specialist
            WHERE id = $1
            RETURNING *`,
            [id]
        );

        if (!delSpec.rows[0]) {
            return res.status(400).send({ message: "Specialist not found" })
        }

        return res.status(200).send({ message: "deleted successfully", specialist: delSpec.rows[0] })

    } catch (error) {
        errorHandler(error, res)
    }
}


module.exports = {
    createSpecialist,
    getSpecialists,
    getSpecialistById,
    updateSpecialist,
    deleteSpecialist
}