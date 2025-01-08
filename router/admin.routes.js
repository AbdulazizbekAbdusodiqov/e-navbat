const router = require("express").Router()

router.post("/create");
router.get("/");
router.get("/:id");
router.put("/:id");
router.delete("/:id");

module.exports = router;