import { Component } from 'react'
//引入antd组件
import { Card , Table , Button , message , Select , Modal , Form , Input } from 'antd'
import { PlusOutlined , ArrowRightOutlined } from '@ant-design/icons';
//引入请求列表函数
import { categoryPop , categoryUpdate , categoryAdd } from '../../api/network'


/*商品*/
export default class Product extends Component {
  
  state = { 
    categorys:[] ,//一级分类列表
    subCategorys:[], //二级分类列表
    loading: false, //获取数据的显示项 
    parentId: '0' ,//当前分类显现的id列表
    parentName :'', //当前分类显现的名称
    showStatus: 0 , //显示对话框 0都不显示 1显示添加 2显示更新
  }
  //表格的头部信息
  columns = [
    {
      title:'分类的名称',
      dataIndex:'name'
    },
    {
      title:'操作',
      width:'30%',
      render: item=>{
        return (
          <span>
            <Button onClick={ this.showModalUpdate.bind(this,item) }>修改分类</Button>
            { this.state.parentId === "0" 
                ?<Button onClick={ this.spreakSub.bind(this,item) }>查看子分类</Button>
                : null }
          </span>
        )
      }
    }
  ]
  //修改名称
  updateItem = {}
  //修改分类的显示值
  updateValue=''
  //添加分类数据
  addItem = {
    parentId:'0',
    categoryName:''
  }
  //获取分类列表
  componentDidMount(){
    this.getCategroys()
  }
  render(){
    const { categorys , parentId , parentName , subCategorys , showStatus} = this.state
    ,title = parentId === '0' ? '一级分类列表'  : (
      <span>
        <span style={{cursor:'pointer',color:"#61649f",fontWeight:600}} onClick={ this.backCategory.bind(this) }>一级分类列表</span>
        <ArrowRightOutlined style={{margin:'0 5px'}} />
        <span>{ parentName }</span>
      </span>
    ) 
    return (
      <Card title= {title} extra={<Button type='primary' onClick={ this.showModalAdd.bind(this) } icon={<PlusOutlined />}>添加</Button>}>
        <Table 
          rowKey="_id" bordered 
          columns={this.columns} 
          dataSource={ parentId === '0' ? categorys : subCategorys }
          pagination={{
            defaultPageSize:5,
            showQuickJumper:true,
            pageSizeOptions:['5','10','12']
          }} 
          loading={ this.state.loading }
          scroll={{ y:320 }}>

        </Table>
        
        {/* 添加分类 */}
        <Modal title="添加分类" visible={ showStatus === 1 } onOk={ this.addCategory.bind(this) } onCancel={this.handleCancel.bind(this)}>
            <Form>
              <Form.Item>
                <Select onChange={ eve => {
                  this.addItem.parentId = eve
                  this.setState({})
                } } value={ this.addItem.parentId }>
                  <Select.Option value="0">一级分类</Select.Option>
                  {
                    categorys.map( item => <Select.Option key={item._id} value={ item._id } >{ item.name }</Select.Option> )
                  }
                </Select>
              </Form.Item>
              <Form.Item>
                <Input name='add'  onInput ={ eve => {
                  this.addItem.categoryName = eve.target.value
                  this.setState({})
                } } value= { this.addItem.categoryName } placeholder="请输入分类名称" />
              </Form.Item>
            </Form>
        </Modal>
          {/* 更新 */}
        <Modal title="更新分类"  visible={ showStatus === 2 } onOk={ this.updataCategory.bind(this) } onCancel={this.handleCancel.bind(this)}>
        <Form>
          <Form.Item>
            <Input onInput={ eve=> {
              this.updateValue = eve.target.value
              this.setState({})
            } } value={ this.updateValue } />
          </Form.Item>
        </Form>
        </Modal>
      </Card>
    )
  }
  //请求列表函数
  async getCategroys(pid){
    pid = pid !== undefined ? pid : this.state.parentId
    //提示加载中
    this.setState({loading:true})
    let { data , status  } = await categoryPop({parentId: pid })
    if(status === 0) 
      this.setState({
        [pid === '0' ? 'categorys' : 'subCategorys']: data ,
        total: data.length
      })
    else 
      message.error('获取列表失败 Error')
    //关闭提示
    this.setState({loading:false})
  }
  //显示二级列表
  spreakSub(item){
    this.setState({
      parentId: item._id ,
      parentName: item.name
    },() =>{
      this.getCategroys()
    })

    this.addItem.parentId = item._id
    
  }
  //返回一级列表
  backCategory(){
    //返回一级列表
    this.setState({
      parentId:'0',
      parentName:'',
      subCategorys: []
    })
    //重置添加的id
    this.addItem.parentId = '0'
  }
  //点击取消对话框
  handleCancel(){
    this.setState({showStatus:0})
    this.updateValue = ''
    this.addItem.parentId = '0'
    this.addItem.categoryName = ''
  }
  //显示添加对话框
  showModalAdd(){
    this.setState({ showStatus:1 })
  }
  //显示修改对话框
  showModalUpdate(item){
    this.updateItem = item
    this.updateValue = item.name
    this.setState({
      showStatus:2
    })
  }
  //添加分类
  async addCategory(){ 
    if(this.addItem.categoryName === ''){
      message.warning('不能为空',.9)
      return
    }

    let { status } = await categoryAdd(this.addItem)
    if( status === 0 ){
      //从新获取数据,只有在当前子类或父类添加才从新获取
      if(this.state.parentId  === this.addItem.parentId   ) {
        this.getCategroys()
      }else if(this.addItem.parentId === '0'){
         this.getCategroys('0')
      }
      
      
      //关闭对话框
      this.setState({ showStatus: 0 })
      //清除输入框内的数据
      this.addItem.categoryName = ''
      //提示成功
      message.success('添加成功',.8)
    }
  }
  //更新分类
 async updataCategory(){

   //获取修改的条件和内容
    const categoryId = this.updateItem._id
    ,categoryName = this.updateValue
    //判断内容不能一样
    if(categoryName === this.updateItem.name || categoryName === ''){
      message.warning('不能一样或为空',.8)
      return 
    }
    //发出请求修改并提示成功
    let { status } = await categoryUpdate({ categoryId , categoryName })
    if(status === 0){
      message.success('修改成功', .8)
      this.getCategroys()
      this.setState({ showStatus:0 })
    }else{
      message.error('修改失败')
    }

 }

}