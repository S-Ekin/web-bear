/**
 * @name  布局的组件
 * @description description
 * @time 2020-04-14
 */
import * as React from "react";
import Layout from "@component/layout/Layout";
import CodeBlock from "@container/codeBlock/CodeBlock";
type Props={
};
type States={

};
interface IDemo {

}
const str1 = `render(){
        const {tit,children,className} = this.props;

        return (
          <div className={"g-layout" className}>
            <div className="g-layout-head">{tit}</div>
            <div className="g-layout-article">{children}</div>
          </div>
        );
    }`;

class Demo extends React.PureComponent<Props,States> implements IDemo{


    state:States={

    };
    render(){

        return (
          <Layout tit="头部">
            <div className="g-item-show">
              <CodeBlock  tit="布局的html结构">
                {str1}
              </CodeBlock>
            </div>
          </Layout>
        );
    }
}


export default Demo;