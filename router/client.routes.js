const { createClient, getClients, getClientById, updateClient, deleteClient } = require("../controller/client.controller")

const router = require("express").Router()

router.post("/create", createClient);
router.get("/", getClients);
router.get("/:id", getClientById);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

module.exports = router;