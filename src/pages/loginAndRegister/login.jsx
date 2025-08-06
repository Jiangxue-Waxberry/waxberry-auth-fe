import React ,{useState,useEffect} from 'react'
import './login.scss'
import { Button, Checkbox, Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const useGotoRegister=()=>{
    const navigate = useNavigate();
    return ()=> navigate('/register')
}

const LoginAndRegisterPage=()=>{

    const {t}=useTranslation();
    const [waxberryType,setWaxberryType]=useState(0);
    const [error,setError]=useState("");

    const waxberryTypeChange=(type)=>{
        setError("");
        setWaxberryType(type)
    };

    useEffect(() => {
        let err  = location.href.split('error=');
        if(err.length>1){
            if(err[1] === "bad_credentials"){
                setError(t('login.usernameOrPasswordError'));
            }
            if(err[1] === "disabled"){
                setError(t('login.currentUserUnauthenticated'));
            }
            if(err[1] === "user_not_found"){
                setError(t('login.userNotRegistered'));
            }
            if(err[1] === "user_disabled"){
                setError(t('login.userDisabled'));
            }
        }
    }, []);

    return <div className="loginPage">
        <div className="formContainer">
            <div className="waxberry-type">
                <div className={waxberryType===0?"type type-active":"type"} onClick={()=>waxberryTypeChange(0)}>{t('login.loginByPassword')}</div>
                <div className={waxberryType===1?"type type-active":"type"} onClick={()=>waxberryTypeChange(1)}>{t('login.loginByValidate')}</div>
            </div>
            { waxberryType===0 && <Login error={error}/> }
            { waxberryType===1 && <LoginByVerificationCode error={error}/> }
        </div>
    </div>
}
const Login=({error})=>{
    const {t}=useTranslation();
    const [form]=Form.useForm();
    const gotoRegister=useGotoRegister();

    useEffect(() => {
        if(error){
            form.setFields([{name: 'password', errors: [error],}])
        }
    }, [error]);

    const onFinish = (loginForm) => {
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
        <Form.Item name="remember" valuePropName="checked" label={null}>
            <Checkbox>{t('login.rememberUser')}</Checkbox>
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
const LoginByVerificationCode=({error})=>{
    const {t}=useTranslation();
    const [form]=Form.useForm();
    const [time,setTime]=useState(0);
    const gotoRegister=useGotoRegister();

    useEffect(() => {
        if(error){
            form.setFields([{name: 'code', errors: [error],}])
        }
    }, [error]);

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
                axios.post(globalInitConfig.REACT_APP_API_AUTH_URL + "sms/smsLogin", values).then(res=>{
                    if(res.data.code !== 200) {
                        form.setFields([{name: 'code', errors: [res.data.message],}])
                    }
                    setTime(60)
                });
            })
            .catch(errorInfo => {
                console.log('Validation Failed:', errorInfo);
            });

    };

    const onFinish = (loginForm) => {
        loginForm.auth_type = "sms";
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
                    <Button type="text" >{t('login.protocol1')}</Button>
                    <span>{t('login.prompt2')}</span>
                    <Button type="text" >{t('login.protocol2')}</Button>
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
