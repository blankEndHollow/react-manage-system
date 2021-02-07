import { Component } from 'react'
//引入样式
import "./register.less"
//映入antd的组件
import { Form , Input , Button  } from 'antd'
import { UserOutlined , LockOutlined , MailOutlined , NumberOutlined} from "@ant-design/icons"

export default class Register extends Component {
  render() {
    //表当最终通过是调用的函数
    const onFinish = (values) => {
     
      
    },
    //用户名验证规则
    userNameRole = [
      { required: true,  message: 'Please input your Username!' },
      { whitespace:true, },
      { min:3,max:12 },
      { pattern:/^\w+$/,message:"must make up in A-Z | a-z | 0-9 | _" }
      
    ],
    //密码的验证规则
    passowrdRole = [
      { required: true, message: 'Please input your Password!' },
      { max:16,min:6 },
      { whitespace:true, },
      { pattern:/^\w+$/,message:"must make up in A-Z | a-z | 0-9 | _" },
    ]

    return (
      <div className="register">
          <section className="register-content">
            <h3>REGISTER</h3>
            <Form  name="normal_login" className="login-form"
                    initialValues={{ remember: true }} onFinish={onFinish}>
              {/* 用户名 */}
              <Form.Item
                name="username"
                rules={userNameRole}
              >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
              </Form.Item>
              {/* 注册密码 */}
              <Form.Item
                name="password"
                rules={passowrdRole}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>
              {/* 电子邮箱 */}
              <Form.Item
                name="email"
                rules={[{type:'email'}]}
              >
                <Input
                  prefix={<MailOutlined className="site-form-item-icon" />}
                  type="text"
                  placeholder="email"
                />
              </Form.Item>
              {/* 手机号 */}
              <Form.Item
                name="phone"
                rules={[{pattern:/^[\d]{6,11}$/,message:'must in 0-9, betweed length at 6~11'}]}
              >
                <Input
                  prefix={<NumberOutlined  className="site-form-item-icon" />}
                  type="text"
                  placeholder="phone"
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                Sign up
                </Button>
                Or <a href="/login">login now!</a>
              </Form.Item>
            </Form>
        </section>
      </div>
    )
  }
}