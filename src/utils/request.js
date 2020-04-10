import Axios from 'axios'
import Config from '../config/app.js'
import { message  } from 'antd';
import React from "react";
let _this = this;
function getQueryVariable (variable , defaultValue) {
    let query = _this.location.search.substring(1);
    let vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return defaultValue;
}

console.log(getQueryVariable('env', 'dev'), 'env');

let env = getQueryVariable('env', 'dev');

const service = Axios.create({
    baseURL: Config[env].apiUrl + '/' + Config[env].apiPrefix,
    headers: {
        'Accept': '*/*'
    },
});

service.interceptors.request.use(
    config => {
        config.headers['Authorization'] = '';
        return config
    },
    error => {
        Promise.reject(error)
    }
);



service.interceptors.response.use(
    response => {//Grade
    	return response.data;
    },
    error => {
		if (error === undefined || error.code === '502') {
			message.error("服务器请求超时");
			return Promise.reject(error)
		}
		const { response } = error;
		console.log(response, '========');
		if(!response || !response.status) return;
		
		
		message.error(response.data.message);// 弹出后端返回的错误
		message.error(response.data.message);
        return Promise.reject(error)//千万不能去掉，，，否则请求超时会进入到then方法，导致逻辑错误。
	}
);

export default service
