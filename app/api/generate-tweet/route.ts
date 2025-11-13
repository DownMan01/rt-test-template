import { NextResponse } from "next/server";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export async function POST(req: Request) {
  const { name, handle, tweet, profileImage, background } = await req.json();

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1500, height: 1500 },
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();

    // HTML exactly matches your preview layout
    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body {
              margin: 0;
              width: 1500px;
              height: 1500px;
              display: flex;
              justify-content: center;
              align-items: center;
              background: #15202B url("${background}") center/cover no-repeat;
              font-family: 'Segoe UI', Roboto, sans-serif;
            }

            .tweet-wrapper {
              width: 600px;
              padding: 32px;
              background-color: #151f2b;
              box-shadow: 0 5px 50px -12px rgba(255, 255, 255, 0.5);
              position: relative;
              display: flex;
              flex-direction: column;
              gap: 16px;
            }

            .profile {
              display: flex;
              align-items: flex-start;
              gap: 12px;
            }

            .avatar {
              width: 48px;
              height: 48px;
              border-radius: 50%;
              overflow: hidden;
              border: 1px solid #333;
              flex-shrink: 0;
            }

            .avatar img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }

            .user-info {
              display: flex;
              flex-direction: column;
              gap: 0;
            }

            .name {
              font-weight: bold;
              font-size: 18px;
              color: #fff;
            }

            .handle {
              font-size: 16px;
              color: #8b98a5;
            }

            .more {
              margin-left: auto;
              color: #8b98a5;
              font-size: 14px;
            }

            .tweet-text {
              font-size: 22px;
              color: #fff;
              line-height: 1.4;
              white-space: pre-line;
            }
          </style>
        </head>
        <body>
          <div class="tweet-wrapper">
            <div class="profile">
              <div class="avatar">
                <img src="${
                  profileImage ||
                  "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                }" />
              </div>
              <div class="user-info">
                <div class="name">${name}</div>
                <div class="handle">@${handle}</div>
              </div>
              <div class="more">•••</div>
            </div>
            <div class="tweet-text">${tweet}</div>
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
    return NextResponse.json({ error: "Failed to generate tweet image" }, { status: 500 });
  }
}
