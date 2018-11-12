const express = require('express');
const clair = require('./modules/clairclient');
const Report = require('./modules/report').Report;
const k8s = require('./modules/kubeclient');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

console.log('Starting up...');

var report = new Report();

var images;
k8s.listAllImages()
  .then( (img) => {
    images = img;
  })
  .catch( (err) => {
    console.log(err);
  });


