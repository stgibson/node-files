const fs = require("fs");
const axios = require("axios");

class CommandArgsError extends Error {
  constructor(message) {
    super(message);
  }
}

function writeToFile(data, filename) {
  fs.writeFile(filename, data, "utf8", err => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
  });
}

function cat(path, filename) {
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    else {
      if (filename) {
        writeToFile(data, filename);
      }
      else {
        console.log(data);
      }
    }
  });
}

async function webCat(url, filename) {
  try {
    const { data } = await axios.get(url);
    if (filename) {
      writeToFile(data, filename);
    }
    else {
      console.log(data);
    }
  }
  catch(e) {
    console.log(e);
    process.exit(1);
  }
}

function isUrl(link) {
  return link.startsWith("http://") || link.startsWith("https://");
}

const args = process.argv;
try {
  if (args.length < 3) {
    throw new CommandArgsError("No path to file or webpage provided");
  }
  if (args[2] === "--out") {
    if (args.length < 5) {
      const message =
        "When using --out, you must provide both the output file and the input file or url"
      throw new CommandArgsError(message);
    }
    const outputFile = args[3];
    const link = args[4];
    if (isUrl(link)) {
      webCat(link, outputFile);
    }
    else {
      cat(link, outputFile);
    }
  }
  else {
    const link = args[2];
    if (isUrl(link)) {
      webCat(link);
    }
    else {
      cat(link);
    }
  }
}
catch(e) {
  console.log(e);
  process.exit(1);
}