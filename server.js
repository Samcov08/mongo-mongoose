var express = require("express");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 2000;

// Initialize Express
var app = express();

// Connect Handlebars to our Express app
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Configure middleware
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

// Routes
// A GET route for scraping the nhl website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("http://www.nhl.com/stars/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    // loops through all the articals (li)
    $("ul.mixed-feed__list")
      .find("li")
      .each(function(i, e) {
        var summary = $(e)
          .find("div.mixed-feed__item-header-text")
          .find("h5")
          .text();
        // console.log(summary);
        var headline = $(e)
          .find("div.mixed-feed__item-header-text")
          .find("h4")
          .text();
        // console.log(headline);
        var link =
          "https://www.nhl.com" +
          $(e)
            .find("div.mixed-feed__item-header-text")
            .find("a")
            .attr("href");
        // console.log(link);
        db.Article.create({ summary, headline, link });
      });
  });

  // Send a message to the client
  res.send("Scrape Complete");
});

app.get("/", function(req, res) {
  db.Article.find({})
    .populate("note")
    .then(function(dbArticle) {
      // find Articles, send them back to the client
      res.render("express", { articles: dbArticle });
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});
// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  console.log(req.body);
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { note: dbNote._id } },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      // send updated article back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.delete("/note/:id", function(req, res) {
  db.Note.findById({_id: req.params.id})
    .then(dbNote => {
        dbNote.remove()
    })
    .then(dbNote => res.json(dbNote))
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
