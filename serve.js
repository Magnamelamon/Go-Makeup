import http from 'http';
import fs from 'fs';
import path from 'path';

const server = http.createServer((req, res) => {
  if (req.url === '/backend.zip') {
    const filePath = path.join(process.cwd(), 'backend.zip');
    if (fs.existsSync(filePath)) {
      res.writeHead(200, { 'Content-Type': 'application/zip' });
      const readStream = fs.createReadStream(filePath);
      readStream.pipe(res);
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  } else {
    res.writeHead(200);
    res.end('Server running');
  }
});

server.listen(8080, '0.0.0.0', () => {
  console.log('Serving on 0.0.0.0:8080');
});
