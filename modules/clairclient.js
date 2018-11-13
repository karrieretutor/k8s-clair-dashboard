const Clair  = require('clair-client');


const analyze = function ( image ) {
  return new Promise ( (resolve, reject) => {
    const clairAddress = process.env.CLAIR_ADDRESS || 'http://localhost:6060';
    try {
      const clair = new Clair({ clairAddress });
      var analysis = clair.analyze({ image: image });
    }
    catch (err) {
      reject(err);
    }
    resolve( analysis );
  });
}

module.exports.analyze = analyze;
