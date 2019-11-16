

const node_env = () => {
    // console.log('=========', process.argv);
    let argv = process.argv;
    for (let i = 0; i < argv.length; i++) {
        if (argv[i].indexOf('NODE_ENV') !== -1) {
            let _env = argv[i].split('=')[1];
            // console.log('----------',_env);
            return _env;
        }
    }
    return 'testing';
}


const development = {
    NODE_ENV: "development",
    URL : 'http://localhost',
    PORT: 5060,
    JWT_SECRET_KEY: "You are being watched.",
    TOKEN: 'xxx-dev-crawler',

    DB_HOST: 'www.db4free.net',
    DB_NAME: 'spidynegan',
    DB_USER: 'spidynegan',
    DB_PASSWORD: 'z6e@JmSW2NeqepS',
    DB_PORT: 3306
}

const testing = {
    NODE_ENV: "testing",
    URL : 'http://localhost',
    PORT: 5060,
    JWT_SECRET_KEY: "You are being watched.",
    TOKEN: 'xxx-dev-crawler',

    DB_HOST: 'www.db4free.net',
    DB_NAME: 'spidynegan',
    DB_USER: 'spidynegan',
    DB_PASSWORD: 'z6e@JmSW2NeqepS',
    DB_PORT: 3306
}

const production = {

}



if (node_env().toLowerCase() === 'production') {
    console.log('[PRODUCTION]');
    // export default production;
    module.exports = production;

} else if(node_env().toLowerCase() === 'testing'){
    console.log('[TESTING]');
    // export default testing;
    module.exports = testing;

}else {
    console.log('[DEVELOPMENT]');
    // export default development;
    module.exports = development;
}

