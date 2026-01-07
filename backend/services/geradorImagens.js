import nodeHtmlToImage from "node-html-to-image";
import process from "node:process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const escapeHtml = (unsafe = "") =>
  unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const generatePostImage = async ({
  title = "",
  intro = "",
  author = "",
  readTime = "",
  slug,
  imageFilename = "",
}) => {
  const outputDir = path.join(__dirname, "..", "stories");
  const outputPath = path.join(outputDir, `${slug}.png`);

  const BASE_URL =
    process.env.BASE_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://osomdosilencio.com.br"
      : "http://localhost:5001");

  const imageUrl = imageFilename ? `${BASE_URL}/uploads/${imageFilename}` : "";

  await nodeHtmlToImage({
    output: outputPath,
    html: `
      <html>

<head>
    <style>
         * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: #000;
            font-family: Arial, sans-serif;
        }

        .story {
            position: relative;
            width: 1080px;
            height: 1920px;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }

        .story::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url('${imageUrl}') no-repeat center center/cover;
            z-index: 1;
        }

        .story::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            backdrop-filter: blur(8px);
            background: linear-gradient(135deg, rgba(128, 0, 128, 0.15), rgba(0, 0, 0, 0.25));
            z-index: 2;
        }

        .story-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 100px 50px;
            z-index: 3;
            background: #ffffff;
            color: #222;
            width: 90%;
            max-width: 900px;
            border-radius: 10px;
            text-align: left;
        }

        .story-title {
            font-size: 72px;
            font-weight: bold;
            margin-bottom: 30px;
            line-height: 1.2;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
        }

        .story-description {
            font-size: 36px;
            line-height: 1.6;
            margin-bottom: 40px;
            opacity: 0.95;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
        }

        .story-meta {
            font-size: 28px;
            opacity: 0.85;
        }

        .story-author {
            font-weight: 600;
            display: block;
            margin-bottom: 12px;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        .story-date {
            display: block;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
    </style>
</head>

<body>

    <div class="story">
        <div class="story-content">
            <h1 class="story-title">${escapeHtml(title)}</h1>
            <p class="story-description">${escapeHtml(intro)}</p>
            <div class="story-meta">
                <span class="story-author">Por ${escapeHtml(author)}</span>
                <span class="story-date">${escapeHtml(readTime)}</span>
            </div>
        </div>
    </div>
</body>

</html>
    `,
  });

  return `/stories/${slug}.png`;
};

export default generatePostImage;
