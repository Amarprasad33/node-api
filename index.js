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
        res.render("login");
    }
}

app.get("/", isAuthenticated, (req, res) => {
    res.render("logout", { name: req.user.name });
});

app.post("/login", async (req, res) => {
    const { name, email } = req.body;
    const user = await User.create({
        name, 
        email,
    })

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

