import Axios from 'axios'
import Config from '../config/app.js'
import { message  } from 'antd';
import React from "react";



const service = (env) => {
  return  Axios.create({
      baseURL: Config[env].apiUrl + '/' + Config[env].apiPrefix,
      headers: {
          'Accept': '*/*'
      },
  });
};

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
