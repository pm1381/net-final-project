var connection  = require('../db/context');
const asyncHandler = require("express-async-handler");

exports.edit = asyncHandler(async (req, res, next) => {
    //res.send("NOT IMPLEMENTED: notes list");
    console.log(connection.query)
});

exports.delete = asyncHandler(async (req, res, next) => {
    //res.send("NOT IMPLEMENTED: notes list");
    console.log(connection.query)
});

exports.linear_chart = asyncHandler(async (req, res, next) => {
    //res.send("NOT IMPLEMENTED: notes list");
    console.log(connection.query)
});

exports.add = asyncHandler(async (req, res, next) => {
    //res.send("NOT IMPLEMENTED: notes list");
    console.log(connection.query)
});
