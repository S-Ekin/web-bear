/**
 * @name 页面崩溃处理
 * @description description
 * @time 2020-02-20
 */
import * as React from "react";
import {Button} from '@component/button/index';
import './index.scss';
import CodeBlock from "@container/codeBlock/CodeBlock";
import Layout from "@component/layout/Layout";

type Props={

};
type States={
    error:boolean
};
interface IDemo {
    createCrash():void;
}
const str1 = `//错误要在render函数调用时制造，否则react不会报错
createCrash=()=>{
    // throw new Error();
    this.setState({
        error:true
    });
}
render(){
    const {error} = this.state;
    if(error){
        throw new Error('故意错误！'); // 显性抛出错误
        // return 隐形抛出错误
    }else{
        return (
            <Layout  tit="错误捕获">
            <div className="g-item-show">
                <Button handle={this.createCrash}>抛出错误</Button>
            </div>
            <div className="g-item-show">
                <CodeBlock tit="注意事项">
                    {str1}
                </CodeBlock>
            </div>
            </Layout>
        );
    }

}`;
class Demo extends React.PureComponent<Props,States> implements IDemo{


    state:States={
        error:false
    };
    createCrash=()=>{
       // throw new Error();
       this.setState({
           error:true
       });
    }
    render(){
        const {error} = this.state;
        if(error){
            throw new Error('故意错误！'); // 显性抛出错误
            // return 隐形抛出错误
        }else{
            return (
              <Layout  tit="错误捕获">
                <div className="g-item-show">
                  <Button handle={this.createCrash}>抛出错误</Button>
                </div>
                <div className="g-item-show">
                    <CodeBlock tit="注意事项">
                        {str1}
                    </CodeBlock>
                </div>
              </Layout>
            );
        }
        
    }
}


export default Demo;