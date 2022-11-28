// Connect to Express back end
const express = require("express");

const fs = require("fs");
const path = require("path");
const database = require("./db/db.json");

var app = express();
var PORT = process.env.PORT || 3001;

// Middleware for parsing JSON and urlencoded form data
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// GET Routes, App starts with index.html on page load
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"))
});

// API Routes
app.route("/api/notes")
    .get(function (req, res) {
        res.json(database);
    })
    // Add new note to JSON db file
    .post(function (req, res) {
        let jsonPath = path.join(__dirname, "/db/db.json");
        let newNote = req.body;
        
        let highestID = 99;
        for (let i = 0; i < database.length; i++) {
            let individualNote = database[i];

            if (individualNote > highestID) {
                highestID = individualNote.id;
            }
        }
        // Assign ID to newNote
        newNote.id = highestID + 1;
        // Push to db.json
        database.push(newNote);
        
        fs.writeFile(jsonPath, JSON.stringify(database), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("Your note was saved!")
        });
        // Return response of User's new note
        res.json(newNote);
    });

    app.listen(PORT, function () {
        console.log("App listening on PORT " + PORT);
    });