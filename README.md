# mongo-mongoose
When a user visits the site, the app will scrape articles from a the NHL website and display them for the user. Each scraped article will be saved to the application database. At a minimum, the app will scrape and display the following information for each article:


 * Headline - the title of the article

 * Summary - a short summary of the article

 * URL - the url to the original article

The user will also be able to leave comments on the articles displayed and revisit them later. The comments will be saved to the database as well and associated with their articles. Users will be able to delete comments left on articles as well. All stored comments are visible to every user.

Dependencies
MongoDB : https://www.mongodb.com/ Express : https://expressjs.com/ Mongoose : https://www.npmjs.com/package/mongoose Cheerio : https://www.npmjs.com/package/cheerio 
