import React ,{useState,useEffect} from 'react'

import {Button, Checkbox, Form, Input, message} from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import axios from "axios";
import JSEncrypt from 'jsencrypt';

import HelpPng from './img/help.png';
import QRCodePng from './img/QRCode.png';

import './login.scss';

const useGotoRegister=()=>{
    const navigate = useNavigate();
    return ()=> navigate('/register')
};

const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAj+if+YQZ9fmBCu5w7UXgdlhRQ+ao18GBvPR6pK2twKrOs1tdr257wAnlPc5u5KCjyV8igM6XjQBL2RwVPQRPZKRf6GUdXWnoVTKgVtzAejr7F1lK2/bZ73XVS6/FnjNSKbBkaMfUe61I1JUAut8Fl/ikc1Ay5oBavdPPIgRGgwAowkQFLarYhKck4DYyFynq5wGWwFk4nmcf51Atd5TFWQMqoAukCcpbZbY8a2U0h+K9HuhhW4HSeT0f8S5jHjFOLh8yM5IGsUTFnPSaDWktdoxU3nK979ssXohc/O4Sfv87MouEOhkxN2ZLOjF2g0153Acr/8iTN2b6YwzrSyk52QIDAQAB
-----END PUBLIC KEY-----`;

function encryptPassword(password) {
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    return encrypt.encrypt(password);
}

const LoginAndRegisterPage=()=>{

    const {t}=useTranslation();
    const [waxberryType,setWaxberryType]=useState(0);

    const waxberryTypeChange=(type)=>{
        setWaxberryType(type)
    };

    return <div className="loginPage">
        <div className="formContainer">
            <div className="waxberry-type">
                <div className={waxberryType===0?"type type-active":"type"} onClick={()=>waxberryTypeChange(0)}>{t('login.loginByPassword')}</div>
                <div className={waxberryType===1?"type type-active":"type"} onClick={()=>waxberryTypeChange(1)}>{t('login.loginByValidate')}</div>
            </div>
            { waxberryType===0 && <Login/> }
            { waxberryType===1 && <LoginByVerificationCode/> }
        </div>
        <div className="help">
            <img src={HelpPng}/>
            <div className="help-info">
                <img src={QRCodePng} width={122} height={122}/>
                <div className="info">
                    <span>扫描图中二维码联系客服</span>
                    <span>或</span>
                    <span>联系邮箱：info@bjgongruan.com</span>
                </div>
            </div>
        </div>
    </div>
}
const Login=()=>{
    const {t}=useTranslation();
    const [form]=Form.useForm();
    const gotoRegister=useGotoRegister();

    const onFinish = (loginForm) => {
        const encryptedPwd = encryptPassword(loginForm.password);
        if (!encryptedPwd) {
            message.warning('加密失败，请重试');
            return;
        }
        loginForm.password = encryptedPwd;

        axios.post(`${globalInitConfig.REACT_APP_API_AUTH_URL}login/loginCheck`, loginForm).then(res=>{
            if(res.data.code === 200){
                let tempForm = document.createElement("form");
                tempForm.action = window.location.origin + "/login";
                tempForm.method = "post";
                tempForm.style.display = "none";
                for (let x in loginForm) {
                    let opt = document.createElement("input");
                    opt.name = x;
                    opt.value = loginForm[x];
                    tempForm.appendChild(opt);
                }
                document.body.appendChild(tempForm);
                tempForm.submit();
            }else{
                form.setFields([{name: 'password', value: '', errors: [res.data.message],}])
            }
        });


    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    return  <Form
        initialValues={{
            mobile:'',
            password:'',
        }}
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
    >

        <Form.Item required={false}  name="mobile" label={t('login.account')} rules={[{ required: true ,message:t('login.rulesAccount')}]}>
            <Input placeholder={t('login.accountPlaceholder')}/>
        </Form.Item>

        <Form.Item name="password" required={false}
                   rules={[{ required: true, message: t('login.passwordPrompt') }]} label={t('login.password')} >
            <Input.Password   placeholder={t('login.passwordPlaceholder')}/>
        </Form.Item>
        <Form.Item
            name="remember"
            valuePropName="checked"
            label={null}
            rules={[{
                validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error(t('login.rememberErr'))),
            }]}
        >
            <Checkbox>
                <div className="protocolNotice">
                    <span>{t('login.prompt1')}</span>
                    <Button type="text" onClick={()=>window.open("/docs/terms.html")}>{t('login.protocol1')}</Button>
                    <span>{t('login.prompt2')}</span>
                    <Button type="text" onClick={()=>window.open("/docs/privacy.html")}>{t('login.protocol2')}</Button>
                </div>
            </Checkbox>
        </Form.Item>
        <Form.Item label={null}>
            <Button style={{width:'100%',padding:'24px 0',marginTop:40}} htmlType="submit" type="primary">
                {t('login.login')}
            </Button>
        </Form.Item>

        <Button onClick={gotoRegister}  style={{width:'100%',color:'#5A4BFF'}} type="text"  >
            {t('login.registerEntry')}
        </Button>

    </Form>

};
const LoginByVerificationCode=()=>{
    const {t}=useTranslation();
    const [form]=Form.useForm();
    const [time,setTime]=useState(0);
    const gotoRegister=useGotoRegister();

    useEffect(()=>{
        if(time>0){
            setTimeout(() => {
                let newTime=time;
                newTime--;
                setTime(newTime)
            }, 1000);
        }
    },[time]);

    const getVerificationCode=()=>{
        form.validateFields(['mobile'])
            .then(values => {
                setTime(60);
                axios.post(globalInitConfig.REACT_APP_API_AUTH_URL + "sms/smsLogin", values).then(res=>{
                    if(res.data.code !== 200) {
                        form.setFields([{name: 'code', errors: [res.data.message],}])
                    }
                });
            })
            .catch(errorInfo => {
                console.log('Validation Failed:', errorInfo);
            });

    };

    const onFinish = (loginForm) => {
        loginForm.auth_type = "sms";

        axios.post(`${globalInitConfig.REACT_APP_API_AUTH_URL}login/loginCheck`, loginForm).then(res=>{
            if(res.data.code === 200){
                let tempForm = document.createElement("form");
                tempForm.action = window.location.origin + "/login";
                tempForm.method = "post";
                tempForm.style.display = "none";
                for (let x in loginForm) {
                    let opt = document.createElement("input");
                    opt.name = x;
                    opt.value = loginForm[x];
                    tempForm.appendChild(opt);
                }
                document.body.appendChild(tempForm);
                tempForm.submit();
            }else{
                form.setFields([{name: 'code', value: '', errors: [res.data.message],}])
            }
        });

    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    return  <Form
        initialValues={{
            mobile:'',
            code:'',
        }}
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
    >

        <Form.Item
            required={false}
            name="mobile"
            label={t('login.phoneNumber')}
            rules={[
                { required: true ,message:t('login.phoneNumberPlaceholder')},
                { pattern: /^1(3|4|5|6|7|8|9)\d{9}$/, message: t('login.incorrectPhoneNumberFormat') }
            ]}
        >
            <Input placeholder={t('login.phoneNumberPlaceholder')}/>
        </Form.Item>

        <Form.Item
            name="code"
            required={false}
            rules={[{ required: true, message: t('login.verificationCodePlaceholder') }]}
            label={t('login.verificationCode')}
        >
            <Input addonAfter={
                <Button disabled={(time>0)} onClick={getVerificationCode} type="text">{time>0?`${t('login.regainCode')}(${time})`
                    :t('login.getVerificationCode')}</Button>
            }   placeholder={t('login.verificationCodePlaceholder')}/>
        </Form.Item>
        <Form.Item
            name="remember"
            valuePropName="checked"
            label={null}
            rules={[{
                validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error(t('login.rememberErr'))),
            }]}
        >
            <Checkbox>
                <div className="protocolNotice">
                    <span>{t('login.prompt1')}</span>
                    <Button type="text" onClick={()=>window.open("/docs/terms.html")}>{t('login.protocol1')}</Button>
                    <span>{t('login.prompt2')}</span>
                    <Button type="text" onClick={()=>window.open("/docs/privacy.html")}>{t('login.protocol2')}</Button>
                </div>
            </Checkbox>
        </Form.Item>
        <Form.Item label={null}>
            <Button style={{width:'100%',padding:'24px 0',marginTop:40}} htmlType="submit" type="primary">
                {t('login.login')}
            </Button>
        </Form.Item>

        <Button onClick={gotoRegister}  style={{width:'100%',color:'#5A4BFF'}} type="text"  >
            {t('login.registerEntry')}
        </Button>

    </Form>
};

export default LoginAndRegisterPage
