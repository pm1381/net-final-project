const asyncHandler = require("express-async-handler");
const { connection } = require('../app');

exports.notes_list = asyncHandler(async (req, res, next) => {
    //res.send("NOT IMPLEMENTED: notes list");
});
