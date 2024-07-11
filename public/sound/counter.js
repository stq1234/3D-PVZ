const fs = require('fs');
const path = require('path');
const mm = require('music-metadata');

async function getMusicDuration(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const ext = path.extname(file);
    if (ext === '.mp3' || ext === '.wav' || ext === '.ogg') {
      const metadata = await mm.parseFile(filePath);
      console.log(`File: ${file}, Duration: ${metadata.format.duration} seconds`);
    }
  }
}

getMusicDuration('./');