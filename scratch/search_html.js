async function test() {
  const url = 'https://www.laborum.cl/empleos-busqueda-desarrollador.html';
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      }
    });

    if (!response.ok) {
      console.log('Failed to fetch:', response.status);
      return;
    }

    const html = await response.text();
    console.log('HTML Length:', html.length);
    
    // Check if the HTML contains the word "desarrollador" outside of the title/meta tags
    // Let's count how many times "desarrollador" occurs in the HTML
    const count = (html.match(/desarrollador/gi) || []).length;
    console.log('Count of "desarrollador" in HTML:', count);

    // Let's search for "window." variables
    const matches = html.match(/window\.[a-zA-Z0-9_$]+\s*=/g);
    console.log('Found window variables assignments:', matches);

    // Let's look for large JSON-like substrings inside script tags or variables
    const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
    let match;
    let index = 0;
    while ((match = scriptRegex.exec(html)) !== null) {
      const content = match[1].trim();
      if (content.length > 500) {
        console.log(`Script ${index} (large, length ${content.length}) starts with:`, content.substring(0, 300));
        // Check if it contains "desarrollador"
        if (content.toLowerCase().includes('desarrollador')) {
          console.log(`Script ${index} contains "desarrollador"!`);
        }
      }
      index++;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
