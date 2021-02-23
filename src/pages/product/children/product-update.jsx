import { Component } from 'react'
//引入antd
import { Card , Form , Input  , Cascader , Button , message } from 'antd'
//icon图标
import { ArrowLeftOutlined } from '@ant-design/icons'
//获取分类请求函数
import { categoryPop , ProductOpreat } from '../../../api/network'
//引入图片组件
import Picture from '../../../components/upload'
//引入富文本组件
import RichType from '../../../components/richTypeEditor'
//验证规则
import { empty , min} from '../../../utils/rules'


/* 商品的添加和修改 */
export default class Home extends Component {
  state = { options:[] }
  isAdd = true
  componentDidMount() {
    this.getCategorys('0')
    this.isAdd = (this.props?.location?.state?.title !== '修改商品')
  }
  //存储id
  ids = []
  flag = false
  //上传图片组件
  pic = null
  //富文本图片
  rich = null
  render(){
    //初始值
    const { name , price ,detail , imgs , desc ,category , categoryId ,pCategoryId } = (this.props.location.state && this.props.location.state.product) || {}
    categoryId && (this.ids[0] = categoryId)
    pCategoryId && (this.ids[1] = pCategoryId)
    if(categoryId || pCategoryId) this.flag = true
    return (
      <Card title={ <><ArrowLeftOutlined style={{cursor:'pointer',color:'purple'}} onClick={ () => this.props.history.goBack() } /><span style={{ marginLeft:'15px' }}>{ this.isAdd ? '添加商品' : '修改商品' }</span></>}>
          {/* labelCol指定label的宽度 , wrapperCol指定右侧输入框的宽度 , init初始值*/}
          <Form initialValues={{
            name , 
            price , 
            desc ,
            category
          }} labelCol={{span: 2}} wrapperCol={{span:8}} onFinish={ this.submit.bind(this) } >
            <Form.Item label='商品名称' rules={ [ empty ] } name="name">
              <Input placeholder='请输入商品名称'/>
            </Form.Item>
            <Form.Item label='商品描述' rules={ [ empty ] } name="desc">
              <Input.TextArea placeholder='请输入商品描述' autoSize={{ minRows:2 , maxRows: 4 }}/>
            </Form.Item>
            <Form.Item label='商品价格' rules={ [ empty , min ] }  name="price">
              <Input addonAfter='元' type="number" placeholder='请输入商品价格'/>
            </Form.Item>
            <Form.Item label='商品分类' rules={ [ empty ] } name="category"  >
              <Cascader options={ this.state.options } loadData={ this.loadData.bind(this) } />
            </Form.Item>
            <Form.Item label='商品图片' name='imgs'>
              <Picture imgs= { imgs|| [] } ref={ curr => this.pic = curr} />
            </Form.Item>
            <Form.Item label='商品详情' name='detail' wrapperCol={{span:20}}>
              <RichType ref={ curr => this.rich = curr } detail={ detail } />  
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">提交</Button>
            </Form.Item>
          </Form>
      </Card>
    )
  }
  //提交并验证通过的数据集合函数回调
  async submit(data) {
    //修改分类id
    this.flag && ( data.category = this.ids ) && (this.flag = false)
    data.imgs = this.pic.getItem()
    data.detail = this.rich.getRichTyper()
    //提价修改或增加的分类
    let { category , name ,desc , price , imgs , detail } = data , categoryId , pCategoryId
      pCategoryId = category[ this.isAdd ? 0 : 1]
      categoryId = category[ this.isAdd ? 1 : 0] || '0'

    const product = { name , desc , price , imgs , detail , pCategoryId , categoryId }
    if(!this.isAdd){
      product._id = this.props.location.state.product._id
    }
    let { status } = await ProductOpreat(product)

    if( status === 0){
      message.success( (this.isAdd ? '添加' : '修改') + '成功' )
      this.props.history.goBack()
    }else{
      message.error('操作失败')
    }
  }
  //级联选择框加载分类
  async loadData(sele) {
    //选择的分类
    const targetOption = sele[ sele.length - 1 ]
    //提示加载中
    targetOption.loading = true
    //获取分类
    let subCategorys  = await this.getCategorys(  targetOption.value )
    //去除加载
    targetOption.loading = false
    //判断是否有二级分类，否则去除箭头
    if(subCategorys && subCategorys.length > 0) {
      targetOption.children = subCategorys.map( item => ({ 
        value: item._id , 
        label: item.name , 
        isLeaf: true 
      }))
    }else{
      targetOption.isLeaf = true
    }
    //刷新内容
    this.setState({ options : [...this.state.options] })
  }

  //获取分类
 async getCategorys(parentId){ 
    let { data , status } = await categoryPop({parentId})
    if(status === 0){
      //一级列表和二级列表获取
      if(parentId === '0'){
         //设置一级分类
        this.setState({
          options: data.map( item => ({ value: item._id , label: item.name , isLeaf: false }))
        })
      }else{//二级分类则返回
        return data
      }
    }
  
  }
  
}