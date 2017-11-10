const expect = require("chai").expect;
const limiter = require("../lib/limiter")({});

describe("Testing Limiter", () => {
  it("Testing Limit Restricts", (done) => {
    limiter.check(1, "test").then((firstCount) => {
      expect(firstCount).to.equal(1);
      limiter.check(1, "test").catch((secondCount) => {
        expect(secondCount).to.equal(2);
        done();
      });
    });
  });
});
