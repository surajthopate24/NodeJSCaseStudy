let chai = require('chai');
let chaiHttp = require('chai-http');
const { response } = require('express');
const { expect } = require("chai");
const server = require("../passenger");

//assertion style
chai.should();

chai.use(chaiHttp);

/**
 * Test the GET route
 */

describe("Passenger API", () => {
  describe("GET /passenger", () => {
    it("It should get all the passenger", (done) => {
      chai.request("http://localhost:4000")
        .get("/passengers")
        .end((err, response) => {
          response.should.have.status(200);
          done();
        })

    })
    it("It should NOT GET all the passengers", (done) => {
      chai
        .request("http://localhost:4000")
        .get("/passengerss")
        .end((err, response) => {
          response.should.have.status(400);
          done();
        });
    });
  })
  /**
  * Test the GET(by ID) route
  */
  describe("GET /passenger/:id", () => {
    it("It should GET a passenger by id", (done) => {
      const id = "6214987f8e6d03ab552a8973";
      chai
        .request("http://localhost:4000/passenger")
        .get("/" + id)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          response.body.should.have.property("_id");
          response.body.should.have.property("name");
          response.body.should.have.property("emailID");
          response.body.should.have.property("flightNo");
          response.body.should.have
            .property("_id")
            .eq("6214987f8e6d03ab552a8973");
          done();
        });
    });

  });

  /**
   * Test the POST route
   */
  describe("POST /passenger", () => {
    it("It should POST a new passenger", (done) => {
      const passenger = {
        name: "Kunal",
        emailID: "kunal22@gmail.com",
        flightNo: "103"
      };
      chai
        .request("http://localhost:4000")
        .post("/passenger")
        .send(passenger)
        .end((err, response) => {
          response.should.have.status(200);
          done();
        });
    });
  });




});




