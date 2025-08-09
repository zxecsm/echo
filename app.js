import * as os from 'os';
import express from 'express';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.all('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  const response = {
    method: req.method,
    headers: req.headers,
    query: req.query,
    body: req.body,
    params: req.params,
    originalUrl: req.originalUrl,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  };

  res.json(response);
});

const port = 3000;
app.listen(port, () => {
  const arr = getLocalhost().map(
    (item) => `http://${item}${port === 80 ? '' : `:${port}`}/`
  );
  console.log(`服务开启成功，访问地址为：\n${arr.join('\n')}`);
});

function getLocalhost() {
  const obj = os.networkInterfaces();
  let arr = [];
  Object.keys(obj).forEach((item) => {
    let value = obj[item];
    if (Array.isArray(value)) {
      arr = [
        ...arr,
        ...value
          .filter((item) => item.family === 'IPv4' && !item.internal)
          .map((item) => item.address),
      ];
    }
  });
  return arr;
}
