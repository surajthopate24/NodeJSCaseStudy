const mongoose = require('mongoose');

mongoose.model("Order", {
    PassengerID: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    FoodID: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    Quantity: {
        type: String,
        required: true
    },


});