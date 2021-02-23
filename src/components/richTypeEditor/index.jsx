import React, { Component } from 'react';
import { EditorState, convertToRaw , ContentState} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

export default class RichEditor extends Component {

  constructor(props){
    super(props)
    let html = this.props.detail , 
    editorState
    if(html){
      const contentBlock = htmlToDraft(html)
      ,contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      editorState = EditorState.createWithContent(contentState)
      
    }else{
      editorState = EditorState.createEmpty()
    }
    
    this.state={
      editorState
    }
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          editorStyle={{ border: '2px solid #000' , minHeight: 100}}
          onEditorStateChange={this.onEditorStateChange}
        />
      </div>
    );
  }
  getRichTyper() {
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }
}