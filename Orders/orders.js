const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('./Model/Order');
const Order = mongoose.model("Order")
const axios = require('axios');

/**Load Logging To Capture Events*/
const { setupLogging } = require("./Logger/logger");

const app = express();
setupLogging(app);
app.listen(5000, () => {
    console.log('up and running')
})

app.use(bodyParser.json());

mongoose.connect("mongodb+srv://suraj:suraj@cluster0.s8dvi.mongodb.net/OrderService?retryWrites=true&w=majority", () => {
    console.log("Connected to database");
});

app.get('/', (req, res) => {
    res.send("This is Order service");
});


app.post('/order', (req, res,next) => {
    var newOrder = {
        PassengerID: mongoose.Types.ObjectId(req.body.PassengerID),
        FoodID: mongoose.Types.ObjectId(req.body.FoodID),
        Quantity: req.body.Quantity
    }
    var order = new Order(newOrder);
    order.save().then(() => {
        console.log("New order placed");
        res.status(201).json({
            message: " Ordered Successfully With OrderID-" + order.id

        });
    }).catch(next);

})



app.get('/orders', (req, res,next) => {
    Order.find().then((orders) => {
        res.json(orders);
    }).catch(next);
});


app.get("/order/:id", (req, res,next) => {
    Order.findById(req.params.id).then((orders) => {
        if (orders) {
            axios.get("http://localhost:4000/passenger/" + orders.PassengerID).then((response) => {
                var orderObject = { PassengerName: response.data.name, FoodItem: "", Quantity: "" }
                axios.get("http://localhost:3000/food/" + orders.FoodID).then((response) => {
                    orderObject.FoodItem = response.data.name;
                    orderObject.Quantity = orders.Quantity;
                    res.json(orderObject);
                    console.log(orderObject);
                })
            })
        }
    }).catch(next);
})

// error handling middleware
app.use(function(err, req, res, next){
    console.log(err); // to see properties of message in our console
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