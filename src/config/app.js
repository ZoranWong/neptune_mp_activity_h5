

//const devApiUrl = 'https://www.neptune.kingdomcloud.cn';
const devApiUrl = 'http://neptune.klsfood.cn';
//const proApiUrl = 'http://neptune.klsfood.cn'; //正式环境变量,注意修改
const proApiUrl = 'https://www.neptune.kingdomcloud.cn'; //测试服务器,注意修改

const nodeDevEnv = process.env.NODE_ENV=='development' ? true : false;

console.log(process.env, '=================================================>');


export default {
    nodeDevEnv:nodeDevEnv,
    apiUrl : nodeDevEnv ? devApiUrl : proApiUrl,
    apiPrefix : "",
    tokenKey:'ACCESS_TOKEN',
    storageUserKey:'USER_STORAGE',
}
