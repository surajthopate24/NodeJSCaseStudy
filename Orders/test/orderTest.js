let chai = require('chai');
let chaiHttp = require('chai-http');
const { response } = require('express');
const { expect } = require("chai");
const server = require("../orders");

//assertion style
chai.should();

chai.use(chaiHttp);

/**
 * Test the GET route
 */

describe("Order API", () => {
  describe("GET /orders", () => {
    it("It should get all the Food orders", (done) => {
      chai.request("http://localhost:5000")
        .get("/orders")
        .end((err, response) => {
          response.should.have.status(200);
          done();
        })

    })
    it("It should NOT GET all the food orders", (done) => {
      chai
        .request("http://localhost:5000")
        .get("/orderss")
        .end((err, response) => {
          response.should.have.status(400);
          done();
        });
    });
  })

});


/**
 * Test the GET(by ID) route
 */
describe("GET order/:_id", () => {
  it("It should GET a food orders by id", (done) => {
    const id = "62149a314b422a622b2752cc";
    chai
      .request("http://localhost:5000/order")
      .get("/" + id)
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.be.a("object");
        response.body.should.have.property("PassengerName");
        response.body.should.have.property("FoodItem");
        response.body.should.have.property("Quantity");
        done();
      });
  });
});

/**
 * Test the POST route
 */
describe("POST /order", () => {
  it("It should POST a new food order", (done) => {
    const order = {
      PassengerID: "620f6d5ea3c7fe75c117b241",
      FoodID: "62122dd45f45078ddabd1721",
      Quantity: "4"
    };
    chai
      .request("http://localhost:5000")
      .post("/order")
      .send(order)
      .end((err, response) => {
        response.should.have.status(201);
        done();
      });
  });
});



