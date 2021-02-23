import { Component } from 'react'
//引入样式
import "./register.less"
//映入antd的组件
import { Form , Input , Button , message  } from 'antd'
import { UserOutlined , LockOutlined , MailOutlined , NumberOutlined} from "@ant-design/icons"
//路由组件
import { Redirect } from 'react-router-dom'
//导入内存数据
import free from "../../utils/memoryFree";
//导入存储器
import memory from '../../utils/memory'
//导入请求api
import { raiseUser } from '../../api/network'
export default class Register extends Component {
  state = { isRe:false }
  render() {

    //如果已经登录则直接进入管理模块
    const user = free.user
    if(user && user._id) return <Redirect to='/' />

    //表当最终通过是调用的函数
    const onFinish = async(values) => {
      this.setState({isRe:true})
     let toTime = 4000 , mg ='Registration succeeded , redirect 3s after'
      try{
        let {status , data} = await raiseUser(values)
        if(status !== 0) {
          toTime = 1500
          mg = 'User exists'
        }
        else setTimeout(() => memory.saveUser(JSON.stringify(data)), toTime)
        setTimeout(() =>message[toTime === 4000 ? 'success' : 'error'](mg),1500)
      }catch(err){ message.error('network error') }

      setTimeout( () =>{
          this.setState({isRe:false})
      },toTime)
      
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
    ],
    { isRe } = this.state

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
                <Input 
                disabled={ isRe } 
                prefix={<UserOutlined className="site-form-item-icon" />} 
                placeholder="Username" />
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
                  disabled={ isRe } 

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
                  disabled={ isRe } 

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
                  disabled={ isRe } 

                />
              </Form.Item>
              <Form.Item>
                <Button disabled={ isRe } type="primary" htmlType="submit" className="login-form-button">
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