var mongoose = require("mongoose");

// saves a referance to schema constructor
var Schema = mongoose.Schema;

// creates a ne note schema object
var NoteSchema = new Schema({
    body: String
});

// this creates the model from the above schema
var Note = mongoose.model("Note", NoteSchema);

// export the note model
module.exports = Note;