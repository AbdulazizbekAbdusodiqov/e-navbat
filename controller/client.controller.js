const pool = require("../config/db")
const errorHandler = require("../helpers/errorHandler")
const DeviceDetector = require('node-device-detector');
const DeviceHelper = require('node-device-detector/helper');

const detector = new DeviceDetector({
    clientIndexes: true,
    deviceIndexes: true,
    deviceAliasCode: false,
    deviceTrusted: false,
    deviceInfo: true,
    maxUserAgentSize: 500,
});


const createClient = async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            phone_number,
            info,
            photo
        } = req.body

        const newClient = await pool.query(
            `INSERT INTO clients(first_name, last_name, phone_number, info, photo)
            VALUES($1, $2, $3, $4, $5) RETURNING *`,
            [first_name, last_name, phone_number, info, photo]
        );

        console.log(newClient);
        return res.status(201).send(newClient.rows[0])

    } catch (error) {
        errorHandler
    }
}

const getClients = async (req, res) => {
    try {

        const userAgent = req.headers["user-agent"]
        
        const result = detector.detect(userAgent);
        console.log('result parse', result);
        
        DeviceHelper.isDesktop(result);
        
        const clients = await pool.query(
            `SELECT * FROM clients`
        )
        if (!clients.rows[0]) {
            return res.status(400).send({ message: "client not found" });
        }
        return res.status(200).send({ clients: clients.rows })
    } catch (error) {
        errorHandler(error, res)
    }
}

const getClientById = async (req, res) => {
    try {
        const id = req.params.id

        const client = await pool.query(
            `SELECT * FROM clients
            WHERE id = $1`, [id]
        )
        if (!client.rows[0]) {
            return res.status(400).send({ message: "client not found" });
        }
        return res.status(200).send({ client: client.rows[0] })
    } catch (error) {
        errorHandler(error, res)
    }
}

const updateClient = async (req, res) => {
    try {

        const id = req.params.id

        const {
            first_name,
            last_name,
            phone_number,
            info,
            photo
        } = req.body

        const updatedClient = await pool.query(
            `UPDATE clients
            SET first_name = $1,
            last_name = $2,
            phone_number = $3,
            info = $4,
            photo = $5
            WHERE id = $6
            RETURNING *`,
            [first_name, last_name, phone_number, info, photo, id]
        );
        if (!updatedClient.rows[0]) {
            return res.status(400).send({ message: "client not found" })
        }

        res.status(200).send({ message: "updated successfully", client: updatedClient.rows[0] })

    } catch (error) {
        errorHandler(error, res)
    }
}

const deleteClient = async (req, res) => {
    try {

        const id = req.params.id

        const deletedClient = await pool.query(
            `DELETE FROM clients
            WHERE id = $1
            RETURNING *`,
            [id]
        );
        if (!deletedClient.rows[0]) {
            return res.status(400).send({ message: "client not found" })
        }

        res.status(200).send({ message: "deleted successfully", client: deletedClient.rows[0] })

    } catch (error) {
        errorHandler(error, res)
    }
}

module.exports = {
    createClient,
    getClients,
    getClientById,
    updateClient,
    deleteClient
}