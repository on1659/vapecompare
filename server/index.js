import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID || 'QIFL8RfRbmLNhJR0ttg6';
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET || '8Gd6jrxFsO';

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'dist')));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// 네이버 쇼핑 검색 API
app.get('/api/search', async (req, res) => {
  const { query, display = 20, sort = 'sim' } = req.query;
  if (!query) return res.status(400).json({ error: 'query 필요' });

  try {
    const url = `https://openapi.naver.com/v1/search/shop.json?query=${encodeURIComponent(query)}&display=${display}&sort=${sort}`;
    const response = await fetch(url, {
      headers: {
        'X-Naver-Client-Id': NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
      }
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    const data = await response.json();
    
    // 필요한 필드만 정리해서 반환
    const items = data.items.map(item => ({
      title: item.title.replace(/<[^>]*>/g, ''), // HTML 태그 제거
      link: item.link,
      image: item.image,
      lprice: Number(item.lprice),
      hprice: Number(item.hprice) || null,
      mallName: item.mallName,
      productId: item.productId,
      productType: item.productType,
      brand: item.brand,
      maker: item.maker,
      category1: item.category1,
      category2: item.category2,
      category3: item.category3,
      category4: item.category4,
    }));

    res.json({
      total: data.total,
      items,
    });
  } catch (err) {
    console.error('네이버 API 에러:', err);
    res.status(500).json({ error: '검색 실패' });
  }
});

// SPA fallback
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
