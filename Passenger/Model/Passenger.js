const mongoose = require('mongoose');


mongoose.model("Passenger", {
    name: {
        type: String,
        required: true
    },
    emailID: {
        type: String,
        required: true
   
    },
    flightNo: {
        type: String,
        required:true
    }
   
});