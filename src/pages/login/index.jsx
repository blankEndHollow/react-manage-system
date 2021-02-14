import { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Form , Input , Button , message } from 'antd'
import { UserOutlined , LockOutlined } from "@ant-design/icons"

//引入存储模块
import memory from '../../utils/memory'
//引入内存数据
import free from '../../utils/memoryFree'
//引入请求模块
import { login } from '../../api/network'
//映入登录页面的样式
import "./login.less"

export default class Login extends Component{
  

  state = { isLogin:false }

  render() {
    //如果用户已经登录则跳转到管理页面
    const user = free.user
    if(user && user._id)return <Redirect to='/' />
    
    
    //表当最终通过是调用的函数
    const onFinish = async(values) => {
      //设置提交按钮为等待状态
      this.setState({isLogin:true})
      let toTime ,
 
        //发送登录请求,获取状态码
      { status , data} = await login(values)
    
      //验证成功和失败的持续时间是不同的
      toTime = status === 0 ? 4500 : 1500
      //成功信息
      if(status === 0) {
        setTimeout( () => message.success('Logged in,redirect 3s affter',3) , 1500 )
        //保存用户登录的信息
        memory.saveUser(JSON.stringify(data))
      }
        //失败提示
      else setTimeout( () => message.error('Authentication failed',1.5) , 1500 )
      
      //无论是否成功都要解除禁用
      setTimeout( () => {
        this.setState({ isLogin:false })
        //成功跳转
        status === 0 && this.props.history.replace('/')
        console.log(status)
      } , toTime )

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
    ],
    //点击登录后的是否可以再次点击
    { isLogin } = this.state

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
                <Input 
                  prefix={<UserOutlined className="site-form-item-icon" />} 
                  placeholder="Username"
                  disabled={ isLogin } />
              </Form.Item>
              <Form.Item
                name="password"
                rules={passowrdRole}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                  disabled={ isLogin }
                />
              </Form.Item>

              <Form.Item>
                <Button loading={ this.state.isLogin } disabled={ isLogin } type="primary" htmlType="submit" className="login-form-button">
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

