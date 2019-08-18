const fs = require("fs");
const path = require("path");

let paths = {}
const dirPath = path.join(__dirname, "paths");

fs.readdirSync(dirPath).forEach((fileName) => {
    const filePath = path.join(dirPath, fileName);
    const obj = JSON.parse(fs.readFileSync(filePath));
    paths = { paths, ...obj };
});

module.exports = paths;