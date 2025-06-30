# Waxberry Auth Frontend

一个基于React的现代化用户认证前端系统，提供完整的登录、注册和用户管理功能，支持多种用户类型注册。

## 功能特性

- **多方式登录**
  - 密码登录
  - 短信验证码登录
  - 记住登录状态

- **多类型用户注册**
  - 高校用户注册（学校、学院、专业信息）
  - 企业用户注册（企业名称、统一社会信用代码）
  - 个人用户注册
  - 短信验证码验证

- **安全特性**
  - JWT Token 认证
  - 表单验证和密码强度检查
  - 防暴力破解机制
  - 用户状态管理

- **用户体验**
  - 响应式设计
  - 国际化支持（中文/英文）
  - 现代化UI界面（Ant Design）
  - 实时表单验证

## 技术栈

- **前端框架**: React 18.2.0
- **UI组件库**: Ant Design 5.3.0
- **路由管理**: React Router DOM 6.8.2
- **HTTP客户端**: Axios 1.3.4
- **状态管理**: React Hooks
- **构建工具**: Webpack 5.78.0
- **样式预处理**: Sass 1.85.1
- **国际化**: react-i18next 13.5.0
- **JWT处理**: jwt-decode 4.0.0

## 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 安装依赖

1. 克隆项目：
```bash
git clone https://github.com/Jiangxue-Waxberry/waxberry-auth-fe.git
cd waxberry-auth-fe
```

2. 安装依赖：
```bash
npm install
# 或使用 yarn
yarn install
```

3. 启动开发服务器：
```bash
npm start
# 或使用 yarn
yarn start
```

应用将在 `http://localhost:3001` 启动。

### 构建生产版本

```bash
npm run build
# 或使用 yarn
yarn build
```

## 项目结构

```
waxberry-auth-fe/
├── public/                    # 静态资源
├── src/
│   ├── pages/
│   │   └── loginAndRegister/  # 登录注册页面
│   │       ├── login.jsx      # 登录组件
│   │       ├── register.jsx   # 注册组件
│   │       ├── login.scss     # 样式文件
│   │       └── img/           # 图片资源
│   ├── components/
│   │   └── getCurrentUser.js  # 用户信息获取
│   ├── config/
│   │   └── api.js            # API接口配置
│   ├── locales/              # 国际化文件
│   │   ├── i18n.js           # i18n配置
│   │   └── languages/        # 语言包
│   │       ├── zh.js         # 中文
│   │       └── en.js         # 英文
│   ├── layouts/              # 布局组件
│   ├── utils/                # 工具函数
│   ├── assets/               # 静态资源
│   ├── App.jsx               # 根组件
│   └── index.js              # 入口文件
├── webpack.config.js         # Webpack配置
├── package.json              # 项目配置
└── README.md                 # 项目说明
```

## 配置说明

### 环境变量

创建 `.env.development` 文件（开发环境）：

```env
# API认证服务地址
REACT_APP_API_AUTH_URL=http://localhost:8000/auth/

# 应用配置
REACT_APP_NAME=Waxberry Auth
REACT_APP_VERSION=1.0.0
```

### Webpack代理配置

开发环境已配置API代理，在 `webpack.config.js` 中：

```javascript
proxy: {
    context: '/auth/',
    target: 'http://localhost:8000',
    changeOrigin: true,
    disableHostCheck: true,
    noInfo: true,
}
```

## 功能详解

### 登录功能

#### 密码登录
- 支持手机号/邮箱登录
- 密码强度验证
- 记住用户名功能
- 错误信息提示

#### 验证码登录
- 手机号验证
- 短信验证码发送
- 60秒倒计时重发
- 验证码格式验证

### 注册功能

#### 高校用户注册
- 学校名称、学院、专业信息
- 学号/教职工工号
- 邮箱验证
- 密码强度要求（大小写字母+数字，不少于8位）

#### 企业用户注册
- 企业名称
- 统一社会信用代码（18位）
- 企业管理员用户名
- 完整的表单验证

#### 个人用户注册
- 基础个人信息
- 手机号验证
- 邮箱验证

### 安全机制

- **JWT Token管理**: 使用 `jwt-decode` 解析用户信息
- **表单验证**: 实时验证和提交前验证
- **密码策略**: 强制密码复杂度要求
- **错误处理**: 完善的错误信息展示

## API接口

### 认证相关接口

```javascript
// 短信验证码登录
POST /auth/sms/smsLogin

// 短信验证码注册
POST /auth/sms/smsRegister

// 用户注册
POST /auth/users/register

// 用户登录
POST /login (表单提交)
```

### 用户信息接口

```javascript
// 获取用户信息
const getCurrentUser = () => {
    // 从localStorage获取id_token并解析
    // 返回用户信息对象
}
```

## 国际化支持

项目支持中英文双语切换：

- **中文语言包**: `src/locales/languages/zh.js`
- **英文语言包**: `src/locales/languages/en.js`
- **语言切换**: 通过localStorage存储语言偏好

### 主要翻译内容

- 登录注册表单字段
- 错误提示信息
- 按钮文本
- 页面标题和描述

## 开发指南

### 代码规范

- 使用函数式组件和React Hooks
- 遵循ESLint配置
- 使用Ant Design组件库
- 样式使用SCSS编写

### 组件开发

```javascript
// 示例：登录组件结构
const Login = ({ error }) => {
    const { t } = useTranslation(); // 国际化
    const [form] = Form.useForm();  // 表单管理
    
    // 表单提交处理
    const onFinish = (loginForm) => {
        // 处理登录逻辑
    };
    
    return (
        <Form form={form} onFinish={onFinish}>
            {/* 表单字段 */}
        </Form>
    );
};
```

### 样式开发

使用SCSS编写样式，支持嵌套和变量：

```scss
.loginPage {
    .formContainer {
        .waxberry-type {
            .type {
                &.type-active {
                    // 激活状态样式
                }
            }
        }
    }
}
```

## 部署

### 开发环境

```bash
npm start
```

### 生产环境

```bash
# 构建生产版本
npm run build

# 部署dist目录到Web服务器
```

### Docker部署

```bash
# 构建Docker镜像
docker build -t waxberry-auth-fe .

# 运行容器
docker run -p 80:80 waxberry-auth-fe
```

## 常见问题

### Q: 如何处理跨域问题？
A: 项目已配置Webpack代理，开发环境自动处理跨域请求。

### Q: 如何修改API地址？
A: 在 `.env.development` 文件中修改 `REACT_APP_API_AUTH_URL` 配置。

### Q: 如何添加新的语言支持？
A: 在 `src/locales/languages/` 目录下添加新的语言文件，并在 `i18n.js` 中配置。

### Q: 如何自定义主题颜色？
A: 在 `App.jsx` 中的 `ConfigProvider` 配置 `theme.token.colorPrimary`。

## 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

本项目采用 Apache License 2.0 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。


