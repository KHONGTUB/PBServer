const express = require("express");
const router = express.Router();
const recordController = require("../controllers/recordController");

router.get("/:id", recordController.getUserRecord);

router.post("/newspecies", recordController.addSpecies);

router.put("/:id/:species/:postid/picture", recordController.addPicture);

router.post("/newcatch", recordController.addCatch);

module.exports = router;
