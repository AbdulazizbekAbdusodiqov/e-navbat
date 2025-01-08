const pool = require("../config/db")
const otpGenerator = require("otp-generator")
const { v4: uuidv4 } = require("uuid")
const errorHandler = require("../helpers/errorHandler")
const addMinutesToDate = require("../helpers/add_minutes")
const config = require("config")
const { encode, decode } = require("../services/crypt")
const Jwt = require("../services/jwt.service")
const bcrypt = require("bcrypt")
const DeviceDetector = require('node-device-detector');

const detector = new DeviceDetector({
    clientIndexes: true,
    deviceIndexes: true,
    deviceAliasCode: false,
    deviceTrusted: false,
    deviceInfo: true,
    maxUserAgentSize: 500,
});



const createOtp = async (req, res) => {
    try {

        const { phone_number } = req.body
        const otp = otpGenerator.generate(4, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        });

        const now = new Date()
        const expirationTime = addMinutesToDate(
            now,
            config.get("expiration_time")
        );

        const newOtp = await pool.query(
            `INSERT INTO otp(id, otp, expiration_time)
            VALUES($1, $2, $3)
            RETURNING *`,
            [uuidv4(), otp, expirationTime]
        )

        const details = {
            timestamp: now,
            phone_number,
            otp_id: newOtp.rows[0].id,
        }

        const encodedData = await encode(JSON.stringify(details))

        return res.send({ verification_key: encodedData })
    } catch (error) {
        errorHandler(error, res)
    }
}

const verifyOtpClient = async (req, res) => {
    try {
        const { verification_key, phone_number, otp } = req.body

        const currentTime = new Date();

        const decodedData = await decode(verification_key);
        const parserData = JSON.parse(decodedData);

        if (parserData.phone_number !== phone_number) {
            const response = {
                status: "Failed",
                Details: "OTP was not sent to this particular phone"
            }
            return res.status(400).send(response)
        }

        const otpResult = await pool.query(
            `SELECT * FROM otp
            WHERE id = $1`,
            [parserData.otp_id]
        )
        const result = otpResult.rows[0]
        // console.log(result);

        if (result == null) {
            const response = {
                status: "Failed",
                Details: "OTP not found"
            }
            return res.status(400).send(response)
        }
        // if (result.verified == true) {

        //     const response = {
        //         status: "Failed",
        //         Details: "OTP alread verified"
        //     }
        //     return res.status(400).send(response)
        // }

        if (result.expiration_time < currentTime) {

            const response = {
                status: "Failed",
                Details: "OTP  expired"
            }
            return res.status(400).send(response)
        }

        if (result.otp != otp) {

            const response = {
                status: "Failed",
                Details: "OTP not mutched"
            }
            return res.status(400).send(response)
        }

        await pool.query(
            `UPDATE otp
            SET verified = $2
            WHERE id = $1`,
            [result.id, true]
        );
        const clientResult = await pool.query(
            `SELECT * FROM clients
            WHERE phone_number = $1`,
            [phone_number]
        );

        let client_id, client_status;
        if (clientResult.rows.length == 0) {
            const newClient = await pool.query(
                `INSERT INTO clients(phone_number, otp_id, is_active)
                VALUES($1, $2, $3)
                RETURNING id`,
                [phone_number, result.id, true]
            );
            client_id = newClient.rows[0].id
            client_status = "new"
        }
        else {
            client_id = clientResult.rows[0].id
            client_status = "old"
        }

        await pool.query(
            `DELETE FROM otp 
            WHERE id = $1`,
            [parserData.otp_id]
        );


        const payload = {
            id: client_id,
            status: client_status,
            phone_number
        }

        const tokens = Jwt.generateTokens(payload)
        const hashedRefreshToken = bcrypt.hashSync(tokens.refreshToken, 7)
        const userAgent = req.headers["user-agent"]

        const resultAgent = detector.detect(userAgent);
        console.log('result parse', resultAgent);

        // DeviceHelper.isDesktop(resultAgent);

        await pool.query(
            `INSERT INTO tokens(table_name, user_id, user_os, user_device, user_browser, hashed_refresh_token)
            VALUES($1, $2, $3, $4, $5, $6)`,
            [
                "clients",
                client_id,
                resultAgent.os,
                resultAgent.devvice,
                userAgent.client,
                hashedRefreshToken
            ]
        );

        res.cookie("refreshToken", tokens.refreshToken, {
            maxAge: config.get("refresh_token_ms"),
            httpOnly : true 
        })

        const response = {
            status: "success",
            ClientStatus: client_status,
            ClientId: client_id,
            AccessToken: tokens.accessToken,
        };

        return res.status(200).send(response)

    } catch (error) {
        errorHandler(error, res)
    }
}


const verifyOtpSpecialist = async (req, res) => {
    try {
        const { verification_key, phone_number, otp } = req.body

        const currentTime = new Date();

        const decodedData = await decode(verification_key);
        const parserData = JSON.parse(decodedData);

        if (parserData.phone_number !== phone_number) {
            const response = {
                status: "Failed",
                Details: "OTP was not sent to this particular phone"
            }
            return res.status(400).send(response)
        }

        const otpResult = await pool.query(
            `SELECT * FROM otp
            WHERE id = $1`,
            [parserData.otp_id]
        )
        const result = otpResult.rows[0]

        if (result == null) {
            const response = {
                status: "Failed",
                Details: "OTP not found"
            }
            return res.status(400).send(response)
        }

        if (result.expiration_time < currentTime) {

            const response = {
                status: "Failed",
                Details: "OTP  expired"
            }
            return res.status(400).send(response)
        }

        if (result.otp != otp) {

            const response = {
                status: "Failed",
                Details: "OTP not mutched"
            }
            return res.status(400).send(response)
        }

        await pool.query(
            `UPDATE otp
            SET verified = $2
            WHERE id = $1`,
            [result.id, true]
        );
        const specialistResult = await pool.query(
            `SELECT * FROM specialist
            WHERE phone_number = $1`,
            [phone_number]
        );

        let specialist_id, specialist_status;
        if (specialistResult.rows.length == 0) {
            const newSpecialist = await pool.query(
                `INSERT INTO specialist(phone_number, otp_id, is_active)
                VALUES($1, $2, $3)
                RETURNING id`,
                [phone_number, result.id, true]
            );
            specialist_id = newSpecialist.rows[0].id
            specialist_status = "new"
        }
        else {
            specialist_id = specialistResult.rows[0].id
            specialist_status = "old"
        }

        await pool.query(
            `DELETE FROM otp 
            WHERE id = $1`,
            [parserData.otp_id]
        );

        const response = {
            status: "success",
            SpecialistStatus: specialist_status,
            SpecialistId: specialist_id
        }

        return res.status(200).send(response)

    } catch (error) {
        errorHandler(error, res)
    }
}




module.exports = {
    createOtp,
    verifyOtpClient,
    verifyOtpSpecialist,
}