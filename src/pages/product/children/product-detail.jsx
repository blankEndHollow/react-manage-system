import { Component } from 'react'
//导入antd组件
import { Card , List   } from 'antd'
//引入icon图标
import { ArrowLeftOutlined } from '@ant-design/icons'
//引入网路路径
import { baseURL , getCategoryName } from '../../../api/network'
//引入样式
import '../css/detail.less'
/* 商品的详情 */
export default class Home extends Component {
  state = { cName1 : '' , cName2 : '' }
  async componentDidMount() {
    let { categoryId , pCategoryId } = this.props.location.state
    let result = []
    //判断是分类等级
    if(pCategoryId === '0'){
      result[0] = await getCategoryName({ categoryId })
    }else{
      [ result[0] , result[1] ] = await Promise.all( [getCategoryName({ categoryId }) , getCategoryName({ pCategoryId })] )
    }
    //设置分类
    this.setState({
      cName1 : result[0].data && result[0].data.name , 
      cName2 : result[1] && result[1].data && result[1].data.name
    })
  }
  render(){
    const { name , desc , imgs , price , detail } = this.props.location.state || {}
    return (
      <Card className="product-detail"
      title={ <><ArrowLeftOutlined style={{cursor:'pointer',color:'purple'}} onClick={ () => this.props.history.goBack() } /><span style={{ marginLeft:'15px' }}>商品详情</span></> }>
        <List>
          <List.Item className="detail-row">
            <span className="left">商品名称:</span>
            <span >{ name }</span>
          </List.Item>
          <List.Item>
            <span className="left">商品描述:</span>
            <span >{ desc }</span>
          </List.Item>
          <List.Item>
            <span className="left">商品价格:</span>
            <span >{ price }</span>
          </List.Item>
          <List.Item>
            <span className="left">所属分类:</span>
            <span >{ this.state.cName1 }{ this.state.cName2 ? <>-&gt;{this.state.cName2}</>: null }</span>
          </List.Item>
          <List.Item>
            <span className="left">商品图片:</span>
            <span>

                {
                  imgs.map( (item ,index)=> item ? <img key={index} className="product-img" src = { baseURL + "/upload/" + item } alt='' /> : null )
                }

            </span>
          </List.Item>
          <List.Item>
            <span className="left">商品详情:</span>
            <span dangerouslySetInnerHTML={{__html:detail}}>
            </span>
          </List.Item>
        </List>
      </Card>
    )
  }
}