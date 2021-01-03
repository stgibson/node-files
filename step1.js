const fs = require("fs");

/**
 * Writes text from path to console
 * @param {string} path Path of file to read from
 */
function cat(path) {
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    else {
      console.log(data);
    }
  });
}

const args = process.argv;
try {
  cat(args[2]);
}
catch(e) {
  console.log(e);
  process.exit(1);
}