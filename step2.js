const fs = require("fs");
const axios = require("axios");

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

async function webCat(url) {
  try {
    const { data } = await axios.get(url);
    console.log(data);
  }
  catch(e) {
    console.log(e);
    process.exit(1);
  }
}

const args = process.argv;
try {
  const link = args[2];
  if (!link) {
    throw new Error("No path to file or webpage provided");
  }
  if (link.startsWith("http://") || link.startsWith("https://")) {
    webCat(link);
  }
  else {
    cat(link);
  }
}
catch(e) {
  console.log(e);
  process.exit(1);
}