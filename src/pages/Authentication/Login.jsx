import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Row, Col, Divider, Image } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import AuthService from 'services/auth/auth';
import { AuthContext } from 'contexts/AuthContext';
import { MessageContext } from 'contexts/MessageContext';

//  Use your VTS logo (the one you shared)
import vtsLogo from 'assets/images/light-vts-hr.png';
import RightImage from 'assets/images/logo-replace.png';

const LoginForm = () => {
  document.title = 'Login';

  const { setAccessTokenFn, setPermissions, setIsAdminFn, access_token, setMenuSideBar } = useContext(AuthContext);
  const { showMessage } = useContext(MessageContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [form] = Form.useForm();

  //  Brand colors based on VTS logo: Blue + Orange
  const BRAND_BLUE = '#1E4EA8';
  const BRAND_ORANGE = '#F4A12C';

  const inputCls = 'h-12 rounded-full border-0 !bg-white shadow-[0_6px_18px_rgba(0,0,0,0.06)] px-4';

  const prefixPillCls = `inline-flex items-center justify-center w-10 h-10 rounded-full text-white`;

  const usernamePrefix = useMemo(
    () => (
      <span className={prefixPillCls} style={{ backgroundColor: BRAND_ORANGE }}>
        <MailOutlined />
      </span>
    ),
    []
  );

  const passwordPrefix = useMemo(
    () => (
      <span className={prefixPillCls} style={{ backgroundColor: BRAND_ORANGE }}>
        <LockOutlined />
      </span>
    ),
    []
  );

  // onFinish
  const onFinish = (values) => {
    const { username, password, remember } = values;

    AuthService.login({ username, password })
      .then((res) => {
        const data = res?.data || res;

        const accessToken = data?.accessToken || data?.access_token || data?.token || '';

        const loginUser = data?.user || {};

        const isAdmin = loginUser?.isAdmin ?? data?.isAdmin ?? data?.is_admin ?? false;

        const permissions =
          data?.permission || data?.permissions || loginUser?.permission || loginUser?.permissions || [];

        const menuItems = data?.menuItems || data?.menu_items || loginUser?.menuItems || loginUser?.menu_items || [];

        if (!accessToken) {
          showMessage({
            type: 'error',
            content: 'Access token not found',
            key: 'loginError',
          });
          return;
        }

        // remember
        if (remember) {
          localStorage.setItem('remember', JSON.stringify(true));
          localStorage.setItem('username', username);
          localStorage.setItem('password', password);
        } else {
          localStorage.setItem('remember', JSON.stringify(false));
          localStorage.removeItem('username');
          localStorage.removeItem('password');
        }

        // token
        localStorage.setItem('token', `Bearer ${accessToken}`);
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('user', JSON.stringify(loginUser));
        localStorage.setItem('is_admin', JSON.stringify(isAdmin));
        localStorage.setItem('permission', JSON.stringify(permissions));
        localStorage.setItem('menu_sidebar', JSON.stringify(menuItems));

        setAccessTokenFn(accessToken);
        setPermissions(permissions);
        setIsAdminFn(isAdmin);
        setMenuSideBar(menuItems);

        if (location && location.state) navigate(location.state.from);
        else navigate('/');
      })
      .catch((err) => {
        showMessage({
          type: 'error',
          content: err?.response?.data?.message || err?.response?.data?.error?.message || err?.msg || 'Login failed',
          key: 'loginError',
        });
      });
  };

  // redirect if already logged in
  useEffect(() => {
    if (access_token) navigate('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [access_token]);

  // load remembered username/password
  useEffect(() => {
    const remember = JSON.parse(localStorage.getItem('remember')) || false;
    if (remember) {
      const username = localStorage.getItem('username') || '';
      const password = localStorage.getItem('password') || '';
      form.setFieldValue('remember', true);
      form.setFieldValue('username', username);
      form.setFieldValue('password', password);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 px-4">
      {/* Outer Card */}
      <div className="w-full max-w-5xl overflow-hidden rounded-[28px] bg-white shadow-[0_18px_60px_rgba(0,0,0,0.12)]">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* LEFT: Form panel */}
          <div className="relative">
            {/* subtle dotted background */}
            <div className="absolute inset-0 opacity-[0.22] [background-image:radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:18px_18px]" />

            <div className="relative p-8 md:p-10">
              {/*  Logo (use your VTS logo) */}
              <div className="flex justify-center">
                <div className="h-20 w-20 rounded-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.10)] flex items-center justify-center">
                  <Image style={{ width: '70px' }} src={vtsLogo} alt="VTS Logo" preview={false} className="" />
                </div>
              </div>

              {/* Title + Login As */}
              <div className="mt-6">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <div className="text-3xl font-semibold text-slate-800">Sign In</div>
                    <div className="mt-2 h-1 w-14 rounded-full" style={{ backgroundColor: BRAND_ORANGE }} />
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="mt-8">
                <Form
                  className="login-form"
                  form={form}
                  name="form"
                  onFinish={onFinish}
                  autoComplete="off"
                  initialValues={{ remember: false }}
                  layout="vertical">
                  <Form.Item
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your username!',
                      },
                    ]}
                    className="mb-4">
                    <Input size="small" prefix={usernamePrefix} placeholder="username" className={inputCls} />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your Password!',
                      },
                    ]}
                    className="mb-2">
                    <Input.Password size="small" prefix={passwordPrefix} placeholder="password" className={inputCls} />
                  </Form.Item>

                  {/* Remember + Forgot (only here, NOT below button) */}
                  <Form.Item className="mb-4">
                    <Row align="middle">
                      <Col span={12}>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                          <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                      </Col>

                      <Col span={12} className="flex justify-end">
                        <button
                          type="button"
                          className="text-sm font-medium hover:opacity-80"
                          style={{ color: BRAND_BLUE }}
                          onClick={() => console.log('forgot password')}>
                          Forgot password?
                        </button>
                      </Col>
                    </Row>
                  </Form.Item>

                  <Form.Item className="mb-0">
                    <Button
                      htmlType="submit"
                      className="w-full h-12 rounded-full border-0 text-white font-semibold
                                 shadow-[0_12px_30px_rgba(30,78,168,0.25)]
                                 hover:opacity-95"
                      style={{
                        background: `linear-gradient(90deg, ${BRAND_BLUE}, ${BRAND_ORANGE})`,
                      }}>
                      Sign In
                    </Button>
                  </Form.Item>

                  <Divider className="!mt-8 !mb-0">
                    <span className="text-slate-500">HR Management System</span>
                  </Divider>
                </Form>
              </div>
            </div>
          </div>

          {/* RIGHT: Illustration panel */}
          <div className="hidden md:flex items-center justify-center p-10">
            <div
              className="w-full h-full rounded-[24px] flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, rgba(244,161,44,0.25), rgba(30,78,168,0.10))`,
              }}>
              <div className="w-full max-w-md p-6">
                {/* If you don't want illustration, you can remove this Image */}
                <Image src={RightImage} alt="Login Illustration" preview={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
