const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
/**Load The Schema Model Food */
require('./Model/Food');
const Food = mongoose.model("Food")
/**Load Logging To Capture Events*/
const { setupLogging } = require("./Logger/logger");
/**Load SwaggerUI For UI */
const swaggerUI = require("swagger-ui-express");
/**Load SwaggerJsDoc For Documentation */
const swaggerJsDoc = require("swagger-jsdoc")


const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Food API",
            version: "1.0.0",
            description: "A Simple Express Food API",
        },
        servers: [
            {
                url: "http://localhost:3000",

            },
        ],
    },
    apis: ["food.js"],

};
/**Returns validated Swagger specification in JSON format */
const specs = swaggerJsDoc(options);

const app = express();

/**Load Method And Define URL For Swagger With Express */
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

setupLogging(app);

app.listen(3000, () => {
    console.log('up and running')
})

app.use(bodyParser.json());

mongoose.connect("mongodb+srv://suraj:suraj@cluster0.s8dvi.mongodb.net/FoodService?retryWrites=true&w=majority", () => {
    console.log("Connected to database");
});

app.get('/', (req, res) => {
    res.send("This is Food service");
});


/**
 * @swagger
 * /addFood:
 *   post:
 *     summary: Create a new book
 *     tags: [Foods]
 *     requestBody:
 *          - category
 *          - name
 *          - Price
 *     responses:
 *       201:
 *         description: The food was successfully created
 *       422:
 *         description: Some server error
 */
app.post('/addFood', (req, res, next) => {
    var newFood = {
        category: req.body.category,
        name: req.body.name,
        price: req.body.price

    }
    var food = new Food(newFood);
    food.save().then(() => {
        console.log("New food Added");
        res.status(201).json({
            message: food.name + " Added Successfully With FoodID-" + food.id
        });
    }).catch(next);
})

/**
 * @swagger
 * components:
 *   schemas:
 *     Food:
 *       type: object
 *       required:
 *         - category
 *         - name
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the food
 *         category:
 *           type: string
 *           description: category of the food
 *         name:
 *           type: string
 *           description: food name
 *         price:
 *           type:string
 *           description: Price Of the food item
 *       example:
 *         id: 621357f0f5030e3356d7e116
 *         category: Burger
 *         name:veg cheese Burger
 *         price:150
 */

/**
 * @swagger
 * tags:
 *   name: Food
 *   description: The Food Managing API
 */

/**
 * @swagger
 * /getfoods:
 *   get:
 *     summary: Returns the list of all the foods
 *     tags: [Food]
 *     responses:
 *       200:
 *         description: The list of the Foods
 */
app.get('/getfoods', (req, res, next) => {
    Food.find().then((food) => {
        res.json(food);
    }).catch(next);
});

/**
 * @swagger
 * /food/{id}:
 *   get:
 *     summary: Get the food by id
 *     tags: [Foods]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The food id
 *     responses:
 *       200:
 *         description: The food description by id
 *       404:
 *         description: The food was not found
 */
app.get("/food/:id", (req, res, next) => {
    Food.findById(req.params.id)
        .then((food) => res.status(200).json(food))
        .catch(next);
})


/**
 * @swagger
 * /food/{id}:
 *   delete:
 *     summary: Remove the  food by id
 *     tags: [Foods]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The food id
 * 
 *     responses:
 *       200:
 *         description: The food was deleted
 *       404:
 *         description: The food was not found
 */

app.delete("/food/:id", (req, res, next) => {
    Food.findByIdAndDelete(req.params.id).then((food) => {
        if (food) {
            res.send("Food item Deleted sucessfully");
        }
        else {
            res.sendStatus(404);
        }
    }).catch(next);
})

// error handling middleware
app.use(function (err, req, res, next) {
    console.log(err);
     // to see properties of message in our console
    res.status(422).send({ error: err.message });
});

app.all('*', function(req, res) {
    throw new Error("Bad request/ Wrong URL")
})
app.use(function(e, req, res, next) {
    if (e.message === "Bad request/ Wrong URL") {
        res.status(400).json({error: {msg: e.message}});
    }
});