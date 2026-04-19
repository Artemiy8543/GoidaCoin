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
    const dataJsonPath = path.join(POSTS_DIR, folder, 'data.json');

    if (fs.existsSync(dataJsonPath)) {
      try {
        const rawData = fs.readFileSync(dataJsonPath, 'utf8');
        const postData = JSON.parse(rawData);
        const encodedFolder = encodeURIComponent(folder);

        posts.push({
          data: folder,
          raw_url: `https://raw.githubusercontent.com/${process.env.GITHUB_REPOSITORY}/main/Posts/${encodedFolder}/data.json`,
        });
      } catch (error) {
        console.error(`Ошибка при чтении ${dataJsonPath}:`, error);
      }
    } else {
      console.warn(`Файл data.json не найден в папке ${folder}`);
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2));
  console.log(`Сгенерирован index.json с ${posts.length} постами.`);
}

generateIndex();
