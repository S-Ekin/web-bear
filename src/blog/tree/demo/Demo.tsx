/**
 * @name name
 * @description description
 * @time 2020-03-19
 */
import * as React from "react";
import CodeBlock from "@container/codeBlock/CodeBlock";
import { str1, str2, str3} from "./codeStr";
type Props={

};
type States={

};

class Demo extends React.PureComponent<Props,States> {
    state:States={
    };
    render(){
        const {} = this.props;

        return (
            <div className="g-layout">
                <div className="g-layout-head">
                    创造自由树
                </div>
                <div className="g-layout-article">
                    <div className="g-item-show">
                         <CodeBlock tit='数组创造树的两个方法'>
                        {str1}
                    </CodeBlock>
                    </div>
					<div className="g-item-show">
					<CodeBlock tit='更好利用递归根据字节来统计父节点'>
                        {str2}
                    </CodeBlock>
                    </div>
					<div className="g-item-show">
					<CodeBlock tit='用while代替递归,比较结构相同的多个 tree 的 每个dom节点高度'>
                        {str3}
                    </CodeBlock>
                    </div>
                </div>
            </div>
           
        );
    }
}


export default Demo;