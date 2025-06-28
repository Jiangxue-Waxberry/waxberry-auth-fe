import axios from 'axios';

// 全局默认配置
axios.defaults.timeout = 30000;
axios.defaults.withCredentials = true;
axios.defaults.headers['Content-Type'] = 'application/json';
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';
const token = localStorage.getItem('access_token');
axios.defaults.headers['Authorization'] = token ? `Bearer ${token}` : '';

const whiteList=[];
// 触发401错误处理
const trigger401Handler = (error) => {

    if(!whiteList.includes(location.pathname)){
        return;
    }

    // 返回一个成功的响应，允许程序继续运行
    return Promise.resolve({
        data: {
            code: 200,
            data: null,
            message: 'Unauthorized but continuing'
        }
    });
};

// 响应拦截器
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        console.log('Axios Error:', error);
        console.log('Status:', error.response?.status);

        // 对401错误特殊处理
        if (error.response && error.response.status === 401) {
            console.log('401 error detected, triggering handler');
            return trigger401Handler(error);
        }

        // 其他错误仍然显示错误消息
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);
