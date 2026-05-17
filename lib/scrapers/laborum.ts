import http2 from 'http2';
import { JobOffer } from '@/types/job';

// Custom lightweight HTTP/2 client to bypass Cloudflare WAF JA3/TLS Fingerprint blocks
function fetchHttp2(urlStr: string, options: { method?: string; headers?: Record<string, string>; body?: string } = {}): Promise<{ status: number; text: () => Promise<string>; json: () => Promise<any> }> {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(urlStr);
      const client = http2.connect(parsedUrl.origin);

      client.on('error', (err) => {
        client.close();
        reject(err);
      });

      const path = parsedUrl.pathname + parsedUrl.search;
      const method = options.method || 'GET';
      
      const headers = {
        ':method': method,
        ':path': path,
        ':scheme': 'https',
        ':authority': parsedUrl.hostname,
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'es-ES,es;q=0.9',
        ...options.headers
      };

      const req = client.request(headers);

      if (options.body) {
        req.write(options.body);
      }
      req.end();

      let data = '';
      let responseStatus = 200;

      req.on('response', (headers) => {
        const statusHeader = headers[':status'];
        responseStatus = statusHeader ? parseInt(Array.isArray(statusHeader) ? statusHeader[0] : statusHeader, 10) : 200;
      });

      req.on('data', (chunk) => {
        data += chunk;
      });

      req.on('end', () => {
        client.close();
        resolve({
          status: responseStatus,
          text: () => Promise.resolve(data),
          json: () => Promise.resolve(JSON.parse(data))
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}

export async function scrapeLaborum(keyword: string, regionName?: string): Promise<Partial<JobOffer>[]> {
  const url = 'https://www.laborum.cl/api/avisos/searchV2?pageSize=20&page=0&sort=RECIENTES';

  try {
    const response = await fetchHttp2(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-site-id': 'BMCL',
        'origin': 'https://www.laborum.cl',
        'referer': 'https://www.laborum.cl/',
      },
      body: JSON.stringify({
        filtros: [],
        query: keyword,
      }),
    });

    if (response.status !== 200) {
      throw new Error(`Conexión fallida (Status ${response.status})`);
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
      const id = item.id;

      if (titulo && id) {
        // Local keyword filtering
        const matchesKeyword = filterWords.some(word => titulo.toLowerCase().includes(word));
        if (!matchesKeyword && filterWords.length > 0) continue;

        // Construct SEO-friendly Laborum Job URL
        const slug = titulo.toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        const jobUrl = `https://www.laborum.cl/empleos/${slug}-${id}.html`;

        const empresa = item.confidencial ? 'Confidencial' : (item.empresa || 'Confidencial');
        const region = item.localizacion || 'No especificada';

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
          url: jobUrl,
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
