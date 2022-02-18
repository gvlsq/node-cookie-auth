const chai = require("chai");
const chaiHttp = require("chai-http");

process.env.NODE_ENV = "test";

const server = require("../../server");

chai.use(chaiHttp);

describe("Timeout middleware", function() {
  describe("ensureActive", function() {
    it("should not redirect users who do not have cookies", function(done) {
      chai.request(server)
          .get("/")
          .end((err, res) => {
            chai.expect(err).to.be.null;
            chai.expect(res).to.not.redirect;
            chai.expect(res).to.have.status(200);

            done();
          });
    });
  });
});

describe("Authenication middleware", function() {
  describe("ensureAuth", function() {
    it("should redirect to the login page when the user is not authenticated", function(done) {
      chai.request(server)
          .get("/home")
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

  describe("ensureGuest", function() {
    it("should not redirect when the user is not authenticated", function(done) {
      chai.request(server)
          .get("/register")
          .end((err, res) => {
            chai.expect(err).to.be.null;
            chai.expect(res).to.not.redirect;
            chai.expect(res).to.have.status(200);
            
            done();
          });
    });
  });
});
