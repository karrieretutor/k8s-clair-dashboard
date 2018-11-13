const Clair  = require('clair-client');


const analyze = function ( image ) {
  return new Promise ( (resolve, reject) => {
    const clairAddress = process.env.CLAIR_ADDRESS || 'http://localhost:6060';

    try {
      //check if we have to deal with a priv registry
      if ( process.env.USE_PRIV_REGISTRY ) {
        var dockerUname = process.env.DOCKER_USER ||
          reject("Trying to use priv. Docker registry but \
            no Docker user name set");
        var dockerPass = process.env.DOCKER_PASS ||
          reject("Trying to use priv. Docer registry but \
            no Docker password set");
        var clair = new Clair({ clairAddress, dockerUname, dockerPass});
      }
      else {
        var clair = new Clair({ clairAddress });
      }

      var analysis = clair.analyze({ image: image });
    }
    catch (err) {
      reject(err);
    }
    
    resolve( analysis );
  });
}

module.exports.analyze = analyze;
