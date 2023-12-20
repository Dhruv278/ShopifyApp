console.log("index.js ")

const pushData = async (name, data) => {
    try {
        const productData = JSON.parse(data);
        const storename = prompt("Enter your Shopify store name: ");

        const url = `https://blinkstore-shopify.onrender.com/api/shopify/addProduct/${storename}`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        };

        const res = await fetch(url, options);
        if (!res.ok) {
            throw new Error(`Failed with status ${res.status}`);
        }

        const responseData = await res.json();
        console.log(responseData);
        return responseData;
    } catch (error) {
        console.error("Error:", error);
        return { error: error.message };
    }
};
