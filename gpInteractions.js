const sql = require('mssql');
const fs = require('fs');
//const json2csv = require("json-2-csv").json2csv;

const config = {
    user: process.env.GP_USER,
    password: process.env.GP_PASSWORD,
    server: process.env.GP_SERVER,
    database: 'JAKES',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
}

module.exports = async () => {
    try {
        const query = `SELECT a.ITEMNMBR,a.ITEMCODE,a.SELNGUOM,a.STNDCOST,a.MINSHELF1,b.QTYONHND,b.ATYALLOC,b.PRIMVNDR,c.PRCLEVEL,c.UOMPRICE
                        FROM IV00101 a
                            INNER JOIN IV00102 b
                                ON a.ITEMNMBR = b.ITEMNMBR
                            INNER JOIN IV00108 c
                                ON a.ITEMNMBR = c.ITEMNMBR`;
        const pool = await new sql.ConnectionPool(config);
        await pool.connect();
        let request = new sql.Request(pool);
        let results = await request.query(query);
        await pool.close();
        return results;
    } catch (err) {
        console.log(err);
    }
}