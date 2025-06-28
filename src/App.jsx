import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import './locales/i18n';

import Login from './pages/loginAndRegister/login';
import Register from './pages/loginAndRegister/register';

const App = () => {

  const [antdLocale, setAntdLocale] = useState(zhCN); // 默认中文

  useEffect(() => {
    // 从 localStorage 读取已保存的语言设置
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setAntdLocale(savedLanguage === 'zh' ? zhCN : enUS);
    }

  }, []);

  return (
    <ConfigProvider
      locale={antdLocale}
      theme={{
       token:{
        colorPrimary: '#5a4bff',

       }
      }}
    >
        <Router>
            <Routes>
                <Route index element={<Navigate to="/login" replace />} />
                <Route path="login" element={<Login/>} />
                <Route path="register" element={<Register/>} />
            </Routes>
        </Router>
    </ConfigProvider>
  );
};

export default App;
