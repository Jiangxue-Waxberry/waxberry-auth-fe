import React ,{useState,useEffect} from 'react'

import { Button, Checkbox, Form, Input, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import JSEncrypt from 'jsencrypt';

import RegisterSuccess from './img/registerSuccess.png';
import TipPng from './img/tip.png';

import './login.scss';

const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAj+if+YQZ9fmBCu5w7UXgdlhRQ+ao18GBvPR6pK2twKrOs1tdr257wAnlPc5u5KCjyV8igM6XjQBL2RwVPQRPZKRf6GUdXWnoVTKgVtzAejr7F1lK2/bZ73XVS6/FnjNSKbBkaMfUe61I1JUAut8Fl/ikc1Ay5oBavdPPIgRGgwAowkQFLarYhKck4DYyFynq5wGWwFk4nmcf51Atd5TFWQMqoAukCcpbZbY8a2U0h+K9HuhhW4HSeT0f8S5jHjFOLh8yM5IGsUTFnPSaDWktdoxU3nK979ssXohc/O4Sfv87MouEOhkxN2ZLOjF2g0153Acr/8iTN2b6YwzrSyk52QIDAQAB
-----END PUBLIC KEY-----`;

function encryptPassword(password) {
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    return encrypt.encrypt(password);
}

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
                setTime(60)
                axios.post(globalInitConfig.REACT_APP_API_AUTH_URL + "sms/smsRegister", {mobile: values.mobile}).then(res=>{
                    if(res.data.code !== 200) {
                        message.warning(res.data.message);
                    }
                });
            })
            .catch(errorInfo => {
                console.log('Validation Failed:', errorInfo);
            });

    };
    const onFinish = (form) => {
        const encryptedPwd = encryptPassword(form.password);
        if (!encryptedPwd) {
            message.warning('加密失败，请重试');
            return;
        }
        form.password = encryptedPwd;
        form.confirmPassword = "";
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
            rules={[{ required: true, whitespace: true ,message:t('login.enterSchoolName')}]}
        >
            <Input placeholder={t('login.enterSchoolName')}/>
        </Form.Item>

        <Form.Item
            name="college"
            label={t('login.college')}
            rules={[{ required: true, whitespace: true ,message:t('login.enterCollege')}]}
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
            rules={[{ required: true, whitespace: true ,message:t('login.rulesUserName')}]}
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
                    <Button type="text" onClick={()=>window.open("/docs/terms.html")}>{t('login.protocol1')}</Button>
                    <span>{t('login.prompt2')}</span>
                    <Button type="text" onClick={()=>window.open("/docs/privacy.html")}>{t('login.protocol2')}</Button>
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
                setTime(60)
                axios.post(globalInitConfig.REACT_APP_API_AUTH_URL + "sms/smsRegister", {mobile: values.mobile}).then(res=>{
                    if(res.data.code !== 200) {
                        message.warning(res.data.message);
                    }
                });
            })
            .catch(errorInfo => {
                console.log('Validation Failed:', errorInfo);
            });

    };
    const onFinish = (form) => {
        const encryptedPwd = encryptPassword(form.password);
        if (!encryptedPwd) {
            message.warning('加密失败，请重试');
            return;
        }
        form.password = encryptedPwd;
        form.confirmPassword = "";
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

    // 统一社会信用代码校验规则
    const validateUSCC = (_, value) => {
        if (!value) {
            return Promise.reject(new Error('请输入统一社会信用代码'));
        }
        if (value.length !== 18) {
            return Promise.reject(new Error('统一社会信用代码长度必须为 18 位'));
        }

        // 定义校验字符集（不包括 I、O、Z、S、V）
        const validChars = '0123456789ABCDEFGHJKLMNPQRTUWXY';
        for (let i = 0; i < 17; i++) {
            if (!validChars.includes(value[i])) {
                return Promise.reject(new Error('统一社会信用代码包含非法字符'));
            }
        }

        // 校验位计算（简化版，实际规则更复杂）
        // 以下是一个简化的校验位计算逻辑（实际规则需参考国家标准）
        const weights = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];
        const charMap = {
            '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
            'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15, 'G': 16, 'H': 17,
            'J': 18, 'K': 19, 'L': 20, 'M': 21, 'N': 22, 'P': 23, 'Q': 24, 'R': 25,
            'T': 26, 'U': 27, 'W': 28, 'X': 29, 'Y': 30
        };

        let sum = 0;
        for (let i = 0; i < 17; i++) {
            sum += charMap[value[i]] * weights[i];
        }

        const checkCode = 31 - (sum % 31);
        const expectedCheckChar = [
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K',
            'L', 'M', 'N', 'P', 'Q', 'R', 'T', 'U', 'W', 'X', 'Y'
        ][checkCode];

        if (value[17] !== expectedCheckChar) {
            return Promise.reject(new Error('统一社会信用代码格式不正确'));
        }

        return Promise.resolve();
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
            rules={[{ required: true, whitespace: true ,message:t('login.enterCompanyName')}]}
        >
            <Input placeholder={t('login.enterCompanyName')}/>
        </Form.Item>

        <Form.Item
            name="uscc"
            label={t('login.creditCode')}
            rules={[
                { required: true, whitespace: true ,message:t('login.enterCreditCode')},
                { validator: validateUSCC }
            ]}
        >
            <Input placeholder={t('login.enterCreditCode')}/>
        </Form.Item>

        <Form.Item
            name="companyAdmin"
            label={t('login.companyAdminUsername')}
            rules={[{ required: true, whitespace: true ,message:t('login.rulesUserName')}]}
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
                    <Button type="text" onClick={()=>window.open("/docs/terms.html")}>{t('login.protocol1')}</Button>
                    <span>{t('login.prompt2')}</span>
                    <Button type="text" onClick={()=>window.open("/docs/privacy.html")}>{t('login.protocol2')}</Button>
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
                setTime(60)
                axios.post(globalInitConfig.REACT_APP_API_AUTH_URL + "sms/smsRegister", {mobile: values.mobile}).then(res=>{
                    if(res.data.code !== 200) {
                        message.warning(res.data.message);
                    }
                });
            })
            .catch(errorInfo => {
                console.log('Validation Failed:', errorInfo);
            });

    };
    const onFinish = (form) => {
        const encryptedPwd = encryptPassword(form.password);
        if (!encryptedPwd) {
            message.warning('加密失败，请重试');
            return;
        }
        form.password = encryptedPwd;
        form.confirmPassword = "";
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
            rules={[{ required: true, whitespace: true ,message:t('login.rulesUserName')}]}
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
                    <Button type="text" onClick={()=>window.open("/docs/terms.html")}>{t('login.protocol1')}</Button>
                    <span>{t('login.prompt2')}</span>
                    <Button type="text" onClick={()=>window.open("/docs/privacy.html")}>{t('login.protocol2')}</Button>
                </div>
            </Checkbox>
        </Form.Item>


        <Button style={{width:'100%',padding:'24px 0',marginTop:40}} htmlType="submit" type="primary">
            {t('login.immediatelyRegister')}
        </Button>

    </Form>
};

export default LoginAndRegisterPage
