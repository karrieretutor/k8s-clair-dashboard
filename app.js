const express = require('express');
const clair = require('./modules/clairclient');
const Report = require('./modules/report').Report;
const k8s = require('./modules/kubeclient');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('assets'));

console.log('Starting up...');

var report = new Report();

var images;
//var retryImages = []; //list of images that need a clair retry

//schedule the job to retry analyzing failed images
//regularly
setInterval(generateReport, 30000, retryImages);

k8s.listAllImages()
  .then( (img) => {
    images = img;
    images = images.sort();

    //generate intial report
    generateReport(images, report);
  })
  .catch( (err) => {
    console.log(err);
  });

//
// routes
//
app.get('/', (req, res) => {
  res.render('index', {images: images});
});

app.get('/health', (req, res) => {
  res.render('health', {retryImageCount: retryImages.length});
});

app.listen(8080, () => {
  console.log('listening on 8080');
});


//
// utility
//
var generateReport = function ( images, report ) {
  images.forEach( (image) => {

    //exclude private images for now
    if ( image.startsWith('karrieretutor/') ) {
      continue;
    }

    clair.analyze(image)
      .then( (ana) => {
        report.updateImageReport(ana);
      })
      .catch ( (err) => {
        let msg = 'Could not analyze image ';
        msg += image;
        msg += ' error was: ';
        msg += err;
        msg += ' will try again with this later';

        // if ( !retryImages.includes(image) ) {
        //   retryImages.push(image);
        // }

        console.log(msg);
      });
  });
}