import { NextResponse } from "next/server";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export async function POST(req: Request) {
  const { quote, name, handle, profileImage, background } = await req.json();

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1500, height: 1500 },
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();

    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body {
              margin: 0;
              background: #15202B url("${
                background ||
                "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80"
              }") center/cover no-repeat;
              width: 1500px;
              height: 1500px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: 'Segoe UI', Roboto, sans-serif;
            }
            .tweet {
              background: rgba(21, 31, 43, 0.95);
              width: 600px;
              padding: 32px;
              border-radius: 16px;
              box-shadow: 0 10px 50px rgba(0,0,0,0.5);
              color: white;
            }
            .profile {
              display: flex;
              align-items: center;
              margin-bottom: 16px;
            }
            .avatar {
              width: 48px;
              height: 48px;
              border-radius: 50%;
              overflow: hidden;
              margin-right: 12px;
              flex-shrink: 0;
              border: 1px solid #333;
            }
            .avatar img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            .name { font-weight: bold; font-size: 18px; }
            .handle { color: #888; font-size: 16px; }
            .tweet-text {
              white-space: pre-line;
              font-size: 20px;
              line-height: 1.4;
            }
          </style>
        </head>
        <body>
          <div class="tweet">
            <div class="profile">
              <div class="avatar"><img src="${
                profileImage ||
                "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
              }" /></div>
              <div>
                <div class="name">${name || "Random Tweets"}</div>
                <div class="handle">@${handle || "anonymous"}</div>
              </div>
            </div>
            <div class="tweet-text">${quote}</div>
          </div>
        </body>
      </html>
    `;

    await page.setContent(html, { waitUntil: "networkidle0" });
    const imageBuffer = await page.screenshot({ type: "png" });

    await browser.close();

    return new Response(imageBuffer, {
      headers: { "Content-Type": "image/png" },
    });
  } catch (err) {
    console.error("❌ Error generating image:", err);
    return NextResponse.json(
      { error: "Failed to generate tweet image" },
      { status: 500 }
    );
  }
}
