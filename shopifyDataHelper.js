const fs=require('fs')



const readData=(filename)=>{
   
    try {
        const data = fs.readFileSync(filename, 'utf8');
        return data ? JSON.parse(data) : [];
      } catch (err) {
        console.error(err);
        return [];
      }
}

const writeData=async(filename,data)=>{
    fs.writeFile(filename, JSON.stringify(data, null, 2), 'utf8', err => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }


    });
}

function generateShopifyVariants(options,price) {
    const variants = [];
    
    function generateCombinations(index, currentVariant) {
      if (index === options.length) {
        variants.push(currentVariant);
        return;
      }
      
      const option = options[index];
      for (const value of option.values) {
        const updatedVariant = { ...currentVariant };
        updatedVariant[`option${index + 1}`] = value;
        updatedVariant.title += `${value} `;
        generateCombinations(index + 1, updatedVariant);
      }
    }
    
    generateCombinations(0, { title: '', price: price });
  
    return variants.map((variant, index) => {
      variant.title = `Variant ${index + 1}`; // Assign a default title if needed
      return variant;
    });
  }
  

module.exports={
    readData,
    writeData,
    generateShopifyVariants
}