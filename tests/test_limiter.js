const expect = require("chai").expect;
const limiter = require("../lib/limiter")({});

describe("Testing Limiter", () => {
  it("Testing Limit Restricts", (done) => {
    limiter.check(1, "token1").then((firstCount) => {
      expect(firstCount).to.equal(1);
      limiter.check(1, "token1").catch((secondCount) => {
        expect(secondCount).to.equal(2);
        done();
      });
    });
  });

  it("Testing Zero Limit Fails", (done) => {
    limiter.check(0, "token2").catch((count) => {
      expect(count).to.equal(1);
      done();
    });
  });
});
