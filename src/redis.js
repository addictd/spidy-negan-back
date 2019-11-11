var redis = require("redis"),
    client = redis.createClient();
 
client.on("error", function (err) {
    console.log("Error " + err);
});

export const setDataRedis = async (key, value) => {
    const expireTime = 60 * 10 ;   // 60seconds * 10
    return await client.set(key, value, 'EX', expireTime );
}

export const getDataRedis = async (key) => {
    return await client.get( key );
}



// export default client;