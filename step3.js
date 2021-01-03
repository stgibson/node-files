const fs = require("fs");
const axios = require("axios");

/**
 * Errors for when user types in wrong number of command line arguments
 */
class CommandArgsError extends Error {
  constructor(message) {
    super(message);
  }
}

/**
 * Writes data to filename
 * @param {string} data Text to add to filename
 * @param {string} filename Path to the file to write to
 */
function appendToFile(data, filename) {
  try {
    fs.appendFileSync(filename, data, "utf8");
  }
  catch(err) {
    console.log(err);
    process.exit(1);
  }
}

/**
 * Writes text from path to filename, or to console if filename is undefined
 * @param {string} path Path of file to read from
 * @param {string} filename Path of file to write to
 */
function cat(path, filename) {
  try {
    const data = fs.readFileSync(path, "utf8");
    if (filename) {
      appendToFile(data, filename);
    }
    else {
      console.log(data);
    }
  }
  catch(err) {
    console.log(err);
    process.exit(1);
  }
}

/**
 * Writes html from url to filename, or to console if filename is undefined
 * @param {string} url Webpage to read from
 * @param {string} filename Path of file to write to
 */
async function webCat(url, filename) {
  try {
    const { data } = await axios.get(url);
    if (filename) {
      appendToFile(data, filename);
    }
    else {
      console.log(data);
    }
  }
  catch(err) {
    console.log(err);
    process.exit(1);
  }
}

/**
 * Determines if link is a URL
 * @param {string} link The string to determine if it's a URL
 * @return True if link is a URL, false otherwise
 */
function isUrl(link) {
  return link.startsWith("http://") || link.startsWith("https://");
}

// determine which function to call based on command line arguments
const args = process.argv;
try {
  if (args.length < 3) {
    throw new CommandArgsError("No path to file or webpage provided");
  }
  if (args[2] === "--out") {
    if (args.length < 5) {
      const message =
        "When using --out, you must provide both the output file and at least one input file or url"
      throw new CommandArgsError(message);
    }
    const [, , , outputFile, ...links] = args;
    // make outputFile empty to prepare it for appending
    fs.writeFile(outputFile, "", "utf8", err => {
      if (err) {
        console.log(err);
        process.exit(1);
      }
    });
    for (let link of links) {
      if (isUrl(link)) {
        webCat(link, outputFile);
      }
      else {
        cat(link, outputFile);
      }
    }
  }
  else {
    const [, , ...links] = args;
    for (let link of links) {
      if (isUrl(link)) {
        webCat(link);
      }
      else {
        cat(link);
      }
    }
  }
}
catch(err) {
  console.log(err);
  process.exit(1);
}