const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '..', 'Posts');
const OUTPUT_FILE = path.join(__dirname, '..', 'index.json');

function generateIndex() {
  const posts = [];

  const folders = fs.readdirSync(POSTS_DIR).filter(item => {
    const itemPath = path.join(POSTS_DIR, item);
    return fs.statSync(itemPath).isDirectory() && !item.startsWith('.');
  });

  folders.sort((a, b) => b.localeCompare(a));

  for (const folder of folders) {
    const folderPath = path.join(POSTS_DIR, folder);
    const dataJsonPath = path.join(folderPath, 'data.json');

    if (!fs.existsSync(dataJsonPath)) {
      console.warn(`Файл data.json не найден в папке ${folder}`);
      continue;
    }

    try {
      const rawData = fs.readFileSync(dataJsonPath, 'utf8');
      const postData = JSON.parse(rawData);
      const allFiles = fs.readdirSync(folderPath).filter(item => {
        const itemPath = path.join(folderPath, item);
        return fs.statSync(itemPath).isFile() && item !== 'data.json';
      });

      posts.push({
        date: folder,
        files: allFiles,
        //data: postData
      });

    } catch (error) {
      console.error(`Ошибка при обработке папки ${folder}:`, error);
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2));
  console.log(`Сгенерирован index.json с ${posts.length} постами.`);
}

generateIndex();
