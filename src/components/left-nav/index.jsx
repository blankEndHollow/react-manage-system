import { Component  } from 'react'
//引入路由组件
import { Link } from 'react-router-dom'
//引入logo
import logo from '../../assets/img/logo.png'

//引入antd组件
import { Menu } from 'antd'

//引入antd的icon图标
import { 
  TeamOutlined , 
  PieChartOutlined ,
  HomeOutlined ,
  AppstoreOutlined ,
  BarcodeOutlined ,
  BarsOutlined ,
  UserSwitchOutlined ,
  FundProjectionScreenOutlined ,
  LineChartOutlined ,
  BarChartOutlined 
} from '@ant-design/icons'
//引入样式
import './left-nav.less'
//menu导航的子组件
const { SubMenu }  = Menu
/* 左侧导航组件 */
export default class LeftNav extends Component {
  native = {
    'home':"1",
    'category':"2",
    'product':"3",
    'user':"4",
    'role':"5",
    'bar':"6",
    'line':"7",
    'pie':"8",
  }
  render() {
    //根据路径决定选择的选项
    let path = this.props.location.pathname
    , 
    act = '1',
    oact =''
    for( let key in this.native ){
      if(path.includes(key)){
        act = this.native[key]
        oact = '23'.includes(this.native[key]) 
          ? 'sub1' 
          : '678'.includes(this.native[key]) 
            ? 'sub2' 
            : ''
        break
      }
    }

    return (
      <div className='left-nav'>
        {/* 主页头部标识 */}
        <Link to='/' className='left-nav-header'>
          <img src={logo} alt='logo' />
          <h1>后台管理</h1>
        </Link>
        {/* 分类信息  */}
      <Menu theme="dark" defaultSelectedKeys={[act]} defaultOpenKeys={[oact]} mode="inline">

            <Menu.Item key="1" icon={<HomeOutlined />}>
              <Link to="/home">首页</Link>
            </Menu.Item>
            
            <SubMenu key="sub1" icon={<AppstoreOutlined />} title="商品">
              <Menu.Item icon={<BarsOutlined />} key="2"><Link to='/category'>品类管理</Link></Menu.Item>
              <Menu.Item icon={<BarcodeOutlined />} key="3"><Link to='/product'>商品管理</Link></Menu.Item>
            </SubMenu>
            
            <Menu.Item icon={<UserSwitchOutlined />} key="4">
              <Link to="/user">用户管理</Link>
            </Menu.Item>
            <Menu.Item icon={<TeamOutlined />} key="5">
              <Link to='/role'>角色管理</Link>
            </Menu.Item>

            <SubMenu key="sub2" icon={<FundProjectionScreenOutlined />} title="图形图表">
              <Menu.Item icon={<BarChartOutlined />} key="6"><Link to='/charts/bar'>柱形图</Link></Menu.Item>
              <Menu.Item icon={<LineChartOutlined />} key="7"><Link to="/charts/line">折线图</Link></Menu.Item>
              <Menu.Item icon={<PieChartOutlined />} key="8"><Link to="/charts/pie">饼图</Link></Menu.Item>
            </SubMenu>

          </Menu>
      </div>
    )
  }

}