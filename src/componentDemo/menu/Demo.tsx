/**
 * @name name
 * @description description
 * @time 2020-04-20
 */
import * as React from "react";
import Layout from "@component/layout/Layout";
import CodeBlock from "@container/codeBlock/CodeBlock";
import {str1} from "./CodeStr";

type Props={

};
type States={

};
interface IDemo {

}
class Demo extends React.PureComponent<Props,States> implements IDemo{


    state:States={

    };
    render(){
        const {} = this.props;

        return (
            <Layout tit="菜单">
                <div className="g-item-show">
                    <CodeBlock tit="asd">
                        {str1}
                    </CodeBlock>
                </div>
            </Layout>
        );
    }
}


export default Demo;