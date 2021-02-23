import { Component , createRef } from 'react'
//antd组件使用
import { Card , Table , Form , Button , message , Modal, Input , Select } from 'antd'
//antd的icon图标
import { ExclamationCircleOutlined  , LoadingOutlined } from '@ant-design/icons'
//获取数据接口
import { userPop , userDel , userPush } from '../../api/network'
//验证格式
import { empty } from '../../utils/rules'
//格式化时间函数
import guyu from 'guyut'
const formDate = time => guyu.formDate(time,'yyyy-MM-dd hh:mm:ss')
/*用户*/
export default class User extends Component {
  state = { 
    users:[] , //用户列表
    roles :[] , //角色列表
    showModal : 0 , //是否显示对话框
    loading: false , //加载提示
    loadingSend: false ,//输入加载
    defaultData: {
      username: '' , 
      email: '' ,
      role_id: '' ,
      phone: ''
    } 
   }
   //表格标题
  columns = [
    {
      title:'用户名' ,
      dataIndex: 'username'
    },
    {
      title:'邮箱' ,
      dataIndex: 'email'
    },
    {
      title:'电话' ,
      dataIndex: 'phone'
    },
    {
      title:'注册时间' ,
      dataIndex: 'create_time' ,
      render : formDate
    },
    {
      title:'所属角色' ,
      dataIndex: 'role_id' ,
      render : roleId => this.state.roles.reduce( (pre , cur)=> cur._id === roleId ? cur : pre ,{}).name
    },
    {
      title:'操作'  ,
      render : user =>(
        <>
          <Button size="small" onClick={ this.toggleModal.bind(this,2,user) }>修改</Button>
          <Button size='small' onClick={ this.deleteUser.bind(this,user) }>删除</Button>
        </>
      )
    }
  ]
  //表单组件
  dataFormOne = createRef()
  dataFormTwo = createRef()
  //布局
  layout = { labelCol:{ span: 5 } , wrapperCol:{ span:15 } }
  //获取初始数据
  componentDidMount(){
    this.getUsers()
  }

  render(){
    const { users , showModal , loading , roles , loadingSend , defaultData } = this.state
    return (
      <Card title={ <Button type='primary' onClick={ this.toggleModal.bind(this,1) } >创建用户</Button> }>
          <Table bordered rowKey="_id" dataSource={ users } loading={ loading }
                 columns={ this.columns } pagination={{ defaultPageSize: 4 , pageSizeOptions:[] }} />
          {/* 添加用户 */}
          <Modal title='添加用户' visible={ showModal===1 } okText={ loadingSend ? <LoadingOutlined /> : '添加' }
                 onCancel={ this.toggleModal.bind(this,0) } okButtonProps={{ disabled: loadingSend }}
                 onOk={ this.step.bind(this) } cancelButtonProps={{ disabled: loadingSend }} >
                
                <Form ref={ this.dataFormOne }>

                  <Form.Item name="username" label="用户名" {...this.layout} rules={[ empty ]}>
                    <Input placeholder="填写用户名" disabled={ loadingSend } />
                  </Form.Item>

                  <Form.Item name="password" label="密码" {...this.layout} rules={[ empty ]}>
                    <Input placeholder='填写密码' disabled={ loadingSend } type="password" />
                  </Form.Item>

                  <Form.Item name="phone" label="手机号" {...this.layout}>
                    <Input placeholder='填写手机号' disabled={ loadingSend } />
                  </Form.Item>

                  <Form.Item name="email" label="邮箱" {...this.layout}>
                    <Input placeholder="填写邮箱" disabled={ loadingSend } />
                  </Form.Item>

                  <Form.Item name="role_id" label="角色" {...this.layout}>
                  <Select placeholder='选择角色' disabled={ loadingSend } >
                    { 
                      roles.map( item=> <Select.Option value={ item._id } key={ item._id }>{item.name}</Select.Option> )
                    }
                  </Select>
                  </Form.Item>

                </Form>
          </Modal>

          {/* 修改用户 */}
          <Modal title='修改用户' visible={ showModal===2 } okText={ loadingSend ? <LoadingOutlined /> : '修改' }
                 onCancel={ this.toggleModal.bind(this,0) } okButtonProps={{ disabled: loadingSend }}
                 onOk={ this.sendUpdate.bind(this) } cancelButtonProps={{ disabled: loadingSend }} >
                
                <Form ref={ this.dataFormTwo }>

                  <Form.Item label="用户名" {...this.layout}>
                    <Input value={ defaultData.username } onInput={ this.setData.bind(this, 'username') } placeholder="填写用户名" disabled={ loadingSend } />
                  </Form.Item>

                  <Form.Item label="手机号" {...this.layout}>
                    <Input value={ defaultData.phone } onInput={ this.setData.bind(this, 'phone') } placeholder='填写手机号' disabled={ loadingSend } />
                  </Form.Item>

                  <Form.Item label="邮箱" {...this.layout}>
                    <Input value={ defaultData.email } onInput={ this.setData.bind(this, 'email') } placeholder="填写邮箱" disabled={ loadingSend } />
                  </Form.Item>

                  <Form.Item label="角色" {...this.layout}>
                  <Select value={ defaultData.role_id } onChange={ this.setData.bind(this,'role_id') } placeholder='选择角色' disabled={ loadingSend } >
                    { 
                      roles.map( item=> <Select.Option value={ item._id } key={ item._id }>{item.name}</Select.Option> )
                    }
                  </Select>
                  </Form.Item>

                </Form>
          </Modal>

      </Card>
    )
  }
  
  //获取用户数据
  async getUsers(){
    //表格获取数据时的等待
    this.setState({ loading: true })
    let { status , data } = await userPop() ,refresh
    if(status === 0){
      const { users , roles } = data
      refresh = { users , roles }
    }
    this.setState({...refresh , loading: false })
  }

  //切换对话框
  toggleModal(showModal,user){
    const setDa = { showModal ,defaultData:{} }
   //显示对话框
   if(showModal === 0){
    setDa.loadingSend = false
    //对话框关闭时清空表单数据
    this.dataFormOne.current?.resetFields()
    this.dataFormTwo.current?.resetFields()
    
   }
   if( showModal === 2 ){
     //修改数据的默认值
     setDa.defaultData.username = user.username
     setDa.defaultData.phone = user.phone
     setDa.defaultData.email = user.email
     setDa.defaultData.role_id = user.role_id
     setDa.defaultData._id = user._id
   }
   this.setState( setDa )
  }
  //数据验证并提交请求
  async step(){
    //验证表单，不通过为空
    let validate = await this.dataFormOne.current.validateFields().catch(()=>{})
    if(!validate)return
    //添加id
    if(!this.title) validate._id = this.state.defaultData._id
    //禁止输入框和按钮在请求中二次点击
    this.setState({ loadingSend: true })
    //发送添加用户请求
    let { status , data , msg } = await userPush(validate), refresh
    //提示
    if( status === 0){
      message.success('已添加用户')
      refresh = { users:[ ...this.state.users, data ] , showModal: false }
      this.dataFormOne.current.resetFields()
    }else{
      message.warning(msg)
    }
    //关闭对话框
    this.setState({ ...refresh , loadingSend: false})
  }
  //修改用户数据
  async sendUpdate() {
    //判断用户名是否为空
    if(this.state.defaultData.username.trim()){
      //禁用输入和点击
      this.setState({ loadingSend: true })
      //发送修改请求
      const { status , data } = await userPush(this.state.defaultData)
      //获取已存在的用户数据
      ,users = this.state.users , setD = {  }
      if(status === 0){
        //对比出修改后的并更新
        setD.users = users.map( item=>{
          //用户名是唯一,找到相同的则合并
          if( item._id === data._id ){
            return Object.assign(item,data)
          }
          return item
        } )
        //关闭对话框
        setD.showModal = 0
        //提示成功
        message.success('修改成功')
      }
      //集更新用户数据,解除禁用,关闭对话框
      this.setState({ ...setD , loadingSend: false })
    }else{
      message.warning('用户不能为空')
    }
  }
  //删除用户
  deleteUser(user){
    //删除提示框
    Modal.confirm({
      title:'删除用户' ,
      icon: <ExclamationCircleOutlined/> ,
      content:'这是不可逆的',
      okText:'确认' ,
      cancelText:'取消' ,
      onOk:async()=>{
        let { status } = await userDel(user._id)
        if(status === 0){
          message.success('删除成功')
          this.getUsers()
         }
      }
    })
  }
  //设置表单数据
  setData(key,eve) {
    if(typeof eve === 'string'){
      this.setState({ defaultData:{ ...this.state.defaultData, [key]:eve } })
    }else{
      this.setState({ defaultData:{ ...this.state.defaultData,[key]:eve.target.value } })
    }
  }
}

