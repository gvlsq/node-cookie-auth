const chai = require("chai");
const chaiHttp = require("chai-http");
const dotenv = require("dotenv");

const server = require("../../server");

chai.use(chaiHttp);

describe("Login routes", function() {
  describe("POST /login", function() {
    describe("Required field validation", function() {
      it("should redirect to /login when a username is not provided", function(done) {
        chai.request(server)
            .post("/login")
            .type("form")
            .send({
              "password": process.env.DATABASE_TEST_PASSWORD
            })
            .redirects(0)
            .end((err, res) => {
              chai.expect(err).to.be.null;
              chai.expect(res).to.redirect;
              chai.expect(res).to.have.status(302);
              chai.expect(res).to.redirectTo("/login");

              done();
            });
      });

      it("should redirect to /login when a password is not provided", function(done) {
        chai.request(server)
            .post("/login")
            .type("form")
            .send({
              "username": process.env.DATABASE_TEST_USERNAME
            })
            .redirects(0)
            .end((err, res) => {
              chai.expect(err).to.be.null;
              chai.expect(res).to.redirect;
              chai.expect(res).to.have.status(302);
              chai.expect(res).to.redirectTo("/login");

              done();
            });
      });
    });

    describe("Incorrect credentials", function() {
      it("should redirect to /login when the user does not exist", function(done) {
        chai.request(server)
            .post("/login")
            .type("form")
            .send({
              "username": "bogus_user",
              "password": process.env.DATABASE_TEST_PASSWORD
            })
            .redirects(0)
            .end((err, res) => {
              chai.expect(err).to.be.null;
              chai.expect(res).to.redirect;
              chai.expect(res).to.have.status(302);
              chai.expect(res).to.redirectTo("/login");

              done();
            });
      });

      it("should redirect to /login when the password is incorrect", function(done) {
        chai.request(server)
            .post("/login")
            .type("form")
            .send({
              "username": process.env.DATABASE_TEST_USERNAME,
              "password": "bogus_password"
            })
            .redirects(0)
            .end((err, res) => {
              chai.expect(err).to.be.null;
              chai.expect(res).to.redirect;
              chai.expect(res).to.have.status(302);
              chai.expect(res).to.redirectTo("/login");

              done();
            });
      });
    });

    describe("Happy path", function() {
      it("should set a cookie and redirect to /home when authentication succeeds", function(done) {
        chai.request(server)
            .post("/login")
            .type("form")
            .send({
              "username": process.env.DATABASE_TEST_USERNAME,
              "password": process.env.DATABASE_TEST_PASSWORD
            })
            .redirects(0)
            .end((err, res) => {
              chai.expect(err).to.be.null;
              chai.expect(res).to.have.cookie(process.env.COOKIE_NAME);
              chai.expect(res).to.redirect;
              chai.expect(res).to.have.status(302);
              chai.expect(res).to.redirectTo("/home");

              done();
            });
      });
    });
  });
});
