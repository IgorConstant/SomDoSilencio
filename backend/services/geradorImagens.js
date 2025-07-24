
import nodeHtmlToImage from 'node-html-to-image';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const generatePostImage = async ({ title, intro, author, readTime, slug, imageFilename }) => {
  const outputDir = path.join(__dirname, '..', 'stories');
  const outputPath = path.join(outputDir, `${slug}.png`);
  const BASE_URL = 'http://localhost:5001';
  const imageUrl = imageFilename ? `${BASE_URL}/uploads/${imageFilename}` : '';

  await nodeHtmlToImage({
    output: outputPath,
    html: `
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              background: #000;
            }
            .storie-container {
              position: relative;
              width: 100%;
              height: 1280px;
              overflow: hidden;
              display: flex;
              align-items: center;
              justify-content: center;
              background-image: url('${imageUrl}');
              background-size: cover;
              background-position: center;
              background-repeat: no-repeat;
            }
            .card {
              position: relative;
              background: #fff;
              padding: 48px 36px;
              width: 540px;
              border-radius: 24px;
              box-shadow: 0 6px 24px rgba(0,0,0,0.10);
              z-index: 1;
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
            }
            .read-time { color: #888; font-size: 18px; margin-bottom: 10px; }
            .title { font-size: 38px; font-weight: bold; margin: 18px 0 14px 0; line-height: 1.15; }
            .subtitle { font-size: 22px; color: #555; margin-bottom: 18px; }
            .author { margin-top: 24px; font-size: 20px; color: #333; }
          </style>
        </head>
        <body>
          <div class="storie-container">
            <div class="card">
              <div class="read-time">${readTime}</div>
              <div class="title">${title}</div>
              <div class="subtitle">${intro}</div>
              <div class="author">Por: ${author}</div>
            </div>
          </div>
        </body>
      </html>
    `,
  });

  return `/stories/${slug}.png`;
};

export default generatePostImage;
