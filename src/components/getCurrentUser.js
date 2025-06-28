import { jwtDecode } from "jwt-decode";

//获取user信息
const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        let userInfo;
        let id_token = localStorage.getItem('id_token');
        if(id_token){
            try {
                userInfo = jwtDecode(id_token);
            } catch (error) {
                console.error('Token decode error:', error);
            }
        }
        window.loginedUser = userInfo;
        resolve(userInfo);
    });
};
export default getCurrentUser;
