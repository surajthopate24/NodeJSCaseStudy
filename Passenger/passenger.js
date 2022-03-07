const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('./Model/Passenger');
const Passenger = mongoose.model("Passenger")

/**Load Logging To Capture Events*/
const { setupLogging } = require("./Logger/logger");

const app = express();
setupLogging(app);

app.listen(4000, () => {
    console.log('up and running')
})

app.use(bodyParser.json());


mongoose.connect("mongodb+srv://suraj:suraj@cluster0.s8dvi.mongodb.net/PassengerService?retryWrites=true&w=majority", () => {
    console.log("Connected to database");
});

app.get('/', (req, res) => {
    res.send("This is Passenger service");
});

app.post('/passenger', (req, res,next) => {
    var newPassenger = {
        name: req.body.name,
        emailID: req.body.emailID,
        flightNo: req.body.flightNo

    }
    var passenger = new Passenger(newPassenger);
    passenger.save().then(() => {
        console.log("New passenger registered");
        res.send("Passenger added sucessfully with passenger id:"+ passenger.id)
    }).catch(next);

})

app.get('/passengers', (req, res,next) => {
    Passenger.find()
        .then((passenger) => res.status(200).json(passenger))
        .catch(next);
});

app.get("/passenger/:id", (req, res,next) => {
    Passenger.findById(req.params.id).then((passenger) => {
        if (passenger) {
            res.json(passenger);
        }
        else {
            res.sendStatus(404);
        }
    }).catch(next);
})

app.delete("/passenger/:id", (req, res,next) => {
    Passenger.findByIdAndDelete(req.params.id).then((passenger) => {
        if (passenger) {
            res.send("Deleted sucessfully");
        }
        else {
            res.sendStatus(404);
        }
    }).catch(next);
})


// error handling middleware
app.use(function(err, req, res, next){
    console.log(err);
     // to see properties of message in our console
    res.status(422).send({error: err.message});
});

app.all('*', function(req, res) {
    throw new Error("Bad request/ Wrong URL")
})
app.use(function(e, req, res, next) {
    if (e.message === "Bad request/ Wrong URL") {
        res.status(400).json({error: {msg: e.message}});
    }
});