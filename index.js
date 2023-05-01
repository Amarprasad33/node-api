import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";



// Database Part
mongoose.connect("mongodb://127.0.0.1:27017", {
    dbName: "backend",
})
.then(() => console.log("Database Connected -:)"))
.catch((error) => console.log(error))

const messageSchema = new mongoose.Schema({ 
    name: String,
    email: String,
 })

const Message = mongoose.model("Message",messageSchema);

const app = express();


// Using Middlewares
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Setting up the view Engine
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    const { token } = req.cookies;
    if(token){
        res.render("logout");
    } else{
        res.render("login");
    }
});

app.post("/login", (req, res) => {
    res.cookie("token", "iaminboii",{
        httpOnly: true,
        expires: new Date(Date.now()+60*1000)
    });
    res.redirect("/");
})

app.get("/add", async (req, res) => {
    
    await Message.create({
        name: "Black Billa",
        email: "joshilaBilla@gmail.com"
    })
    res.send("Nice");

});

app.get("/success", (req, res) => {
    res.render("success");
});

app.post("/contact", async (req, res) => {
    const { name, email } =  req.body;
    await Message.create({ name, email });
    res.redirect("/success");
});

app.get("/users", (req, res) => {
    res.json({
        users,
    })
});


app.listen(5000, () => {
    console.log("Server is working");
});

