import axios from 'axios';
import * as cheerio from 'cheerio';

interface WebsiteContent {
  url: string;
  content: string;
  lastUpdated: Date;
}

class WebScraper {
  private static cache: Map<string, WebsiteContent> = new Map();
  private static CACHE_DURATION = 1000 * 60 * 60; // 1 hour

  private static readonly URLS = [
    'https://loyabuzz.com/',
    'https://loyabuzz.com/frequently-asked-questions/',
    'https://loyabuzz.com/contact/',
    'https://loyabuzz.com/terms-of-services/',
    'https://loyabuzz.com/privacy-policy/'
  ];

  static async scrapeAll(): Promise<Map<string, string>> {
    const content = new Map<string, string>();
    console.log('Starting to scrape all URLs...');
    
    for (const url of this.URLS) {
      try {
        console.log(`Scraping ${url}...`);
        const pageContent = await this.scrapePage(url);
        content.set(url, pageContent);
        console.log(`Successfully scraped ${url}`);
      } catch (error) {
        console.error(`Error scraping ${url}:`, error);
      }
    }
    
    return content;
  }

  static async scrapePage(url: string): Promise<string> {
    // Check cache first
    const cached = this.cache.get(url);
    if (cached && (new Date().getTime() - cached.lastUpdated.getTime()) < this.CACHE_DURATION) {
      console.log(`Using cached content for ${url}`);
      return cached.content;
    }

    try {
      console.log(`Fetching content from ${url}...`);
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      // Remove non-content elements
      $('script').remove();
      $('style').remove();
      $('meta').remove();
      $('link').remove();
      $('.cookie-notice').remove();
      $('.popup').remove();
      $('.modal').remove();
      $('.advertisement').remove();

      // Extract main content sections
      let content = '';
      
      // Store URL for context
      content += `URL: ${url}\n\n`;

      // Extract all relevant content from main sections
      console.log('Extracting main content...');
      $('.elementor-widget-container, .elementor-text-editor, .elementor-heading-title').each((_, elem) => {
        const text = $(elem).text().trim();
        if (text && 
            !text.includes('color: #') && 
            !text.includes('http') && 
            text.length > 20) {  // Filter out short snippets
          content += `${text}\n\n`;
        }
      });

      // Extract FAQ content specifically from FAQ page
      if (url.includes('frequently-asked-questions')) {
        console.log('Extracting FAQ content...');
        $('.elementor-toggle-item, .elementor-tab-content').each((_, elem) => {
          const question = $(elem).find('.elementor-toggle-title').text().trim();
          const answer = $(elem).find('.elementor-toggle-content').text().trim();
          if (question && answer) {
            content += `Q: ${question}\nA: ${answer}\n\n`;
          }
        });
      }

      // Clean up the content
      content = content
        .replace(/\s+/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/([•\d]\.?) +/g, '$1 ')
        .replace(/\[Source: [^\]]+\]/g, '')
        .replace(/\bhttps?:\/\/[^\s]+\b/g, '')
        .replace(/style="[^"]*"/g, '')
        .replace(/color: #[a-fA-F0-9]{3,6}/g, '')
        .trim();

      console.log(`Scraped content length for ${url}: ${content.length} characters`);
      console.log('Sample of scraped content:', content.substring(0, 500));

      // Update cache
      this.cache.set(url, {
        url,
        content,
        lastUpdated: new Date()
      });

      return content;

    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
      throw error;
    }
  }

  static async getLatestContent(): Promise<string> {
    const content = await this.scrapeAll();
    let combinedContent = '';

    // Add known FAQs
    combinedContent += `FAQ Section:
Q: How does LoyaBuzz App work?
A: A mobile app that allows users to discover nearby business, access exclusive promotions, and earn cashback and digital stamp rewards on their purchase. Simply download the app, sign up and start exploring!

Q: Is LoyaBuzz free to use?
A: Yes! it's completely free to download and use. There are no subscription fees or hidden charges. Simply download the app and start enjoying the benefits of cashback and digital Stamps rewards.

Q: How do I earn cashback rewards with LoyaBuzz?
A: Earning cashback rewards with LoyaBuzz is easy! Simply shop at participating businesses, scan the QR code provided at checkout and earn cashback rewards directly into your LoyaBuzz account. The more you shop, the more you earn!

Q: How do I redeem my cashback rewards?
A: Redeeming your cashback rewards with kash4me is simple. Once you've accumulated enough cashback in your account, you can choose to redeem it at the same shop, different shop or even deposit directly to your bank account.

Q: What types of businesses are available on LoyaBuzz?
A: LoyaBuzz offers a diverse range of businesses. Sign up and check out the varieties of businesses that have partnered up with LoyaBuzz. With such a wide selection, there's something for everyone on LoyaBuzz!

Q: Is my personal information safe with LoyaBuzz?
A: Yes, protecting your privacy and security is our top priority at LoyaBuzz. We use industry-standard encryption and security protocols to safeguard your personal information and ensure a safe and secure experience for all users.\n\n`;

    for (const [url, pageContent] of content.entries()) {
      combinedContent += `Content from ${url}:\n${pageContent}\n\n`;
    }

    // Limit total content size to avoid token limits
    if (combinedContent.length > 4000) {
      combinedContent = combinedContent.substring(0, 4000) + '...';
    }

    return combinedContent;
  }
}

export default WebScraper; 