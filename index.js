import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";


// Database Part
mongoose.connect("mongodb://127.0.0.1:27017", {
    dbName: "backend",
})
    .then(() => console.log("Database Connected -:)"))
    .catch((error) => console.log(error))

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
})

const User = mongoose.model("User", userSchema);

const app = express();


// Using Middlewares
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Setting up the view Engine
app.set("view engine", "ejs");

const isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;
    if (token) {
        const decodedData = jwt.verify(token, "kd2bvu204n0vjw");
        req.user = await User.findById(decodedData._id);
        next();
    } else {
        res.redirect("/login");
    }
}

app.get("/", isAuthenticated, (req, res) => {
    res.render("logout", { name: req.user.name });
});

app.get("/login", (req, res) => {
    res.render("login");
})

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if(!user) return res.redirect("/register");
    const isMatch = user.password === password;
    if(!isMatch) return res.render("login", {message: "Incorrect Password"});

    // Making a josnWEBtoken so that we will not reveal cookie token to random users
    const token = jwt.sign({_id: user._id}, "kd2bvu204n0vjw",);
    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 1000),
    });
    res.redirect("/");
})
 
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if(user){
        return res.redirect("/login")
    }

    user = await User.create({
        name, 
        email,
        password,
    });

    // Making a josnWEBtoken so that we will not reveal cookie token to random users
    const token = jwt.sign({_id: user._id}, "kd2bvu204n0vjw",);
    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 1000),
    });
    res.redirect("/");
})

app.get("/logout", (req, res) => {
    res.cookie("token", null, {
        httpOnly: true,
        expires: new Date(Date.now())
    });
    res.redirect("/");
})





app.listen(5000, () => {
    console.log("Server is working");
});

