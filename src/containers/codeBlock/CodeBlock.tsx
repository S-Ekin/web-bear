/**
 * @name 显示代码块
 * @description description
 * @time 2020-03-01
 */
import * as React from "react";
import 'highlight.js/styles/atom-one-dark.css';
import hljs from 'highlight.js';
import hljsNumber from 'highlightjs-line-numbers2.js';

//hljs.initHighlightingOnLoad();
hljsNumber.init(hljs);
//hljs.initLineNumbersOnLoad({singleLine: true});


type Props={
    children:string;
};
type States={

};
interface ICodeBlock {
    codeRef:React.RefObject<HTMLDivElement>;
}
class CodeBlock extends React.PureComponent<Props,States> implements ICodeBlock{
    //  static  getDerivedStateFromProps(nextProps:Props,preState:States){
    //     // console.log('getDerivedStateFromProps');
    //     // console.log(nextProps);
    //     // console.log(preState);
        
    // }
    codeRef:ICodeBlock['codeRef']=React.createRef();
    state:States={

    };
   
    componentDidMount(){
        const dom = this.codeRef.current!;
        hljs.highlightBlock(dom);
        hljs.lineNumbersBlock(dom);
    }
    render(){
        const {children} = this.props;

        return (
            <pre>
                <code ref={this.codeRef} className={`language-javascript`}>
                    {children}
                </code>
            </pre>
        );
    }
}


export default CodeBlock;