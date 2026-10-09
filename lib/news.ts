export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: { name: string; url: string };
}

// Try multiple image extraction patterns in order
function extractImage(item: string): string | null {
  // Pattern 1: media:thumbnail (BBC, many feeds)
  let match = item.match(
    /<media:thumbnail[^>]*url="([^"]+)"/
  );
  if (match) return match[1];

  // Pattern 2: media:content (some feeds)
  match = item.match(
    /<media:content[^>]*url="([^"]+)"/
  );
  if (match) return match[1];

  // Pattern 3: enclosure with image type 
  // (ESPN, podcasts-style feeds)
  match = item.match(
    /<enclosure[^>]*url="([^"]+)"[^>]*type="image\/[^"]*"/
  );
  if (match) return match[1];
  
  match = item.match(
    /<enclosure[^>]*type="image\/[^"]*"[^>]*url="([^"]+)"/
  );
  if (match) return match[1];

  // Pattern 4: image inside description HTML
  const descMatch = item.match(
    /<description>([\s\S]*?)<\/description>/
  );
  if (descMatch) {
    const imgMatch = descMatch[1].match(
      /<img[^>]*src="([^"]+)"/
    );
    if (imgMatch) return imgMatch[1];
    
    // Also try within CDATA
    const cdataMatch = descMatch[1].match(
      /<!\[CDATA\[([\s\S]*?)\]\]>/
    );
    if (cdataMatch) {
      const cdataImg = cdataMatch[1].match(
        /<img[^>]*src="([^"]+)"/
      );
      if (cdataImg) return cdataImg[1];
    }
  }

  // Pattern 5: <image><url>X</url></image> 
  match = item.match(
    /<image>[\s\S]*?<url>(.*?)<\/url>[\s\S]*?<\/image>/
  );
  if (match) return match[1];

  // Pattern 6: catch-all — find ANY image URL
  // from known CDN domains anywhere in the item
  const cdnPatterns = [
    /https?:\/\/[^\s"'<>]+[\.-]espncdn\.com[^\s"'<>]*/,
    /https?:\/\/ichef\.bbci\.co\.uk[^\s"'<>]*/,
    /https?:\/\/[^\s"'<>]+\.bbci\.co\.uk[^\s"'<>]*/,
    /https?:\/\/[^\s"'<>]+\.(jpg|jpeg|png|webp|gif)(\?[^\s"'<>]*)?/i,
  ];
  
  for (const pattern of cdnPatterns) {
    const m = item.match(pattern);
    if (m) return m[0];
  }

  return null;
}

// Parse a single RSS feed
async function parseRSSFeed(
  url: string, 
  sourceName: string,
  sourceUrl: string
): Promise<NewsArticle[]> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)'
      },
      next: { revalidate: 1800 }
    });

    if (!res.ok) {
      console.warn(`RSS fetch failed for ${sourceName}: ${res.status}`);
      return [];
    }

    const xml = await res.text();
    const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];

    if (items && items[0]) {
      console.log(`\n=== RAW ITEM SAMPLE: ${sourceName} ===`);
      console.log(items[0].slice(0, 1500));
      console.log(`=== END SAMPLE ===\n`);
    }

    return items.map(item => {
      // Title — handle CDATA and HTML entities
      let title = item.match(
        /<title><!\[CDATA\[(.*?)\]\]><\/title>/
      )?.[1] || 
      item.match(/<title>(.*?)<\/title>/)?.[1] || '';
      title = decodeHTMLEntities(title.trim());

      // Description
      let description = item.match(
        /<description><!\[CDATA\[(.*?)\]\]><\/description>/
      )?.[1] ||
      item.match(/<description>(.*?)<\/description>/)?.[1] || '';
      description = decodeHTMLEntities(
        description.replace(/<[^>]+>/g, '').trim()
      ).slice(0, 250);

      // Link
      let articleUrl = item.match(
        /<link>(.*?)<\/link>/
      )?.[1] || '';
      
      const linkCdata = articleUrl.match(/<!\[CDATA\[(.*?)\]\]>/);
      if (linkCdata) {
        articleUrl = linkCdata[1];
      }
      articleUrl = articleUrl.trim();
      
      // Google News RSS wraps actual URL — try to extract
      if (sourceName === 'Google News') {
        const sourceMatch = item.match(
          /<source url="(.*?)"/
        );
        // Keep Google News link as-is, it redirects properly
      }

      // Published date
      const pubDate = item.match(
        /<pubDate>(.*?)<\/pubDate>/
      )?.[1] || new Date().toISOString();

      // Image — try multiple formats
      let image = extractImage(item);
      
      // Validate it's actually a usable URL
      if (image && !image.startsWith('http')) {
        image = null;
      }

      // For Google News, try to get source from <source> tag
      let actualSource = sourceName;
      if (sourceName === 'Google News') {
        const srcTag = item.match(
          /<source[^>]*>(.*?)<\/source>/
        )?.[1];
        if (srcTag) actualSource = decodeHTMLEntities(srcTag.trim());
      }

      return {
        title,
        description,
        url: articleUrl,
        image,
        publishedAt: new Date(pubDate).toISOString(),
        source: { name: actualSource, url: sourceUrl }
      };
    }).filter(a => 
      a.title.length > 10 && 
      a.url.length > 5 &&
      !a.title.toLowerCase().includes('subscribe')
    );
  } catch (err) {
    console.error(`RSS parse error for ${sourceName}:`, err);
    return [];
  }
}

function decodeHTMLEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)' },
      signal: AbortSignal.timeout(5000)
    });
    if (!res.ok) return null;
    
    const html = await res.text();
    
    const ogMatch = html.match(
      /<meta[^>]*property="og:image"[^>]*content="([^"]+)"/
    ) || html.match(
      /<meta[^>]*content="([^"]+)"[^>]*property="og:image"/
    );
    
    if (ogMatch) return ogMatch[1];
    
    const twitterMatch = html.match(
      /<meta[^>]*name="twitter:image"[^>]*content="([^"]+)"/
    );
    
    return twitterMatch?.[1] || null;
  } catch (err) {
    return null;
  }
}

// Fetch from all RSS sources in parallel
export async function fetchAllNews(): Promise<NewsArticle[]> {
  const feeds = [
    {
      url: 'https://news.google.com/rss/search?q=%22FIFA+World+Cup+2026%22+when:2d&hl=en-US&gl=US&ceid=US:en',
      name: 'Google News',
      sourceUrl: 'https://news.google.com'
    },
    {
      url: 'https://feeds.bbci.co.uk/sport/football/rss.xml',
      name: 'BBC Sport',
      sourceUrl: 'https://bbc.co.uk/sport/football'
    },
    {
      url: 'https://www.espn.com/espn/rss/soccer/news',
      name: 'ESPN',
      sourceUrl: 'https://espn.com/soccer'
    },
    {
      url: 'https://news.google.com/rss/search?q=%22World+Cup+2026%22+goal+OR+match+OR+squad+when:1d&hl=en-US&gl=US&ceid=US:en',
      name: 'Google News',
      sourceUrl: 'https://news.google.com'
    },
    {
      url: 'https://www.theguardian.com/football/rss',
      name: 'The Guardian',
      sourceUrl: 'https://theguardian.com/football'
    },
    {
      url: 'https://www.aljazeera.com/xml/rss/all.xml',
      name: 'Al Jazeera',
      sourceUrl: 'https://aljazeera.com'
    },
  ];

  const results = await Promise.allSettled(
    feeds.map(f => parseRSSFeed(f.url, f.name, f.sourceUrl))
  );

  let allArticles: NewsArticle[] = [];
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') {
      const parsed = r.value;
      const withImages = parsed.filter(a => a.image).length;
      console.log(
        `${feeds[i].name}: ${parsed.length} articles, ${withImages} with images`
      );
      allArticles.push(...parsed);
    } else {
      console.error(`${feeds[i].name} failed:`, r.reason);
    }
  });

  // Filter: only football/World Cup related
  // (BBC and ESPN feeds are general football, 
  //  filter for World Cup relevance)
  const keywords = [
    'world cup', 'fifa', '2026', 'qualifier',
    'messi', 'ronaldo', 'mbapp', 'haaland',
    'national team', 'squad'
  ];

  allArticles = allArticles.filter(a => {
    const text = (a.title + ' ' + a.description).toLowerCase();
    return keywords.some(k => text.includes(k));
  });

  // Dedupe by similar titles (first 40 chars)
  const seen = new Set<string>();
  allArticles = allArticles.filter(a => {
    const key = a.title.toLowerCase().slice(0, 40);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort by published date
  allArticles.sort((a, b) =>
    new Date(b.publishedAt).getTime() - 
    new Date(a.publishedAt).getTime()
  );

  // For articles without images from feed,
  // try scraping og:image (max 8 to limit time)
  const needsImage = allArticles.filter(a => !a.image);
  const toScrape = needsImage.slice(0, 8);

  await Promise.all(toScrape.map(async (article) => {
    const ogImage = await fetchOgImage(article.url);
    if (ogImage) article.image = ogImage;
  }));

  console.log(`Scraped og:image for ${
    toScrape.filter(a => a.image).length
}/${toScrape.length} articles`);

  return allArticles;
}
