const pool = require("../config/db")
const errorHandler = require("../helpers/errorHandler")
const bcrypt = require("bcrypt")
const mailService = require("../services/mail.service")

const createAdmin = async(req, res) => {
    try {
        
        const {
            name,
            phone_number,
            email,
            password,
            is_active,
            is_creator   
        } = req.body

        await mailService.sendMailActivationCode(email);

        const oldAdmin = await pool.query(
            `SELECT id FROM admin
            WHERE email = $1`,
            [email]
        );
        if(oldAdmin.rows[0]){
            return res.status(400).send({message : "bu email bilan oldin ro'yxatdan o'tilgan"})
        }

        const hashedPassword = bcrypt.hashSync(password, 7)
        
        const newAdmin = await pool.query(
            `INSERT INTO admin(name, phone_number,email,hashed_passowrd, is_active, is_creator)
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [name, phone_number, email, hashedPassword, is_active, is_creator]
        )

        return res.status(201).send(newAdmin.rows[0])


    } catch (error) {
        errorHandler(error, res)
    }
}


module.exports = {
    createAdmin,

}