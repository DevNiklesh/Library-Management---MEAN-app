// npm packages
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");

// application packages
const apiRoutes = require("./api-routes");
const { config } = require('./config');
const { applyPassportStrategy } = require('./store/passport');

// Database connection
try {
    mongoose.connect( config.env.mogoDBUri, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}, () =>
        console.log("Connected to MongoDB")
    );    
} catch (error) { 
    console.log("could not connect", error);    
}

const app = express();
app.use(cors());

applyPassportStrategy(passport);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/welcome', (req, res) => {
    res.send("Welcome to Library Management Software")
});

app.use("/api", apiRoutes);


app.use((err, req, res, next) => {
  res.status(500)
  res.send({ error: err })
})

app.listen(config.env.port, () => {
    console.log("App listening at port:", config.env.port)
});

