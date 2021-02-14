import { Component } from 'react'
//路由函数
import { withRouter } from 'react-router-dom'
//引入天气接口
// import { weather } from '../../api/network'
//token操作函数
import memory from '../../utils/memory'
//内存数据
import free from '../../utils/memoryFree'
//时间函数
import guyu from 'guyut'
//引入样式
import './header.less'

//引入antd组件
import { Button , Popconfirm , message , Tooltip } from 'antd'
//antd的icon图标
import { PoweroffOutlined } from '@ant-design/icons'
const { formDate } = guyu
/* 头部组件 */
//加工成路由组件
export default withRouter(class Header extends Component {
  state = { weather:{} , time:Date.now() , visible: false , isLo:false }
  timer = null
  oare = {
    'home':'主页',
    'category':'品类管理',
    'product':'商品管理',
    'user':'用户管理',
    'role':'角色管理',
    'line':'折线图',
    'pie':'饼图',
    'bar':'柱形图',
  }
  oldPath = ''
  title = ''
  componentDidMount(){
    //时间设置
    this.timer = setInterval( () =>{
      this.setState({time:Date.now()})
    },1000)
    //获取天气情况
    // weather()
    // .then(data=>{
    //   data && this.setState({ weather:data })
    // })
  }
  render() {
    //根据路径显示相同的路径
    let { pathname } = this.props.location
    if(this.oldPath !== pathname){
      for(let n in this.oare){
        if(pathname.includes(n)){  
          this.title = this.oare[n]
          break;
        }
      }
    }
    this.oldPath = pathname

    return (
      <div className='header'>
        <div className='header-top'>
          <span className='text'>欢迎, {free.user.username}</span>
          <Tooltip title='退出登录' color='#ccc'>
            <Popconfirm title="Are you sure？" 
            visible={this.state.visible} 
            okButtonProps={{loading:this.state.isLo}} 
            okText="Yes" onConfirm={ this.outLine.bind(this) } 
            cancelText="No" onCancel={ () => this.popco.bind(this,false)() }
          >
              <Button type="primary"
                icon={<PoweroffOutlined />}
                onClick={ this.popco.bind(this,true) }/>
            </Popconfirm>
          </Tooltip>
          
        </div>
        <div className='header-bottom'>
          <div className='header-bottom-left'>{ this.title }</div>
          <div className='header-bottom-right'>
            <span>  {formDate(this.state.time,'yyyy-MM-dd hh:mm:ss')} </span>
            <span>{ this.state.weather.wea || '多云' }</span>
          </div>
        </div>
      </div>
    )
  }

    //卸载此组件前停止时间跟新
  componentWillUnmount(){
    clearInterval(this.timer)
  }

  outLine(){
    //下线前停止时间跟新
    clearInterval(this.timer)
    this.setState({isLo:true})
    setTimeout(() => {
      //移除本地存储
      memory.removeUser()
      //清空内存数据
      free.user={}
    
      this.setState({isLo:false})

      //跳转到登录页
      this.props.history.replace('/login')
      //提出成功退出
      message.success('Exit successfully',.8)
    }, 1500);
  }
  popco(n){
    this.setState({visible:n})
  }
})