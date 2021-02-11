import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
  // http.get('http://test.k6.io');
  let url = 'http://localhost:3000/api/reviews/';
  let random = Math.floor(Math.random() * 9999999);
  let testUrl = url + random;

  http.get(testUrl);

  sleep(1);
}