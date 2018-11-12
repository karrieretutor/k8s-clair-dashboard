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
k8s.listAllImages()
  .then( (img) => {
    images = img;
    images = images.sort();
  })
  .catch( (err) => {
    console.log(err);
  });

app.get('/', (req, res) => {
  res.render('index', {images: images});
});

app.listen(8080, () => {
  console.log('listening on 8080');
});
