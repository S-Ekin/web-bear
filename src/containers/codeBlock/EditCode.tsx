/**
 * @name MarkDown
 * @description 文字编辑器
 * @time 2020-03-02
 */
import MarkDown from 'react-markdown';
import * as React from "react";
// import CodeBlock from '../codeBlock/CodeBlock';
type Props={

};
type States={
  content:string;
};
interface IEditCode {
  onChange(e:React.ChangeEvent<HTMLTextAreaElement>):void;
}
class EditCode extends React.PureComponent<Props, States> implements IEditCode {


  state:States={
    content: ""
  };
  onChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({
      content: e.currentTarget.value
    });
  }
  render () {
    return (
      <div>
        <textarea onChange={this.onChange}/>
        <MarkDown className="result">
          {this.state.content}
        </MarkDown>
      </div>
    );
  }
}


export default EditCode;
