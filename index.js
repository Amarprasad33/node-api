import express from "express";
import path from "path";

const app = express();


app.use(express.static(path.join(path.resolve(), "public")));

// Setting up the view Engine
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    const pathlocation = path.resolve();  

    res.render("index", {name: "Amar Prasad"});
})


app.listen(5000, () => {
    console.log("Server is working");
})

