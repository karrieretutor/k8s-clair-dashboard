const app = require('express');
const clair = require('./modules/clairclient');

var analysis = await clair.analyze('nginx');
console.log( analysis );
