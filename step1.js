const fs = require("fs");

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