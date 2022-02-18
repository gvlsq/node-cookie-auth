const chai = require("chai");
const chaiHttp = require("chai-http");
const dotenv = require("dotenv");

const server = require("../../server");

chai.use(chaiHttp);

describe("Registration routes", function() {
  describe("POST /register", function() {
    describe("Required field validation", function() {
      it("should redirect to /register when a username is not provided", function(done) {
        chai.request(server)
            .post("/register")
            .type("form")
            .send({
              "emailAddress": process.env.DATABASE_TEST_EMAIL_ADDRESS,
              "password": process.env.DATABASE_TEST_PASSWORD,
              "passwordConfirmation": process.env.DATABASE_TEST_PASSWORD
            })
            .redirects(0)
            .end((err, res) => {
              chai.expect(err).to.be.null;
              chai.expect(res).to.redirect;
              chai.expect(res).to.have.status(302);
              chai.expect(res).to.redirectTo("/register");

              done();
            });
      });

      it("should redirect to /register when an email address is not provided", function(done) {
        chai.request(server)
            .post("/register")
            .type("form")
            .send({
              "username": process.env.DATABASE_TEST_USERNAME,
              "password": process.env.DATABASE_TEST_PASSWORD,
              "passwordConfirmation": process.env.DATABASE_TEST_PASSWORD
            })
            .redirects(0)
            .end((err, res) => {
              chai.expect(err).to.be.null;
              chai.expect(res).to.redirect;
              chai.expect(res).to.have.status(302);
              chai.expect(res).to.redirectTo("/register");

              done();
            });
      });

      it("should redirect to /register when a password is not provided", function(done) {
        chai.request(server)
            .post("/register")
            .type("form")
            .send({
              "username": process.env.DATABASE_TEST_USERNAME,
              "emailAddress": process.env.DATABASE_TEST_EMAIL_ADDRESS,
              "passwordConfirmation": process.env.DATABASE_TEST_PASSWORD
            })
            .redirects(0)
            .end((err, res) => {
              chai.expect(err).to.be.null;
              chai.expect(res).to.redirect;
              chai.expect(res).to.have.status(302);
              chai.expect(res).to.redirectTo("/register");

              done();
            });
      });

      it("should redirect to /register when a password confirmation is not provided", function(done) {
        chai.request(server)
            .post("/register")
            .type("form")
            .send({
              "username": process.env.DATABASE_TEST_USERNAME,
              "emailAddress": process.env.DATABASE_TEST_EMAIL_ADDRESS,
              "password": process.env.DATABASE_TEST_PASSWORD,
            })
            .redirects(0)
            .end((err, res) => {
              chai.expect(err).to.be.null;
              chai.expect(res).to.redirect;
              chai.expect(res).to.have.status(302);
              chai.expect(res).to.redirectTo("/register");

              done();
            });
      });
    });

    describe("Password validation", function() {
      it("should redirect to /register when the password is less than 6 characters long", function(done) {
        chai.request(server)
            .post("/register")
            .type("form")
            .send({
              "username": process.env.DATABASE_TEST_USERNAME,
              "emailAddress": process.env.DATABASE_TEST_EMAIL_ADDRESS,
              "password": "abcde",
              "passwordConfirmation": "abcde"
            })
            .redirects(0)
            .end((err, res) => {
              chai.expect(err).to.be.null;
              chai.expect(res).to.redirect;
              chai.expect(res).to.have.status(302);
              chai.expect(res).to.redirectTo("/register");

              done();
            });
      });

      it("should redirect to /register when the password and password confirmation do not match", function(done) {
        chai.request(server)
            .post("/register")
            .type("form")
            .send({
              "username": process.env.DATABASE_TEST_USERNAME,
              "emailAddress": process.env.DATABASE_TEST_EMAIL_ADDRESS,
              "password": "abcde",
              "passwordConfirmation": "abcd"
            })
            .redirects(0)
            .end((err, res) => {
              chai.expect(err).to.be.null;
              chai.expect(res).to.redirect;
              chai.expect(res).to.have.status(302);
              chai.expect(res).to.redirectTo("/register");

              done();
            });
      });
    });

    describe("Duplicate user handling", function() {
      it("should redirect to /register when the username is already in use", function(done) {
        chai.request(server)
            .post("/register")
            .type("form")
            .send({
              "username": process.env.DATABASE_TEST_USERNAME,
              "emailAddress": "unique@gmail.com",
              "password": process.env.DATABASE_TEST_PASSWORD,
              "passwordConfirmation": process.env.DATABASE_TEST_PASSWORD
            })
            .redirects(0)
            .end((err, res) => {
              chai.expect(err).to.be.null;
              chai.expect(res).to.redirect;
              chai.expect(res).to.have.status(302);
              chai.expect(res).to.redirectTo("/register");

              done();
            });
      });

      it("should redirect to /register when the email address is already in use", function(done) {
        chai.request(server)
            .post("/register")
            .type("form")
            .send({
              "username": "unique",
              "emailAddress": process.env.DATABASE_TEST_EMAIL_ADDRESS,
              "password": process.env.DATABASE_TEST_PASSWORD,
              "passwordConfirmation": process.env.DATABASE_TEST_PASSWORD
            })
            .redirects(0)
            .end((err, res) => {
              chai.expect(err).to.be.null;
              chai.expect(res).to.redirect;
              chai.expect(res).to.have.status(302);
              chai.expect(res).to.redirectTo("/register");

              done();
            });
      });
    });

    describe("Happy path", function() {
      it("should set a cookie and redirect to /home when registration succeeds", function(done) {
        chai.request(server)
            .post("/register")
            .type("form")
            .send({
              "username": "unique",
              "emailAddress": "unique@gmail.com",
              "password": "abcdef",
              "passwordConfirmation": "abcdef"
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
