import * as cheerio from 'cheerio';
import { JobOffer } from '@/types/job';

export async function scrapeChileTrabajos(keyword: string, regionName?: string): Promise<Partial<JobOffer>[]> {
  const regionMap: Record<string, string> = {
    'Región Metropolitana': 'santiago',
    'Valparaíso': 'valparaiso',
    'Biobío': 'concepcion',
    // ... add more as needed
  }
  
  const regionSlug = regionName ? (regionMap[regionName] || regionName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-')) : ''
  const searchUrl = `https://www.chiletrabajos.cl/encuentra-un-empleo?2=${encodeURIComponent(keyword)}${regionSlug ? `&13=${encodeURIComponent(regionSlug)}` : ''}`;
  
  try {
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch ChileTrabajos');
    
    const html = await response.text();
    const $ = cheerio.load(html);
    const jobs: Partial<JobOffer>[] = [];
    
    // Keywords for local filtering (split into words to be more flexible)
    const filterWords = keyword.toLowerCase().split(' ').filter(w => w.length > 2);

    $('div.job-item, h2:has(a[href*="/trabajo/"])').each((_, element) => {
      const titleElement = $(element).is('h2') ? $(element).find('a') : $(element).find('h2 a');
      const titulo = titleElement.text().trim();
      const relativeUrl = titleElement.attr('href');
      
      if (titulo && relativeUrl) {
        // Local filtering: The title must contain at least one of the main keywords
        // This prevents showing "Latest Jobs" that ChileTrabajos shows when no matches are found
        const matchesKeyword = filterWords.some(word => titulo.toLowerCase().includes(word));
        
        if (!matchesKeyword && filterWords.length > 0) return;

        const url = relativeUrl.startsWith('http') ? relativeUrl : `https://www.chiletrabajos.cl${relativeUrl}`;
        
        // Try to find company and region
        const metaText = $(element).nextAll('h3').first().text();
        const [empresa, regionMatch] = metaText.split(',').map(s => s.trim());

        jobs.push({
          titulo,
          url,
          empresa: empresa || 'Confidencial',
          region: regionMatch || 'No especificada',
          fuente: 'ChileTrabajos',
          estado: 'nuevo',
        });
      }
    });
    
    return jobs;
  } catch (error) {
    console.error('Scraping error:', error);
    throw error;
  }
}
