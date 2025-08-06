import React ,{useState,useEffect} from 'react'
import './login.scss'
import { Button, Checkbox, Form, Input, message } from 'antd';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import RegisterSuccess from './img/registerSuccess.png';
import TipPng from './img/tip.png';

const LoginAndRegisterPage=()=>{
    const navigate = useNavigate();
    const {t}=useTranslation();

    const [waxberryType,setWaxberryType]=useState(0);
    const [isRegister, setIsRegister] = useState(false);

    const waxberryTypeChange=(type)=>{
        setWaxberryType(type)
    };

    const handleRegisterSuccess = () => {
        setIsRegister(true);
    };

    return <div className="loginPage">
        {isRegister ?
            <div className="successContainer">
                <img src={RegisterSuccess}/>
                <span className="title">{t('login.registerSuccess')}</span>
                <span className="desc">{t('login.registerSuccessDesc')}</span>
            </div>:
            <div className="formContainer" style={{minWidth: 580,height: 860}}>
                <div className="registerHeader">
                    <div className="waxberry-type">
                        <div className={waxberryType===0?"type type-active":"type"} onClick={()=>waxberryTypeChange(0)}>{t('login.collegeRegistration')}</div>
                        <div className={waxberryType===1?"type type-active":"type"} onClick={()=>waxberryTypeChange(1)}>{t('login.enterpriseRegistration')}</div>
                        <div className={waxberryType===2?"type type-active":"type"} onClick={()=>waxberryTypeChange(2)}>{t('login.individualRegistration')}</div>
                    </div>
                    <div className="gotoLogin">
                        <span >{t('login.existingAccount')}</span>
                        <Button onClick={()=>navigate('/login')}  type="text"  >
                            {t('login.gotoLogin')}
                        </Button>
                    </div>
                </div>
                <div className="tip">
                    <img src={TipPng}/>
                    {waxberryType === 0 && <span className="tipData">{t('login.collegeTip')}</span>}
                    {waxberryType === 1 && <span className="tipData">{t('login.enterpriseTip')}</span>}
                    {waxberryType === 2 && <span className="tipData">{t('login.individualTip')}</span>}
                </div>
                {waxberryType === 0 && <CollegeRegister onSuccess={handleRegisterSuccess} />}
                {waxberryType === 1 && <EnterpriseRegister onSuccess={handleRegisterSuccess} />}
                {waxberryType === 2 && <Register onSuccess={handleRegisterSuccess} />}
            </div>
        }
    </div>
};

const CollegeRegister=({onSuccess})=>{
    const {t}=useTranslation();
    const [form]=Form.useForm();
    const [time,setTime]=useState(0);
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
        form.validateFields(['school','college','email','loginname','password','confirmPassword','mobile'])
            .then(values => {
                axios.post(globalInitConfig.REACT_APP_API_AUTH_URL + "sms/smsRegister", values).then(res=>{
                    if(res.data.code !== 200) {
                        message.warning(res.data.message);
                    }
                    setTime(60)
                });
            })
            .catch(errorInfo => {
                console.log('Validation Failed:', errorInfo);
            });

    };
    const onFinish = (form) => {
        form.userRole = "COLLEGE";
        axios.post(globalInitConfig.REACT_APP_API_AUTH_URL + "users/register", form).then(res=>{
            if(res.data.code === 200){
                message.success(t('login.registrationSuccess'));
                onSuccess();
            }else{
                message.warning(res.data.message);
            }
        });
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };
    return  <Form
        form={form}
        layout="vertical"
        validateTrigger="onBlur"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
    >

        <Form.Item
            name="school"
            label={t('login.schoolName')}
            rules={[{ required: true ,message:t('login.enterSchoolName')}]}
        >
            <Input placeholder={t('login.enterSchoolName')}/>
        </Form.Item>

        <Form.Item
            name="college"
            label={t('login.college')}
            rules={[{ required: true ,message:t('login.enterCollege')}]}
        >
            <Input placeholder={t('login.enterCollege')}/>
        </Form.Item>

        <Form.Item
            name="major"
            label={t('login.major')}
        >
            <Input placeholder={t('login.enterMajor')}/>
        </Form.Item>

        <Form.Item
            name="workNum"
            label={t('login.studentOrStaffId')}
        >
            <Input placeholder={t('login.studentOrStaffId')}/>
        </Form.Item>

        <Form.Item
            name="email"
            label={t('login.email')}
            rules={[
                { required: true, message: t('login.emailPlaceholder') },
                { type: 'email', message: t('login.emailError') },
            ]}
        >
            <Input placeholder={t('login.emailPlaceholder')}/>
        </Form.Item>

        <Form.Item
            name="loginname"
            label={t('login.userName')}
            rules={[{ required: true ,message:t('login.rulesUserName')}]}
        >
            <Input placeholder={t('login.userNamePlaceholder')}/>
        </Form.Item>

        <Form.Item
            name="password"
            rules={[
                { required: true, message: t('login.registerPasswordPlaceholder')},
                {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                    message: t('login.registerPasswordPlaceholder')
                },
            ]}
            label={t('login.password')}
        >
            <Input.Password placeholder={t('login.registerPasswordPlaceholder')}/>
        </Form.Item>
        <Form.Item
            name="confirmPassword"
            rules={[
                { required: true },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error(t('login.confirmPasswordError')));
                    },
                })
            ]}
            label={t('login.confirmPassword')}
        >
            <Input.Password placeholder={t('login.registerPasswordPlaceholder')}/>
        </Form.Item>

        <Form.Item
            name="mobile"
            label={t('login.phoneNumber')}
            rules={[
                { required: true, message: t('login.phoneNumberPlaceholder')},
                { pattern: /^1(3|4|5|6|7|8|9)\d{9}$/, message: t('login.incorrectPhoneNumberFormat') }
            ]}
        >
            <Input placeholder="+86"/>
        </Form.Item>

        <Form.Item
            name="code"
            label={t('login.verificationCode')}
            rules={[{ required: true, message: t('login.verificationCodePlaceholder') }]}
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


        <Button style={{width:'100%',padding:'24px 0',marginTop:40}} htmlType="submit" type="primary">
            {t('login.immediatelyRegister')}
        </Button>

    </Form>
};

const EnterpriseRegister=({onSuccess})=>{
    const {t}=useTranslation();
    const [form]=Form.useForm();
    const [time,setTime]=useState(0);
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
        form.validateFields(['companyName','uscc','companyAdmin','password','confirmPassword','mobile'])
            .then(values => {
                axios.post(globalInitConfig.REACT_APP_API_AUTH_URL + "sms/smsRegister", values).then(res=>{
                    if(res.data.code !== 200) {
                        message.warning(res.data.message);
                    }
                    setTime(60)
                });
            })
            .catch(errorInfo => {
                console.log('Validation Failed:', errorInfo);
            });

    };
    const onFinish = (form) => {
        form.loginname = form.companyAdmin;
        form.userRole = "ENTERPRISE";
        axios.post(globalInitConfig.REACT_APP_API_AUTH_URL + "users/register", form).then(res=>{
            if(res.data.code === 200){
                message.success(t('login.registrationSuccess'));
                onSuccess();
            }else{
                message.warning(res.data.message);
            }
        });
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };
    return  <Form
        form={form}
        layout="vertical"
        validateTrigger="onBlur"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
    >

        <Form.Item
            name="companyName"
            label={t('login.companyName')}
            rules={[{ required: true ,message:t('login.enterCompanyName')}]}
        >
            <Input placeholder={t('login.enterCompanyName')}/>
        </Form.Item>

        <Form.Item
            name="uscc"
            label={t('login.creditCode')}
            rules={[{ required: true ,message:t('login.enterCreditCode')}]}
        >
            <Input placeholder={t('login.enterCreditCode')}/>
        </Form.Item>

        <Form.Item
            name="companyAdmin"
            label={t('login.companyAdminUsername')}
            rules={[{ required: true ,message:t('login.rulesUserName')}]}
        >
            <Input placeholder={t('login.userNamePlaceholder')}/>
        </Form.Item>

        <Form.Item
            name="password"
            rules={[
                { required: true, message: t('login.registerPasswordPlaceholder')},
                {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                    message: t('login.registerPasswordPlaceholder')
                },
            ]}
            label={t('login.password')}
        >
            <Input.Password placeholder={t('login.registerPasswordPlaceholder')}/>
        </Form.Item>
        <Form.Item
            name="confirmPassword"
            rules={[
                { required: true },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error(t('login.confirmPasswordError')));
                    },
                })
            ]}
            label={t('login.confirmPassword')}
        >
            <Input.Password placeholder={t('login.registerPasswordPlaceholder')}/>
        </Form.Item>

        <Form.Item
            name="mobile"
            label={t('login.phoneNumber')}
            rules={[
                { required: true, message: t('login.phoneNumberPlaceholder')},
                { pattern: /^1(3|4|5|6|7|8|9)\d{9}$/, message: t('login.incorrectPhoneNumberFormat') }
            ]}
        >
            <Input placeholder="+86"/>
        </Form.Item>

        <Form.Item
            name="code"
            label={t('login.verificationCode')}
            rules={[{ required: true, message: t('login.verificationCodePlaceholder') }]}
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


        <Button style={{width:'100%',padding:'24px 0',marginTop:40}} htmlType="submit" type="primary">
            {t('login.immediatelyRegister')}
        </Button>

    </Form>
}

const Register=({onSuccess})=>{
    const {t}=useTranslation();
    const [form]=Form.useForm();
    const [time,setTime]=useState(0);
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
        form.validateFields(['loginname','password','confirmPassword','email','mobile'])
            .then(values => {
                axios.post(globalInitConfig.REACT_APP_API_AUTH_URL + "sms/smsRegister", values).then(res=>{
                    if(res.data.code !== 200) {
                        message.warning(res.data.message);
                    }
                    setTime(60)
                });
            })
            .catch(errorInfo => {
                console.log('Validation Failed:', errorInfo);
            });

    };
    const onFinish = (form) => {
        form.userRole = "PERSONAL";
        axios.post(globalInitConfig.REACT_APP_API_AUTH_URL + "users/register", form).then(res=>{
            if(res.data.code === 200){
                message.success(t('login.registrationSuccess'));
                onSuccess();
            }else{
                message.warning(res.data.message);
            }
        });
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };
    return  <Form
        form={form}
        layout="vertical"
        validateTrigger="onBlur"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
    >

        <Form.Item
            name="loginname"
            label={t('login.userName')}
            rules={[{ required: true ,message:t('login.rulesUserName')}]}
        >
            <Input placeholder={t('login.userNamePlaceholder')}/>
        </Form.Item>

        <Form.Item
            name="password"
            rules={[
                { required: true, message: t('login.registerPasswordPlaceholder')},
                {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                    message: t('login.registerPasswordPlaceholder')
                },
            ]}
            label={t('login.password')}
        >
            <Input.Password placeholder={t('login.registerPasswordPlaceholder')}/>
        </Form.Item>
        <Form.Item
            name="confirmPassword"
            rules={[
                { required: true },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error(t('login.confirmPasswordError')));
                    },
                })
            ]}
            label={t('login.confirmPassword')}
        >
            <Input.Password placeholder={t('login.registerPasswordPlaceholder')}/>
        </Form.Item>

        <Form.Item
            name="email"
            label={t('login.email')}
            rules={[
                { required: true, message: t('login.emailPlaceholder') },
                { type: 'email', message: t('login.emailError') },
            ]}
        >
            <Input placeholder={t('login.emailPlaceholder')}/>
        </Form.Item>

        <Form.Item
            name="mobile"
            label={t('login.phoneNumber')}
            rules={[
                { required: true, message: t('login.phoneNumberPlaceholder')},
                { pattern: /^1(3|4|5|6|7|8|9)\d{9}$/, message: t('login.incorrectPhoneNumberFormat') }
            ]}
        >
            <Input placeholder="+86"/>
        </Form.Item>

        <Form.Item
            name="code"
            label={t('login.verificationCode')}
            rules={[{ required: true, message: t('login.verificationCodePlaceholder') }]}
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


        <Button style={{width:'100%',padding:'24px 0',marginTop:40}} htmlType="submit" type="primary">
            {t('login.immediatelyRegister')}
        </Button>

    </Form>
};

export default LoginAndRegisterPage
