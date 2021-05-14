/**
 * @name 显示代码块
 * @description description
 * @time 2020-03-01
 */
import * as React from "react";
import 'highlight.js/styles/atom-one-dark.css';
import hljs from 'highlight.js';
import hljsNumber from 'highlightjs-line-numbers2.js';
import {SvgIcon} from '@component/my-icon/index';
import { SlideBox } from "@component/animate/index";
// hljs.initHighlightingOnLoad();
hljsNumber.init(hljs);
// hljs.initLineNumbersOnLoad({singleLine: true});


type Props={
  children:string;
  language?:string;
  tit:React.ReactNode;
};
type States={
  expand:boolean;
};
interface ICodeBlock {
  codeRef:React.RefObject<HTMLDivElement>;
}
class CodeBlock extends React.PureComponent<Props, States> implements ICodeBlock {
  static defaultProps={
    language: 'javascript'
  };
  //  static  getDerivedStateFromProps(nextProps:Props,preState:States){
  //     // console.log('getDerivedStateFromProps');
  //     // console.log(nextProps);
  //     // console.log(preState);

  // }
  codeRef:ICodeBlock['codeRef']=React.createRef();
  state:States={
    expand: false,
  };

  componentDidMount () {
    const dom = this.codeRef.current!;
    hljs.highlightBlock(dom);
    // hljs.lineNumbersBlock(dom);
  }
  slideFn=() => {
    this.setState((pre) => ({
      expand: !pre.expand
    }));
  }
  render () {
    const {children, language, tit} = this.props;
    const {expand} = this.state;
    return (
      <div>
        <div className="flex-center">
          {tit}
          <span onClick={this.slideFn}><SvgIcon className={expand ? 'arrow-down' : 'arrow-up'}/></span>
        </div>
        <SlideBox slide={expand}>
          <pre>
            <code ref={this.codeRef} className={`language-${language || ""}`}>
              {children}
            </code>
          </pre>
        </SlideBox>
      </div>

    );
  }
}


export default CodeBlock;
