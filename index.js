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

const userSchema = new mongoose.Schema({ 
    name: String,
    email: String,
 })

const User = mongoose.model("User",userSchema);

const app = express();


// Using Middlewares
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Setting up the view Engine
app.set("view engine", "ejs");

const isAuthenticated = (req, res, next) => {
    const { token } = req.cookies;
    if(token){
        next();
    } else{
        res.render("login");
    }
}

app.get("/", isAuthenticated, (req, res) => {
    res.render("logout");
});

app.post("/login", (req, res) => {
    res.cookie("token", "iaminboii",{
        httpOnly: true,
        expires: new Date(Date.now()+60*1000)
    });
    res.redirect("/");
})

app.get("/logout", (req, res) => {
    res.cookie("token", null,{
        httpOnly: true,
        expires: new Date(Date.now())
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




app.listen(5000, () => {
    console.log("Server is working");
});

