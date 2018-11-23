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
var retryImages = []; //list of images that need a clair retry

//schedule the job to retry analyzing failed images
//regularly
//setInterval(generateReport, 30000, retryImages);

k8s.listAllImages()
  .then( (img) => {
    images = img;
    images = images.sort();

    //generate intial report
    generateReport();
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
  res.render('health', {
    imagesCount: images.length,
    retryImageCount: retryImages.length,
    reportCount: report.reportCount
  });
});

app.listen(8080, () => {
  console.log('listening on 8080');
});


//
// utility
//
var generateReport = function ( imageindex ) {

  if ( imageindex === undefined ) {
    imageindex = 0;
  } 

  if ( imageindex >= images.length ){
    return;
  }

  let image = images[imageindex];

  let analyzeOptions = {};
  analyzeOptions.image = image;
  //exclude private images for now
  if ( image.startsWith('karrieretutor/') ) {
    analyzeOptions.isPublic = false;
  }
  else {
    analyzeOptions.isPublic = true;
  }

  clair.analyze(analyzeOptions)
    .then( (ana) => {
      report.updateImageReport(ana);
      generateReport(++imageindex)
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
      generateReport(++imageindex);
    });
}