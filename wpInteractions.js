const WooCommerceAPI = require('woocommerce-api');
var fs = require('fs');

const WooCommerce = new WooCommerceAPI({
  url: 'https://shop.jakesarchery.com',
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECERET,
  wpAPI: true,
  version: 'wc/v2',
  queryStringAuth: true // Force Basic Authentication as query string true and using under HTTPS
});



module.exports = {
  getInventory: async () => {

    const promises = []
    for (page = 1; page <= 50; page++) {
      promises.push(new Promise((resolve, reject) => { WooCommerce.get(`products?page=${page}&per_page=100`, (err, data, res) => {
        if (err) reject(err);
        try{
          resolve(JSON.parse(res));
        } catch(e) {
          reject(e);
        }
      });
    }));
    }
    const callArray = await Promise.all(promises);
    return callArray.reduce((acc, item) => {
      if(!Array.isArray(item)) {
        product = {
          id: item.id,
          sku: item.sku,
          price: item.price,
          stock: stock_quantity,
          backordered: backordered
        }
        item = [item];
      }
      return [...acc, ...item];
    },[])
  },
  getProduct: async (productId) => {
    return await new Promise((resolve, reject) => {
      WooCommerce.get(`products/attributes/${productId}`, (err, data, res) => {
        if(err) reject(err);
        resolve(JSON.parse(res));
      });
    });
  },
  updateProduct: async (productId, object) => {
    return await new Promise((resolve, reject) => {
    WooCommerce.post(`products/${productId}`, object, (err, data, res) => {
      if(err) reject(err);
      resolve(res);
    });
  });
  },
  batchUpdateProducts: async (object) => {
    WooCommerce.post('products/batch', object);
  }
}

