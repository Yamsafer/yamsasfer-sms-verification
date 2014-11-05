# karma-chai-jquery
> Chai-Jquery plugin for Karma Test Runner

  * [Karma] (http://karma-runner.github.io)
  * [Chai-Jquery](https://github.com/chaijs/chai-jquery)

## Requirements

This Karma plugin requires Karma `~0.10.0`


## Breaking change in 1.0.0

To better align jQuery versions in build systems that depend on older versions of jQuery I've no longer bundled the most recent version of jQuery with **karma-chai-jquery** instead opting to offload that to a plugin like [karma-jquery](https://github.com/scf2k/karma-jquery). The idea is that every karma plugin should do one thing and one thing only.

## Installation

Install the module via npm

```sh
$ npm install --save-dev karma-chai-jquery
```
- `karma-chai-jquery` requires `jquery` which is not included and recommended to be installed through [karma-jquery](https://github.com/scf2k/karma-jquery).
- `karma-chai-jquery` requires `chai` which is not included and recommended to be installed through [karma-chai](https://github.com/xdissent/karma-chai)

```js
module.exports = function(config) {
  'use strict';
  config.set({
    frameworks: ['mocha', 'chai', 'chai-jquery', 'jquery-1.8.3'],
    #...
  });
}
```

Usage
-----

Usage for chai-jquery is fully outlined [here](https://github.com/chaijs/chai-jquery).
