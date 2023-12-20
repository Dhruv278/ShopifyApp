const axios=require('axios')

const authorize=async (shop)=>{
    return encodeURI(`https://${shop}.myshopify.com/admin/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=${process.env.SCOPE}&redirect_uri=${process.env.REDIRECT_URI}`)
}

const redirect=async(code,shop)=>{
    console.log(code,shop)
    let shopifyOAuthUrl=`https://${shop}/admin/oauth/access_token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}`;

   const {data}=await axios({
        url:shopifyOAuthUrl,
        method:'post',
        data:{}
    }).then(response=>{
        console.log("called")
        console.log(response);
        return response
    }).catch(err=>{
        console.log(err)
        return err
    })

    console.log(data)
    return data;
}

module.exports={
    authorize,
    redirect
}