import { Component } from 'react'
//antd组件
import { Button , Input , Table , Card , Select, message } from 'antd'
//引入请求数据接口
import { productPop , searchProducts , setStatus } from '../../../api/network'
let act = 1 // 商品离开前的页码
/* 商品的主页 */
export default class Home extends Component {

    state = {
      products: [ ] , //商品数据
      total: 0 , //商品总数
      loading: false , //等待加载
    }
  //获取初始数据
  componentDidMount(){
    this.getProducts( act )
  }
  //表格列的描述
  columns = [
      { title : '商品名称', dataIndex:'name', } , 
      { title : '商品描述' , dataIndex :'desc'} ,
      { title : '价格' , width: 100 , dataIndex :'price' , render(price){ return <span>${price}</span> }} ,
      { title : '状态' , width: 100 , render: ( product )=> { 
        return (
          <>
            <Button onClick={ async () => { 
              //更改商品状态
              await setStatus({ productId: product._id , status: product.status === 1 ? 2 : 1 }) 
              this.getProducts(act)
              } }  type={ product.status === 1 ? '' : 'primary' }>{ product.status === 1 ? '下架' : '售卖' }</Button>
            <p>{ product.status === 1 ? '在售' : '已下架' }</p>
          </>
        )
      } },
      { title : '操作' , width: 100 , render: (product)=> {
        return (
          <>
            <Button size= 'small' onClick={ () => this.props.history.push('/product/detail',product) }>详情</Button>
            <Button size= 'small'>修改</Button>
          </>
        )
      } }
  ]
  //input组件
  input = null
  //搜索类型
  searchType = 'productName'

  render(){
    const { total , products , loading } = this.state
    return (
       <Card title={ 
         <span>
           <Select defaultValue='productName' onChange={ newType => this.searchType = newType }>
             <Select.Option value='productName'>按名称搜索</Select.Option>
             <Select.Option value='productDesc'>按描述搜索</Select.Option>
           </Select>
           <Input ref={ curr => this.input = curr } style={{width:'200px',margin:'0 15px'}} placeholder='请输入关键字' />
           <Button onClick={ this.getProducts.bind(this, 1) } type="primary">Search</Button>
         </span>
        } extra={ <Button type='primary'>添加商品</Button> }>
        {/* 卡片内容 */}
          <Table 
             dataSource={ products } 
             columns={ this.columns } rowKey='_id'
             bordered pagination={{
               total ,
               current: act,
               defaultPageSize: 3,
               onChange: pageNum => { this.getProducts(act = pageNum) ;  }
             }} loading={ loading }>

          </Table>
       </Card>
    )
  }

  //请求数据的函数
  async getProducts(pageNum) {
    this.setState({loading: true}) //显示loading
    let { value } = this.input.input , result  //取出关键值
    if(value.trim()){ //判断是否以条件显示
      result = await searchProducts({ pageNum , pageSize: 3 , [ this.searchType ] : value })
    } else {
      result = await productPop({ pageNum , pageSize: 3 })
    }
    //取出列表和总数外加状态码
    let { data:{ list :products, total } , status } = result
    if(status === 0){
      this.setState({
        products , 
        total 
      })
    }else{
      message.error('request error')
    }
    this.setState({loading: false}) //隐藏loading
  }

}