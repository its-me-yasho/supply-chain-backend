const mongoose = require("mongoose");
const { MODEL_NAMES } = require("../config/constants");

const charecter = new mongoose.Schema(
 {
    firstName: {type: string, requied: true},
    lastName: {type: string, required: true},
    fullName: {type: string},
    title: {type: string, required: true},
    family: {type: string},   
    image: {type: string},
    imageUrl: {type: string},
 }  
);

module.exports = mongoose.model(MODEL_NAMES.CHARECTER, charecter);
