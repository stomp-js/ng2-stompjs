const fs = require('fs');
const pkg = require('../dist/package.json');

pkg.module = pkg.fesm2015;

const data = JSON.stringify(pkg, null, 2);
fs.writeFileSync('dist/package.json', data);
