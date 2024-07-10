let express = require('express');
let router = express.Router();

// Require controller modules.
const note_controller = require("../controllers/noteController");

router.get("/", note_controller.index);

// POST request for creating note.
router.post("/create", note_controller.note_create_post);

// GET request for creating note.
router.get("/create", note_controller.note_create_get);

// GET request to view note detail.
router.get("/:id/view", note_controller.note_detail);

// GET request to list notes.
router.get("/list", note_controller.notes_list);

// POST request to search between authors
router.post("/search", note_controller.notes_search)

//Post request (or delete) to delete a request. seroiusly why get!!!
router.get('/:id/delete', note_controller.notes_delete)

//Get for watching a note details
router.get('/:id/edit', note_controller.note_manage)

//Post for submiting edit request
router.post('/edit', note_controller.note_edit_post)

module.exports = router;
