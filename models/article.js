var mongoose = require("mongoose");

// WE SAVE A REFERENCE TO THE SCHEMA CONSTRUCTOR
var Schema = mongoose.Schema;

// NOW, USING THE SCHEMA CONSTRUCTOR, WE CREATE A NEW USER SCHEMA OBJECT (SIMILAR TO SEQUELIZE MODEL)
var ArticleSchema = new Schema({
    headline: {
        type: String,
        unique: true,
        required: true
    },

    link: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    // links the ObjectId to the Note model and
    // allows us to populate the Article with an associated Note
    note: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
});

// creates model from the above schema
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;