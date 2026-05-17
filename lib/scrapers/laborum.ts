import { JobOffer } from '@/types/job';

export async function scrapeLaborum(keyword: string, regionName?: string): Promise<Partial<JobOffer>[]> {
  const url = 'https://www.laborum.cl/api/avisos/searchV2?pageSize=20&page=0&sort=RECIENTES';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-site-id': 'BMCL',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'es-ES,es;q=0.9',
        'Origin': 'https://www.laborum.cl',
        'Referer': 'https://www.laborum.cl/',
      },
      body: JSON.stringify({
        filtros: [],
        query: keyword,
      }),
    });

    if (!response.ok) {
      console.warn(`Laborum API returned status ${response.status}. It might be protected by Cloudflare WAF.`);
      return [];
    }

    const data = await response.json();
    const jobs: Partial<JobOffer>[] = [];

    if (!data || !Array.isArray(data.content)) {
      return [];
    }

    // Filter keywords locally to ensure strict matching
    const filterWords = keyword.toLowerCase().split(' ').filter(w => w.length > 2);

    for (const item of data.content) {
      const titulo = item.titulo || '';
      const relativeUrl = item.link || item.url || '';

      if (titulo && relativeUrl) {
        // Local keyword filtering
        const matchesKeyword = filterWords.some(word => titulo.toLowerCase().includes(word));
        if (!matchesKeyword && filterWords.length > 0) continue;

        const url = relativeUrl.startsWith('http') ? relativeUrl : `https://www.laborum.cl${relativeUrl}`;
        const empresa = item.confidencial ? 'Confidencial' : (item.empresa || 'Confidencial');
        
        // Location extraction
        const region = item.localizacion || item.ciudad || item.provincia || item.zona || 'No especificada';

        // Local region filtering if regionName is requested
        if (regionName) {
          const cleanRegionName = regionName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          const cleanJobRegion = region.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          
          const isMetropolitana = cleanRegionName.includes('metropolitana') || cleanRegionName.includes('santiago');
          const jobMatchesRegion = cleanJobRegion.includes(cleanRegionName) || 
            (isMetropolitana && (cleanJobRegion.includes('santiago') || cleanJobRegion.includes('metropolitana') || cleanJobRegion.includes('providencia') || cleanJobRegion.includes('las condes') || cleanJobRegion.includes('vitacura')));
          
          if (!jobMatchesRegion) continue;
        }

        jobs.push({
          titulo,
          url,
          empresa,
          region,
          fuente: 'Laborum',
          estado: 'nuevo',
        });
      }
    }

    return jobs;
  } catch (error) {
    console.error('Laborum API scraping error:', error);
    return [];
  }
}
