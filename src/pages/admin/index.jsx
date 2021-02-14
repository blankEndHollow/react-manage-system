import { Component , lazy ,Suspense } from 'react'
//引入raect路由工具
import { Redirect ,Route , Switch , withRouter} from 'react-router-dom'
//引入内存数据
import free from '../../utils/memoryFree'
//引入antd样式
import { Layout  } from 'antd'
//引入页面组件
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'

//引入加载中组件
import Loading from '../loading'
//引入样式
import "./admin.less";
const LeftNavT = withRouter(LeftNav)
const { Sider , Content ,Footer }  = Layout


export default class Login extends Component{

  state = { out:false }
  render() {
   
    //如果没有登录就跳转到登录页面
    const user = free.user 
    if(!user || !user._id)return <Redirect to='/login' />
    return ( 
      <Layout style={{height:'100%'}}>
      <Sider>
        <LeftNavT/>
      </Sider>
      <Layout>
        <Header></Header>
        <Content style={{backgroundColor:'#fff', margin:'20px',overflow:'auto'}}>
           <Suspense fallback={<Loading/>}>
              <Switch>
                <Route path="/home" component={ lazy( ()=> import('../home') ) } />
                <Route path="/category" component={ lazy( ()=> import('../category') ) } />
                <Route path="/product" component={ lazy( ()=> import('../product') ) } />
                <Route path="/role" component={ lazy( ()=> import('../role') ) } />
                <Route path="/user" component={ lazy( ()=> import('../user') ) } />
                <Route path="/echarts/bar" component={ lazy( ()=> import('../echarts/bar') ) } />
                <Route path="/echarts/line" component={ lazy( ()=> import('../echarts/line') ) } />
                <Route path="/echarts/pie" component={ lazy( ()=> import('../echarts/pie') ) } />
                {/* 未定义的地址统一去处 */}
                <Redirect to='/home' />
              </Switch>
           </Suspense>
        </Content>
        <Footer style={{textAlign:'center'}}>推荐使用谷歌浏览器,可以获得更佳的页面操作</Footer>
      </Layout>
    </Layout>
     )
  }
}