require('dotenv').config();
const wp =  require('./wpInteractions');
const fs = require('fs');

(async () => {
    const product = await  wp.getInventory();
    const gpProduct = await require('./gpInteractions')();

    // fs.writeFileSync(`wcInventory${new Date().getUTCHours()}.json`,JSON.stringify(product));
    // fs.writeFileSync(`gpInventory${new Date().getUTCHours()}.json`,JSON.stringify(gpProduct, null, '\t'));
    
    const update = product.reduce((acc, item)=> {
        let gpItem = gpProduct[item.sku];
        if(gpItem && (gpItem.RETAIL != item.price || gpItem.stock != item.stock_quantity)) {
            item.stock_quantity = gpItem.stock.toString();
            item.price = gpItem.RETAIL.toString();
            item.manage_stock = true;
            acc.push(item);
        }
        return acc;
    },[]);
    let ii = 0;
    const task = setInterval(()=>{
        const item = update[ii];
        if(typeof item === 'undefined') return clearInterval(task);
        wp.updateProduct(item.id, item);
        console.log("Updating item: " + item.sku)
        ii++;
    }, 1000);
    console.log("Finsed update.");
    fs.writeFile("wcInvintoryUpdate.json", JSON.stringify(update),() => {});
}) ();