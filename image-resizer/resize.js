// resize.js
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const inputDir = "./input";   // folder where you put your original big images
const outputDir = "./output"; // resized images will be saved here

// target sizes you want
const sizes = [600, 1200, 2000];

// make sure output folder exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

fs.readdirSync(inputDir).forEach(file => {
  const ext = path.extname(file);
  const name = path.basename(file, ext);

  sizes.forEach(size => {
    sharp(`${inputDir}/${file}`)
      .resize(size) // resize width to target size
      .toFormat("webp") // convert all to webp
      .toFile(`${outputDir}/${name}-${size}.webp`)
      .then(() => console.log(`✅ ${file} resized to ${size}px`))
      .catch(err => console.error(err));
  });
});
