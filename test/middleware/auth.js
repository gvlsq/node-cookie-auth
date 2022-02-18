const chai = require("chai");
const chaiHttp = require("chai-http");

const server = require("../../server");

chai.use(chaiHttp);

describe("Authenication middleware", function() {
  describe("ensureActive", function() {
    it("should not redirect when the user does not have a cookie", function(done) {
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

  describe("ensureAuth", function() {
    it("should redirect to the login page when the user is not authenticated", function(done) {
      chai.request(server)
          .get("/home")
          .redirects(0) // https://github.com/chaijs/chai-http/issues/112#issuecomment-607527228
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
