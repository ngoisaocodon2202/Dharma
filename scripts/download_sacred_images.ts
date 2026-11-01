import fs from 'fs';
import path from 'path';
import https from 'https';

const IMAGES_TO_FETCH: { filename: string; url: string }[] = [
  {
    filename: 'thich_nhat_hanh.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Thich_Nhat_Hanh_12_%28cropped%29.jpg',
  },
  {
    filename: 'thich_quang_duc.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/T%C6%B0%E1%BB%A3ng_b%E1%BB%93_t%C3%A1t_Th%C3%ADch_Qu%E1%BA%A3ng_%C4%90%E1%BB%A9c.JPG',
  },
  {
    filename: 'quan_am_bodhisattva.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Quan_Am_1656.jpg',
  },
  {
    filename: 'sutra_book.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Shanzuigou_Tangut_Buddhist_sutra_A.jpg',
  },
  {
    filename: 'tripitaka_koreana.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Tripitaka_Koreana.jpg',
  },
  {
    filename: 'golden_buddha.jpg',
    url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    filename: 'buddha_temple_serene.jpg',
    url: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    filename: 'mindfulness_peace.jpg',
    url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
  },
  {
    filename: 'monk_incense.jpg',
    url: 'https://images.unsplash.com/photo-1772333137181-6ff2ce04afd2?auto=format&fit=crop&w=1200&q=80',
  },
  {
    filename: 'incense_smoke.jpg',
    url: 'https://images.unsplash.com/photo-1780408997169-4c9d50a9aa7d?auto=format&fit=crop&w=1200&q=80',
  }
];

function download(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    };

    const getWithRedirects = (currentUrl: string) => {
      https.get(currentUrl, options, (response) => {
        if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          getWithRedirects(response.headers.location);
          return;
        }

        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download ${currentUrl}: HTTP ${response.statusCode}`));
          return;
        }

        response.pipe(file);
        file.on('finish', () => {
          file.close(() => resolve());
        });
      }).on('error', (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
    };

    getWithRedirects(url);
  });
}

async function run() {
  const targetDir = path.join(process.cwd(), 'public', 'images');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  for (const item of IMAGES_TO_FETCH) {
    const dest = path.join(targetDir, item.filename);
    console.log(`Downloading ${item.filename}...`);
    try {
      await download(item.url, dest);
      console.log(`Successfully downloaded ${item.filename} (${fs.statSync(dest).size} bytes)`);
    } catch (err: any) {
      console.error(`Error downloading ${item.filename}:`, err.message);
    }
  }
  console.log('ALL DOWNLOADS FINISHED');
}

run();
