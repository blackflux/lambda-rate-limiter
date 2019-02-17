# lambda-rate-limiter

[![Build Status](https://circleci.com/gh/blackflux/lambda-rate-limiter.png?style=shield)](https://circleci.com/gh/blackflux/lambda-rate-limiter)
[![Test Coverage](https://img.shields.io/coveralls/blackflux/lambda-rate-limiter/master.svg)](https://coveralls.io/github/blackflux/lambda-rate-limiter?branch=master)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=blackflux/lambda-rate-limiter)](https://dependabot.com)
[![Dependencies](https://david-dm.org/blackflux/lambda-rate-limiter/status.svg)](https://david-dm.org/blackflux/lambda-rate-limiter)
[![NPM](https://img.shields.io/npm/v/lambda-rate-limiter.svg)](https://www.npmjs.com/package/lambda-rate-limiter)
[![Downloads](https://img.shields.io/npm/dt/lambda-rate-limiter.svg)](https://www.npmjs.com/package/lambda-rate-limiter)
[![Semantic-Release](https://github.com/blackflux/js-gardener/blob/master/assets/icons/semver.svg)](https://github.com/semantic-release/semantic-release)
[![Gardener](https://github.com/blackflux/js-gardener/blob/master/assets/badge.svg)](https://github.com/blackflux/js-gardener)

Fast and efficient in-memory rate-limiter. No centralized storage (see below for reasoning).

This rate limiter is designed for AWS Lambda and other serverless computing‎ alternatives, but is usable in any NodeJS project, regardless of whether a framework or vanilla code is used. It works great to prevent most common DOS attacks, but can also be used for simple rate limiting. However accuracy is not guaranteed in the second case (see below).

Uses [lru-cache](https://www.npmjs.com/package/lru-cache) for storage.

## How to install?

Run

    $ npm install --save lambda-rate-limiter

## How to use?

To initialize and check against limit use
<!-- eslint-disable import/no-extraneous-dependencies, import/no-unresolved -->
```javascript
const limiter = require('lambda-rate-limiter')({
  interval: 60000, // rate limit interval in ms, starts on first request
  uniqueTokenPerInterval: 500 // excess causes earliest seen to drop, per instantiation
});

limiter
  .check(10, 'USER_TOKEN') // define maximum of 10 requests per interval
  .catch(() => {
    // rate limit exceeded: 429
  })
  .then(() => {
    // ok
  });
```
where `USER_TOKEN` could be the user ip or login.

## Why not using existing similar modules?

Using serverless computing is usually cheap, especially for low volume. You only pay for usage. Adding a centralized rate limiter storage option like Redis adds a significant amount of cost and overhead. This cost increases drastically and the centralized storage eventually becomes the bottleneck when DOS attacks need to be prevented.

This module keeps all limits in-memory, which is much better for DOS prevention. The only downside: Limits are not shared between function instantiations. This means limits can reset arbitrarily when new instances get spawned (e.g. after a deploy) or different instances are used to serve requests. However, cloud providers will usually serve clients with the same instance if possible, since cached data is most likely to reside on these instances. This is great since we can assume that in most cases the instance for a client does not change and hence the rate limit information is not lost.
