const cheerio = require('cheerio');

async function scrapeLaborum(keyword, regionName) {
  const cleanKeyword = keyword
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  const searchUrl = `https://www.laborum.cl/empleos-busqueda-${cleanKeyword}.html`;

  try {
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      }
    });

    console.log('Status:', response.status);

    if (!response.ok) {
      console.warn(`Laborum returned status ${response.status} for ${searchUrl}`);
      return [];
    }

    const html = await response.text();
    console.log('HTML Length:', html.length);
    const $ = cheerio.load(html);
    
    $('script').each((i, el) => {
      const id = $(el).attr('id');
      const src = $(el).attr('src');
      console.log(`Script ${i}: id=${id}, src=${src}`);
      if (!src) {
        const content = $(el).html();
        console.log(`Script ${i} content (first 400 chars):`, content ? content.substring(0, 400) : 'empty');
      }
    });

    const jobs = [];

    const filterWords = keyword.toLowerCase().split(' ').filter(w => w.length > 2);

    $('a[href^="/empleos/"]').each((_, element) => {
      const card = $(element);
      const titulo = card.find('h2').text().trim();
      const relativeUrl = card.attr('href');

      if (titulo && relativeUrl) {
        const matchesKeyword = filterWords.some(word => titulo.toLowerCase().includes(word));
        if (!matchesKeyword && filterWords.length > 0) return;

        const url = `https://www.laborum.cl${relativeUrl}`;

        const h3s = [];
        card.find('h3').each((_, h3El) => {
          h3s.push($(h3El).text().trim());
        });

        const companyCandidate = h3s.find(text => 
          !text.includes('Publicado') && 
          !text.includes('Actualizado') && 
          !['Presencial', 'Híbrido', 'Remoto', 'Teletrabajo'].some(m => text.includes(m)) &&
          !/^\d\.\d$/.test(text)
        );
        const empresa = companyCandidate || 'Confidencial';

        const locationCandidate = h3s.find(text => 
          text !== empresa &&
          !text.includes('Publicado') && 
          !text.includes('Actualizado') && 
          !['Presencial', 'Híbrido', 'Remoto', 'Teletrabajo'].some(m => text.includes(m)) &&
          !/^\d\.\d$/.test(text)
        );
        const region = locationCandidate || 'No especificada';

        if (regionName) {
          const cleanRegionName = regionName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          const cleanJobRegion = region.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          const isMetropolitana = cleanRegionName.includes('metropolitana') || cleanRegionName.includes('santiago');
          const jobMatchesRegion = cleanJobRegion.includes(cleanRegionName) || 
            (isMetropolitana && (cleanJobRegion.includes('santiago') || cleanJobRegion.includes('metropolitana') || cleanJobRegion.includes('providencia') || cleanJobRegion.includes('las condes') || cleanJobRegion.includes('vitacura')));
          
          if (!jobMatchesRegion) return;
        }

        jobs.push({ titulo, url, empresa, region });
      }
    });

    return jobs;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

async function test() {
  console.log('Scraping Laborum in JS for "desarrollador" in "Metropolitana"...');
  const jobs = await scrapeLaborum('desarrollador', 'Región Metropolitana');
  console.log(`Found ${jobs.length} jobs on Laborum:`);
  jobs.slice(0, 10).forEach((j, i) => {
    console.log(`[${i + 1}] ${j.titulo} - ${j.empresa} (${j.region})`);
    console.log(`    URL: ${j.url}`);
  });
}

test();
