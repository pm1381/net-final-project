let express = require('express');
let router = express.Router();

// Require controller modules.
const pfm_controller = require("../controllers/pfmController");

router.get("/cart-details", pfm_controller.notes_list);


module.exports = router;
