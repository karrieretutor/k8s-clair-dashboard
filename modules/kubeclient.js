const k8s = require('@kubernetes/client-node');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.Core_v1Api);

// Gets all images deployed in the k8s cluster
//
// returns: Promise
//  calls resolve(images) where images is an
//    array containing each deployed image 
//    once (no duplicates)
//  calls reject(err)
var listAllImages = function () {
  return new Promise ( (resolve, reject) => {
    let images = [];
    
    k8sApi.listPodForAllNamespaces()
      .then( (res) => {
        if ( res.response.statusCode != 200 ) {
          let err = "ERROR: statusCode was ";
          err += res.response.statusCode;
          err += ", ";
          err += res.response.statusMessage;
          
          reject(err);
        }
        else {
          res.body.items.forEach( (item) => {
            item.spec.containers.forEach( (container) => {
              if ( !images.includes( container.image )) {
                images.push( container.image );
              }
            });
          });

          resolve( images );
        }
      })
      .catch ( (err) => {
        reject(err);
      });
  });
}

module.exports.listAllImages = listAllImages;
