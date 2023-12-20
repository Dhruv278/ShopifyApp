const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const app = express()
const path = require('path');
const { authorize, redirect } = require('./shopifyOAuthHelper')
const { addProductToShopifyStore } = require('./productShopify')
const fs = require('fs')
const { readData, writeData } = require('./shopifyDataHelper');
const { default: axios } = require('axios');


dotenv.config();


var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views/'));


app.post('/api/shopify/addProduct/:shop', async (req, res) => {
    const shopifyStores=readData(path.join(__dirname,'data.json') );
    let token;
    shopifyStores.forEach(store=>{
        if(store.shopName.toString()===req.params.shop.toString()){
            // console.log(typeof(store.shopName.toString()),typeof(req.params.shop.toString()))
            token=store.shopToken;
        }
    })

    console.log(token);
    if (!token) {
        // console.log("doneeeeeeeeee")
        return res.status(500).json({
        status: "error",
        message: 'shop not found'
    })
}
    const data = await addProductToShopifyStore(req.params.shop, token, req.body);
    res.status(200).json({
        data
    })
})
app.get('/api/productsData/:storename', async (req, res) => {

    const store = req.params.storename;
    let isError=false;


   let Postdata={
                "filterString": ["type:=product"],
                "method": "get",
                "options": {
                    "data": {
                        "store": "dhruv-testing-store"
                    },
                    "limit": 20,
                    "nFetch": 0,
                    "skip": 0
                },
                "viewName": "short"
            }

  let  productData= await fetch(`https://${store}.blinkstore.xyz/api/blink/product/summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add other headers if required by your API (e.g., authorization headers)
        },
        body: JSON.stringify(Postdata)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
       return data;
       
      })
      .catch(error => {
        isError=true;
        console.log('Error:', error);
      });
    //   console.log(productData.results)
     
 if(!isError || productData){
    res.render('main',{products:productData.results})
 }else{
     res.status(500).json({
        status:"error"
     })
 }
   
    //     curl --location 'https://dhruv-testing-store.blinkstore.xyz/api/blink/product/summary' \
    // --header 'Content-Type: application/json' \
    // --data '{
    //     "filterString":["type:=product"],
    //     "method":"get",
    //     "options":{
    //         "data":{
    //             "store":"dhruv-testing-store"
    //         },
    //         "limit":20,
    //         "nFetch":0,
    //         "skip":0
    //     },
    //     "viewName":"short"
    // }'

})


app.get('/api/shopify/authorize', async (req, res) => {
    return res.redirect(await authorize(req.query.shop));
})

app.get('/api/shopify/redirect', async (req, res) => {
    var data = await redirect(req.query.code, req.query.shop);
    if (data.access_token) {
        let shops = readData(path.join(__dirname,'data.json'));
        let shopFound = false;
        shops.forEach(shop => {
            if (shop.shopName.toString() === req.query.shop.toString()) {
                console.log("doneeee")
                shop.shopToken = data.access_token; // Update the token if the shop exists
                shopFound = true;
                console.log(shop)
            }
        });
        console.log("..............")
        console.log(shops)
       
        if (!shopFound) {
            console.log(
                { shopName: req.query.shop, shopToken: data.access_token }
            )
            shops.push({ shopName: req.query.shop, shopToken: data.access_token }); // Add a new shop if not found
        }
        await writeData(path.join(__dirname,'data.json'), shops);
        res.json({ message: 'Shop token updated or added successfully' });
    } else {
        return res.status(500).json({
            status: "error",
            message: "no token fornd"
        })
    }

})








app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})