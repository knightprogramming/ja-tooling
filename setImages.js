var WooCommerceAPI = require('woocommerce-api');
var fs = require('fs');

var WooCommerce = new WooCommerceAPI({
  url: 'https://shop.jakesarchery.com',
  consumerKey: 'process.env.CONSUMER_KEYU',
  consumerSecret: 'process.env.CONSUMER_SECRET',
  wpAPI: true,
  version: 'wc/v2',
  queryStringAuth: true // Force Basic Authentication as query string true and using under HTTPS
});
for(page = 1; page<=50; page++){
    WooCommerce.get(`products?page=${page}&per_page=100`, function(err, oldData, res) {
        if(err) console.log(err);
        try{
        wcOldProducts = JSON.parse(res);
        const data = wcOldProducts.reduce((acc, item) => {
                acc.update.push({
                    "id": item.id,
                    "images": [
                        {
                            "src": `http://shopjakesarchery.s3.amazonaws.com/${item.sku}.jpg`,
                            "position": 0
                        }
                    ]
                });
            return acc;
        },{update:[]});
        console.log(data);
        WooCommerce.post('products/batch', data, function(err, data, res) {
            console.log(res);
        });
    }catch(e) {
        console.log(e);
    }
    });  
}
