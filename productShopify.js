const axios = require('axios');
const {generateShopifyVariants} =require('./shopifyDataHelper')

const addProductToShopifyStore = async (shop, token, payload) => {
    let colors = []
    let options=[];
    if (payload.variantConfig.color) {
        for (clr in payload.variantConfig.color) {
            colors.push(payload.variantConfig.color[clr].name);
        }
        options.push({
            name:'Color',
            values:colors
        })
    }
    let sizes = [];
    if (payload.variantConfig.size) {
        for (size in payload.variantConfig.size) {
            sizes.push(payload.variantConfig.size[size].name);
        }
        options.push({
            name:'Size',
            values:sizes
        })
    }
  const variantsData=generateShopifyVariants(options,payload.price.current);
  console.log(variantsData,);

    // console.log(sizes)
    // let product={
    //     title:payload.name,
    //     
    //     // price:payload.price.current,
    //     options:[{
    //         "name":"Color",
    //         "values":colors
    //     },
    //     {
    //         "name":"size",
    //         "values":sizes
    //     }
    // ]

    // }
    const product = {
        product: {
            title: payload.name,
            body_html:payload.description,
            vendor: 'Blinkstore',
            product_type: payload.of.bku,
            options: options,
            variants:variantsData,
          },
    };


    try {

        console.log(product)

        const uri = `https://${shop}/admin/api/2023-10/products.json`
        console.log(token);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': token
            },
            body: JSON.stringify(product)
        };

        const res = await fetch(uri, options);
        if (!res.ok) {
            console.log(res)
            throw new Error(`Failed with status ${res.status}`);
        }

        const responseData = await res.json();
        console.log(responseData);
        return responseData;
    } catch (error) {
        console.error("Error:", error);
        return { error: error.message };
    }

}


module.exports = {
    addProductToShopifyStore
}