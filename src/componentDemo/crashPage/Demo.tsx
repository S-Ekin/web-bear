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
import {str1,str2} from "./CodeStr";
import ErrorBoundary from "@component/crashPage/ErrorBoundary";
type Props={

};
type States={
    error:boolean;
    init:{init:boolean}
};
interface IDemo {
    createCrash():void;
}

class Demo extends React.PureComponent<Props,States> implements IDemo{

    getHasErrorFn:(()=>boolean) | undefined;
    bindGetHasError=(getHasErrorFn:(()=>boolean))=>{
		this.getHasErrorFn = getHasErrorFn;
	}
    state:States={
        error:false,
        init:{init:false}
    };
    createCrash=()=>{
       // throw new Error();
       this.setState({
           error:true
       });
    }
    changeConfig=()=>{
        this.setState(pre=>{
           return {
                init:{init:!pre.init.init}
           } 
        })
    }
    getHasErrorBtnHandl=()=>{
        const hasError = this.getHasErrorFn!();
        alert(`hasError：${hasError}`)
    }
    getCodeBlockTit(){
        return (
            <div>
                <Button handle={this.getHasErrorBtnHandl}>
                获取错误捕获组件状态
                </Button>
            </div>
        )
    }
    render(){
        const {error,init} = this.state;
        if(error){
            throw new Error('故意错误！'); // 显性抛出错误
            // return 隐形抛出错误
        }else{
            return (
              <Layout  tit="错误捕获">
                <div className="g-item-show">
                    <ErrorBoundary 
                        init={init}
                        bindGetHasError={this.bindGetHasError} 
                    >
                        <div>
                            <Button handle={this.createCrash} >抛出整个路由页面的错误</Button>
                        </div>
                        <div className="inp-item">
                            <Button styleType="line-btn" colorType="danger" handle={this.changeConfig}>改变当前错误捕获组件</Button>
                        </div>
                       
                    </ErrorBoundary>
                </div> 
                <div className="g-item-show">
                    <CodeBlock tit="注意事项">
                        {str1}
                    </CodeBlock>
                </div>
                <div className="g-item-show">
                    <CodeBlock tit={this.getCodeBlockTit()}>
                        {str2}
                    </CodeBlock>
                </div>
              </Layout>
            );
        }
        
    }
}


export default Demo;