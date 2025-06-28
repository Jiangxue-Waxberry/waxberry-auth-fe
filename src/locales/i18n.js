import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zh from './languages/zh';
import en from './languages/en';

const resources = {
    zh: zh,
    en: en
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: localStorage.getItem('language') || 'zh', // 从localStorage读取默认语言
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
