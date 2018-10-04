require('dotenv').config();
const wp =  require('./wpInteractions');

(async () => {
    let wpInventory = wp.getProduct(11036);
    const product = await wpInventory;
    const gpProduct = 
    product.reduce();
}) ();