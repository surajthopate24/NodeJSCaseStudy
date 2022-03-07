let chai = require('chai');
let chaiHttp = require('chai-http');
const { response } = require('express');
const { expect } = require("chai");
const server = require("../food");

//assertion style
chai.should();

chai.use(chaiHttp);

/**
 * Test the GET route
 */

describe("Food API", () => {
  describe("GET /getfoods", () => {
    it("It should get all the Foods", (done) => {
      chai.request("http://localhost:3000")
        .get("/getfoods")
        .end((err, response) => {
          response.should.have.status(200);
          done();
        })

    })
    it("It should NOT GET all the foods", (done) => {
      chai
        .request("http://localhost:3000")
        .get("/getfoodsss")
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
describe("GET foods/:_id", () => {
  it("It should GET a food by id", (done) => {
    const id = "621495e22f75485dde1b7543";
    chai
      .request("http://localhost:3000/food")
      .get("/" + id)
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.be.a("object");
        response.body.should.have.property("_id");
        response.body.should.have.property("category");
        response.body.should.have.property("name");
        response.body.should.have.property("price");
        response.body.should.have
          .property("_id")
          .eq("621495e22f75485dde1b7543");
        done();
      });
  });
  it("It should NOT GET a food by id", (done) => {
    const id = "620f5d537bc00186daefa4da";
    chai
      .request("http://localhost:3000/food")
      .get("/" + id)
      .end((err, response) => {
        expect(response.body).null;
        done();
      });
  });
});

/**
 * Test the POST route
 */
describe("POST /addFood", () => {
  it("It should POST a new food", (done) => {
    const food = {
      category: "Burger",
      name: "Veg Aloo Tikki Burger",
      price: "300"
    };
    chai
      .request("http://localhost:3000")
      .post("/addFood")
      .send(food)
      .end((err, response) => {
        response.should.have.status(201);
        done();
      });
  });

});



