const fs = require('fs');

let loaderJs = fs.readFileSync('assets/js/loader.js', 'utf8');

// Disable the auto-opening of the location modal by replacing B() with void 0 in the auto-prompt logic.
// The logic looks like: } else te || (localStorage.setItem("tl_location_prompted", "true"), B());
loaderJs = loaderJs.replace(/localStorage\.setItem\("tl_location_prompted",\s*"true"\),\s*B\(\)/, 'localStorage.setItem("tl_location_prompted", "true"), void 0');

fs.writeFileSync('assets/js/loader.js', loaderJs);
console.log('Auto-modal disabled.');
