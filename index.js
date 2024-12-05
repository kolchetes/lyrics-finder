import bodyParser from "body-parser";
import express from "express";
import axios from "axios";

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

app.get("/", (req, res) => {
    res.render("index.ejs")
});

app.post("/search", async (req, res) => {
    let artistName = req.body.artist 
    let songName = req.body.song

    artistName = artistName.replaceAll(' ', '+') // Makes the artist name readable for the API
    songName = songName.replaceAll(' ', '+') // Makes the song name readable for the API

    try {
        const result = await axios.get(`https://api.lyrics.ovh/v1/${artistName}/${songName}`)
        const whiteSpaceHandler = "\r\n"
        const correctedLyrics = whiteSpaceHandler + result.data.lyrics //Creates a line break to handle invisible margin
        
        res.render("index.ejs", {
            lyrics: correctedLyrics,
            artist: artistName.replaceAll('+', ' '), // Makes the artist name readable for the user
            song: songName.replaceAll('+', ' ') // Makes the song name readable for the user
        })
        
    } catch (error) {
        console.log(error.message)
        res.render("index.ejs", {error: `Unable to find "${songName.replaceAll('+', ' ')}" from artist "${artistName.replaceAll('+', ' ')}" =(`}) 
       /* console.log(error)
        console.log(artistName)
        console.log(songName)
       */
    }
});

app.get("/about", (req, res) => {
    res.render("about.ejs")
});

app.get("/contact", (req, res) => {
    res.render("contact.ejs")
});


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});