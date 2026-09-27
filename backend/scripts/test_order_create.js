require('dotenv').config();
const http = require('http');

async function testOrder() {
  const reqProducts = http.get('http://localhost:4000/api/products', (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      try {
        const products = JSON.parse(body);
        if (!products || products.length === 0) {
          console.log('No products found to test order');
          process.exit(1);
        }
        const productId = products[0]._id;
        console.log('Found product ID:', productId);

        const orderData = JSON.stringify({
          items: [{ productId, quantity: 2 }],
          orderType: 'Dine-in',
          notes: 'Test customer booking'
        });

        const reqOptions = {
          hostname: 'localhost',
          port: 4000,
          path: '/api/orders',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(orderData)
          }
        };

        const postReq = http.request(reqOptions, (postRes) => {
          let postBody = '';
          postRes.on('data', chunk => postBody += chunk);
          postRes.on('end', () => {
            console.log('HTTP Status Code:', postRes.statusCode);
            console.log('Response Body:', postBody);
            if (postRes.statusCode === 201) {
              console.log('ORDER BOOKING SUCCESSFUL!');
            } else {
              console.error('ORDER BOOKING FAILED!');
            }
          });
        });

        postReq.on('error', console.error);
        postReq.write(orderData);
        postReq.end();
      } catch (err) {
        console.error(err);
      }
    });
  });

  reqProducts.on('error', console.error);
}

testOrder();
