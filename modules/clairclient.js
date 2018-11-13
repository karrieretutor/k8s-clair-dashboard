const Clair  = require('clair-client');
const assert = require('assert');
const clairAddress = process.env.CLAIR_ADDRESS || 'http://localhost:6060';

try {
  //check if we have to deal with a priv registry
  if ( process.env.USE_PRIV_REGISTRY ) {
    let dockerUname = process.env.DOCKER_USER
    let dockerPass = process.env.DOCKER_PASS 

    //check if Uname and pw are provided
    assert.ok(dockerUname, 'DOCKER_USER required but not provided');
    assert.ok(dockerPass, 'DOCKER_PASS required but not provided');

    var clair = new Clair({ clairAddress, dockerUname, dockerPass});
  }
  else {
    var clair = new Clair({ clairAddress });
  }
}
catch (err) {
  throw new Error("could not create clair client: " 
    + err);
}

const analyze = function ( image ) {
  return new Promise ( (resolve, reject) => {
    try {
      var analysis = clair.analyze({ image: image });
    }
    catch (err) {
      reject(err);
    }

    resolve( analysis );
  });
}

module.exports.analyze = analyze;
