const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const booksToDownload = [
  {
    filename: 'kinh_phap_cu.jpg',
    url: 'https://salt.tikicdn.com/cache/w300/ts/product/da/33/75/de4ec7b49a440d00d82ee0c07e7ee2ff.jpg'
  },
  {
    filename: 'trai_tim_cua_but.jpg',
    url: 'https://cdn1.fahasa.com/media/catalog/product/t/r/trai_tim_cua_but_10_2019_02_20_14_46_19.jpg'
  },
  {
    filename: 'duong_xua_may_trang.jpg',
    url: 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_43398.jpg'
  },
  {
    filename: 'tang_thu_song_chet.jpg',
    url: 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_68250.jpg'
  },
  {
    filename: 'kinh_kim_cuong.jpg',
    url: 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_100461.jpg'
  },
  {
    filename: 'hanh_phuc_cam_tay.jpg',
    url: 'https://cdn1.fahasa.com/media/catalog/product/8/9/8936037797762.jpg'
  },
  {
    filename: 'muon_kiep_nhan_sinh.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/vi/f/f4/Muon_kiep_nhan_sinh.jpeg'
  },
  {
    filename: 'an_lac_tung_buoc_chan.jpg',
    url: 'https://salt.tikicdn.com/cache/w300/ts/product/c6/41/4f/1435b8c30cb67668920bdfa1a5ff93c7.jpg'
  },
  {
    filename: 'phat_hoc_pho_thong.jpg',
    url: 'https://product.hstatic.net/1000022227/product/img_9185_d6e51fc8d362454ca9cf84c51710effe_grande.jpg'
  },
  {
    filename: 'kinh_dia_tang.jpg',
    url: 'https://newshop.vn/public/uploads/products/19425/kinh-dia-tang-bo-tat-bon-nguyen-tron-bo-bia-mem.jpg'
  }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed with status ${res.statusCode} for ${url}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error(`Timeout for ${url}`));
    });
  });
}

async function main() {
  const booksDir = path.join(__dirname, '../public/images/books');
  if (!fs.existsSync(booksDir)) fs.mkdirSync(booksDir, { recursive: true });

  for (const item of booksToDownload) {
    const dest = path.join(booksDir, item.filename);
    try {
      console.log(`Downloading ${item.filename} from ${item.url}...`);
      await download(item.url, dest);
      const stat = fs.statSync(dest);
      console.log(`✓ Saved ${item.filename} (${Math.round(stat.size / 1024)} KB)`);
    } catch (err) {
      console.error(`✗ Error downloading ${item.filename}:`, err.message);
    }
  }
}

main().catch(console.error);
