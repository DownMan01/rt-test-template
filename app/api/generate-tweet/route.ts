import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: NextRequest) {
  try {
    const { name, handle, tweet, profileImage, background } = await request.json();
    
    // Validate required fields
    if (!name || !handle || !tweet) {
      return NextResponse.json(
        { error: 'Missing required parameters: name, handle, and tweet are required' },
        { status: 400 }
      );
    }

    console.log('Generating quote for:', { name, handle });

    // Launch browser
    const browser = await puppeteer.launch({ 
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set viewport to match your component's output size
    await page.setViewport({ 
      width: 1500, 
      height: 1500, 
      deviceScaleFactor: 3 
    });
    
    // Generate HTML that matches your React component exactly
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            }
            
            .tweet-container {
              width: 1500px;
              height: 1500px;
              background-color: #15202B;
              ${background ? `background-image: url('${background}');` : ''}
              background-size: cover;
              background-position: center;
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;
              overflow: hidden;
            }
            
            .tweet-content-wrapper {
              width: 100%;
              max-width: 512px;
              background: #151f2b;
              padding: 48px;
            }
            
            .profile-section {
              display: flex;
              align-items: flex-start;
            }
            
            .profile-img-wrapper {
              width: 48px;
              height: 48px;
              border-radius: 50%;
              overflow: hidden;
              margin-right: 12px;
              background: #1f2937;
              border: 1px solid #374151;
              flex-shrink: 0;
            }
            
            .profile-img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            
            .profile-info {
              flex-grow: 1;
              min-width: 0;
            }
            
            .name {
              color: white;
              font-weight: bold;
              font-size: 20px;
              line-height: 1.2;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            
            .handle {
              color: #6b7280;
              font-size: 20px;
              line-height: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            
            .menu-dots {
              color: #6b7280;
              font-size: 14px;
              line-height: 1;
              flex-shrink: 0;
              margin-left: 8px;
            }
            
            .tweet-text {
              color: white;
              font-size: 24px;
              line-height: 1.5;
              white-space: pre-line;
              word-wrap: break-word;
              margin-top: 16px;
            }
          </style>
        </head>
        <body>
          <div class="tweet-container">
            <div class="tweet-content-wrapper">
              <div class="profile-section">
                <div class="profile-img-wrapper">
                  <img 
                    src="${profileImage || 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'48\' height=\'48\'%3E%3Crect width=\'48\' height=\'48\' fill=\'%231f2937\'/%3E%3C/svg%3E'}" 
                    class="profile-img" 
                    crossorigin="anonymous"
                    onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'48\\' height=\\'48\\'%3E%3Crect width=\\'48\\' height=\\'48\\' fill=\\'%231f2937\\'/%3E%3C/svg%3E'"
                  />
                </div>
                <div class="profile-info">
                  <div class="name">${name}</div>
                  <div class="handle">@${handle}</div>
                </div>
                <div class="menu-dots">•••</div>
              </div>
              <div class="tweet-text">${tweet.replace(/\n/g, '<br>')}</div>
            </div>
          </div>
        </body>
      </html>
    `;
    
    // Load the HTML
    await page.setContent(html, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Take screenshot
    const screenshot = await page.screenshot({ 
      type: 'png',
      omitBackground: false,
      fullPage: false
    });
    
    await browser.close();
    
    console.log('Quote generated successfully');
    
    // Return the image
    return new NextResponse(screenshot, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="twitter-quote.png"',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
    
  } catch (error) {
    console.error('Error generating quote:', error);
    return NextResponse.json({ 
      error: 'Failed to generate quote image',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Optional: Add GET method for health check
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    message: 'Twitter Quote Generator API',
    endpoint: 'POST /api/generate-quote',
    timestamp: new Date().toISOString()
  });
}
