const Clair  = require('clair-client');


const analyze = function ( image ) {
  return new Promise ( (resolve, reject) => {
    const clairAddress = process.env.CLAIR_ADDRESS || 'http://localhost:6060';
    const clair = new Clair({ clairAddress });
    const analysis = clair.analyze({ image: image });
    resolve( analysis );
  });
}

module.exports.analyze = analyze;
