import { NextResponse } from "next/server";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export async function POST(req: Request) {
  const { quote, name, handle } = await req.json();

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();

    // Simple HTML template for the tweet image
    const html = `
      <html>
        <body style="background:#15202B;color:white;font-family:sans-serif;padding:40px;">
          <h2>@${handle}</h2>
          <p style="font-size:20px;">${quote}</p>
          <small>- ${name}</small>
        </body>
      </html>
    `;

    await page.setContent(html);
    const imageBuffer = await page.screenshot({ type: "png" });

    await browser.close();

    return new Response(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (error) {
    console.error("Error generating tweet image:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
