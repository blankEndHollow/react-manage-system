import { Component } from 'react'
import { Form , Input , Button  } from 'antd'
import { UserOutlined , LockOutlined } from "@ant-design/icons"

//引入请求模块
import request from '../../api/network'
//映入登录页面的样式
import "./login.less"


export default class Login extends Component{
  render() {
    //表当最终通过是调用的函数
    const onFinish = (values) => {
      console.log(values)
      request({
        method:'post',
        url:'/login',
        data:values
      })
      .then( respo =>{
        console.log(respo)
      }).catch(err=>{})
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
      { max:16,min:5 },
      { whitespace:true, },
      { pattern:/^\w+$/,message:"must make up in A-Z | a-z | 0-9 | _" },
    ]

    return (
      <div className="login">
        <section className="login-content">
            <h3>LOGIN<small>后台管理</small></h3>
            <Form  name="normal_login" className="login-form"
                    initialValues={{ remember: true }} onFinish={onFinish}>
              <Form.Item
                name="username"
                rules={userNameRole}
              >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
              </Form.Item>
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

              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  Sign in
                </Button>
                Or <a href="/register">register now!</a>
              </Form.Item>
            </Form>
        </section>
      </div>
    )
  }
}

