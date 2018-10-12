require('dotenv').config();
const wp =  require('./wpInteractions');
const fs = require('fs');

(async () => {
    // const product = await  wp.getInventory();
    const gpProduct = await require('./gpInteractions')();

    // fs.writeFileSync(`wcInventory${new Date().getUTCHours()}.json`,JSON.stringify(product));
    fs.writeFileSync(`gpInventory${new Date().getUTCHours()}.json`,JSON.stringify(gpProduct, null, '\t'));
    
}) ();