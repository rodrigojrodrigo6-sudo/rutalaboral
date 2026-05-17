async function test() {
  const query = 'desarrollador';
  const url = 'https://www.laborum.cl/api/avisos/searchV2?pageSize=5&page=0&sort=RECIENTES';
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-site-id': 'BMCL',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({
        filtros: [],
        query: query
      })
    });

    console.log('Status:', response.status);
    if (!response.ok) {
      console.log('Failed to fetch API:', await response.text());
      return;
    }

    const data = await response.json();
    console.log('Total found:', data.total);
    if (data.content && data.content.length > 0) {
      console.log('First aviso keys:', Object.keys(data.content[0]));
      console.log('First aviso sample:', JSON.stringify(data.content[0], null, 2));
    } else {
      console.log('No content in response.');
    }
  } catch (error) {
    console.error('Error in API fetch:', error);
  }
}

test();
