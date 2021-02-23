import { Component } from 'react'
//antd的组件导入 
import { Button , Table , Card ,Modal , Form, Input, message , Tree } from 'antd' 
//antd的icon
import { LoadingOutlined } from '@ant-design/icons'
// 导入自定义工具
import guyu from "guyut";
//数据获取
import { rolePop , sendRole , sendAuth } from '../../api/network'
//验证规则
import { empty } from '../../utils/rules'
//导入导航列表数据
import menuList from '../../utils/menuList'
//导入内存数据
import free from '../../utils/memoryFree'
const treeNodes = [
  {
    title:'平台权限' ,
    key :'all' ,
    children :menuList
  }
] , 
formDate = (n) => n && guyu.formDate(n,'yyyy-MM-dd hh:mm:ss')
/*角色*/
export default class Role extends Component {
  //角色列表
  state = { roles: [] ,role:{} , showForm: 0 , loading: false , checked:[] , btnLoaing: false }
  //表格头部标题
  columns = [
    { title:"角色名称" , dataIndex : 'name' } , 
    { title:'创建时间' , dataIndex : 'create_time' , render : formDate  },
    { title:'授权时间' , dataIndex :'auth_time' , render : formDate  },
    { title:'授权人' , dataIndex : 'auth_name' },
  ]

  componentDidMount(){
   this.getRoles() 
  }
  
  //添加角色表单
  formAdd = null
  //表单内的占比
  layout = { labelCol:{ span: 5 } , wrapperCol:{ span:15 } }
  
  render(){
    const { roles , role , showForm , loading , checked , btnLoaing } = this.state

    return (
      <Card title={ <span>
        <Button type="primary" onClick={ this.showModel.bind(this,1) } >创建角色</Button>&nbsp;&nbsp;
        <Button type="primary" onClick={ this.showModel.bind(this,2) } disabled={ !role._id }>设置角色权限</Button>
      </span> }>
      {/* 用户展示 */}
          <Table bordered rowKey="_id" dataSource={ roles } loading={ loading }
                 columns={ this.columns } pagination={{defaultPageSize:4 , pageSizeOptions:[] ,simple: true }}
                 rowSelection={{type:'radio' , selectedRowKeys:[role._id]}} 
                 onRow={ role => ({ onClick: () =>{ this.setState({ role})  }}) }>
            
          </Table>
          {/* 添加用户 */}
        <Modal title="添加角色" visible={ showForm === 1 }
                onOk={ this.addRole.bind(this) } onCancel={ this.hideModal.bind(this) } >
          {/* 添加用户的表单 */}
          <Form ref={ curr => this.formAdd= curr }>
            <Form.Item label="角色名称" name='roleName' {...this.layout} rules={[ empty ]}>
              <Input placeholder="请输入角色名称"/>
            </Form.Item>
          </Form>
        </Modal>
        {/* 授权权限 */}
        <Modal title="设置角色权限" visible={ showForm === 2 } okText={ btnLoaing ? <LoadingOutlined /> : 'OK'}
                okButtonProps={{ disabled: btnLoaing }}
                cancelButtonProps={{ disabled: btnLoaing }}
                onOk={ this.setAuth.bind(this) } onCancel={ this.hideModal.bind(this) }>
          <>
            <Form.Item {...this.layout} label="角色名称">
              <Input value={ role.name } disabled />
            </Form.Item>
            {/* 树形控件 */}

            <Tree defaultExpandAll checkable treeData={ treeNodes }
                  checkedKeys={ checked } onCheck={ this.checkTree.bind(this) } />
          </>
        </Modal>
      </Card>
    )
  }
  //获取角色数据
  async getRoles(){
    this.setState({ loading: true})
    let { status , data } = await rolePop()
    if(status === 0)
    {
      this.setState({roles: data , loading:false })
    }
  }
  //添加角色
  async addRole(){
   let result = await this.formAdd.validateFields(['roleName']).catch(()=>{})
   if(result){
    let {status , data} = await sendRole(result.roleName)
      if(status === 0){  
        //清空输入框内容
        this.formAdd.resetFields()
       //提示成功
       message.success('添加成功',.8)
       //添加到角色列表
       this.setState({ roles: [ ...this.state.roles,data ] , showForm: 0 })
      }
   }

  }

  //显示对话框
  showModel(showForm){
    this.setState({ showForm , checked: this.state.role.menus || [] })
  }
  //隐藏对话框
  hideModal(){
    this.state.showForm === 1 && this.formAdd.resetFields()
    this.setState({ showForm: 0 })
  }
  //点击复选框时触发
  checkTree(checked){
    this.setState({ checked })
  }
  //设置角色的权限
  async setAuth(){
    this.setState({ btnLoaing: true })
    const role = this.state.role
    role.menus = this.state.checked
    role.auth_name = free.user.username
    role.auth_time = Date.now()
    let { status } = await sendAuth(role)
    if(status === 0){
      //提示成功
      message.success('设置权限成功')
      this.setState({ showForm: 0 , btnLoaing: false , roles: [...this.state.roles]})
    }
  }
}