import { scrapeLaborum } from '../lib/scrapers/laborum';

async function test() {
  console.log('Scraping Laborum for "desarrollador" in "Metropolitana"...');
  const jobs = await scrapeLaborum('desarrollador', 'Región Metropolitana');
  console.log(`Found ${jobs.length} jobs on Laborum:`);
  jobs.slice(0, 5).forEach((j, i) => {
    console.log(`[${i + 1}] ${j.titulo} - ${j.empresa} (${j.region})`);
    console.log(`    URL: ${j.url}`);
  });
}

test();
