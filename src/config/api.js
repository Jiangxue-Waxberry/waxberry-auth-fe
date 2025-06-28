// API接口配置
export const API = {
  // 用户相关接口
  user: {
    login: '/user/login',
    logout: '/user/logout',
    profile: '/user/profile',
    updateProfile: '/user/profile/update',
    changePassword: '/user/password/change',
  },
  
  // 系统设置相关接口
  settings: {
    getSettings: '/settings',
    updateSettings: '/settings/update',
  },
  
  // 仪表盘相关接口
  dashboard: {
    getStatistics: '/dashboard/statistics',
    getCharts: '/dashboard/charts',
  },
  
  // 其他模块接口...
};

// 接口响应状态码
export const API_STATUS = {
  SUCCESS: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

// 接口响应消息
export const API_MESSAGE = {
  SUCCESS: '操作成功',
  ERROR: '操作失败',
  UNAUTHORIZED: '未授权，请重新登录',
  FORBIDDEN: '没有权限访问',
  NOT_FOUND: '请求的资源不存在',
  SERVER_ERROR: '服务器错误',
}; 