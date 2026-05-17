const http2 = require('http2');

function fetchHttp2(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const client = http2.connect(parsedUrl.origin);

    client.on('error', (err) => reject(err));

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
    let responseHeaders = {};

    req.on('response', (headers) => {
      responseHeaders = headers;
    });

    req.on('data', (chunk) => {
      data += chunk;
    });

    req.on('end', () => {
      client.close();
      resolve({
        status: responseHeaders[':status'],
        headers: responseHeaders,
        text: () => Promise.resolve(data),
        json: () => {
          try {
            return Promise.resolve(JSON.parse(data));
          } catch (e) {
            return Promise.reject(new Error('Failed to parse JSON: ' + data.substring(0, 100)));
          }
        }
      });
    });
  });
}

async function test() {
  console.log('Testing HTTP2 GET for Laborum Search HTML...');
  try {
    const resHtml = await fetchHttp2('https://www.laborum.cl/empleos-busqueda-desarrollador.html');
    console.log('GET HTML Status:', resHtml.status);
    console.log('HTML Length:', (await resHtml.text()).length);
  } catch (err) {
    console.error('GET HTML Error:', err);
  }

  console.log('\nTesting HTTP2 POST to searchV2 API...');
  try {
    const resApi = await fetchHttp2('https://www.laborum.cl/api/avisos/searchV2?pageSize=5&page=0&sort=RECIENTES', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-site-id': 'BMCL',
        'origin': 'https://www.laborum.cl',
        'referer': 'https://www.laborum.cl/'
      },
      body: JSON.stringify({
        filtros: [],
        query: 'jefe de proyecto'
      })
    });

    console.log('POST API Status:', resApi.status);
    if (resApi.status === 200) {
      const data = await resApi.json();
      console.log('Total found via HTTP2:', data.total);
      if (data.content) {
        console.log('Sample Job:', data.content[0].titulo, '-', data.content[0].empresa);
      }
    } else {
      console.log('Failed:', await resApi.text());
    }
  } catch (err) {
    console.error('POST API Error:', err);
  }
}

test();
