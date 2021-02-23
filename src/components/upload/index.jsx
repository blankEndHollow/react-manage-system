import { Component } from 'react'
import { Upload, Modal , message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { baseURL , delPic } from '../../api/network'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class PicturesWall extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: [],
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  //图片状态改变的操作
  handleChange = async({ file ,fileList}) => {
    
    if(file.status === 'done'){
      let result = file.response
    if(result && result.status === 0){
        let { name , url } = result.data
        file = fileList[ fileList.length - 1]
        file.name = name 
        file.url = baseURL + '/' + url.split('/').slice(3).join('/')
      }
    }else if(file.status === 'removed'){
      let { status } = await delPic(file.name)
      if(status === 0){
        message.success('已删除', .8)
      }
    }
    this.setState({
      fileList
    })
  };
  //初始图片
  componentDidMount() {
    let i = -3
    , fileList =this.props.imgs.map( item => {
      return {
        uid: i-- +'',
        url:baseURL+'/upload/' + item ,
        name : item ,
        status : 'done'
      }
    })
    this.setState({ fileList })
  }
  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    
    
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <Upload
          action= {baseURL + "/manage/img/upload"}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          accept={'image/*'}
          name="image" 
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
  //获取图片名称
  getItem() {
    return this.state.fileList.map( item => item.name)
  }
}

export default PicturesWall