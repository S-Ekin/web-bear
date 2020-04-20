/**
 * @name name
 * @description 一定要在组件卸载的时候关掉定时器
 * @time 2020-02-19
 */
import * as React from "react";
import Loading from "@component/loading/Loading";
import loadFn from '@component/loading/loadMethod';
import {CheckBox} from "@component/input/index";
import {Button} from '@component/button/index';
import Layout from "@component/layout/Layout";
import CodeBlock from "@container/codeBlock/CodeBlock";
import {str1,str2,str3} from "./CodeStr";
type Props={

};
type States={
    closeTime:number;
    closeComTime:number;
    closePortalTime:number;
    wrapDom:"wrap-loading" | "root-loading";
    showLoading:boolean;
    showPortLoading:boolean;
};
const innerLoadingWrap = document.getElementById("wrap-loading")!;
const outLoadingWrap = document.getElementById("out-modal-wrap")!;
interface IIndex {
    btnLoadingFn(e:React.MouseEvent<HTMLButtonElement>):void;
}
class Demo extends React.PureComponent<Props,States> implements IIndex{

    timeInterval:number = 0;
    timeTimeOut:number = 0;
    loadingRef:React.RefObject<HTMLDivElement> = React.createRef();
    state:States={
        closeTime:0,
        closeComTime:0,
        closePortalTime:0,
        wrapDom:"wrap-loading",
        showLoading:false,
        showPortLoading:false,
    };
    componentDidMount(){
        console.log(this.loadingRef);
    }
    btnLoadingFn=(e:React.MouseEvent<HTMLButtonElement>)=>{
        const val = e.currentTarget.value;
        if(val==="open"){
            loadFn.open();
            this.setState({
                closeTime:5
            });
            this.timeInterval= window.setInterval(()=>{
                this.setState(pre=>{
                    return {
                        closeTime:pre.closeTime-1
                    };
                });
            },1000);
            this.timeTimeOut = window.setTimeout(()=>{
                loadFn.close();
                window.clearInterval(this.timeInterval);
                this.setState({
                    closeTime:0
                });
            },5000);
        }
    }
    loadingComOpt=(e:React.MouseEvent<HTMLButtonElement>)=>{

      const dom = e.currentTarget!;
      const value = dom.value;
      const name= dom.name; 

      this.setState({
        [name as "showLoading"]:value==="show"
      });
      
      if(value==="show"){
          window.clearInterval(this.timeInterval);
          window.clearTimeout(this.timeTimeOut);

          const closeField = name === "showLoading" ?"closeComTime" :"closePortalTime";
            this.setState({
                [closeField as "closeComTime"]:5
            });
            this.timeInterval = window.setInterval(()=>{
                this.setState(pre=>{
                    return {
                      [closeField as "closeComTime"]:pre[closeField]-1
                    };
                });
            },1000);
            this.timeTimeOut = window.setTimeout(()=>{
                window.clearInterval(this.timeInterval);
                this.setState({
                      [closeField as "closeComTime"]:0,
                    [name as "showLoading"]:false
                });
            },5000);
        }
    }
    changeWrap=(e:React.ChangeEvent<HTMLInputElement>)=>{
      const dom = e.currentTarget!;
      const val = dom.value as States['wrapDom'];
      this.setState({
        wrapDom:val
      });
    }
    componentWillUnmount(){
      window.clearInterval(this.timeInterval);
      window.clearInterval(this.timeTimeOut);
    }
    render(){
        const {closeTime,wrapDom,showLoading,closeComTime,showPortLoading,closePortalTime} = this.state;
        const portalLoadCom = showPortLoading  ? (
           <Loading container={wrapDom === "wrap-loading" ?innerLoadingWrap :outLoadingWrap} />
        ) :undefined;
        const loadingCom = showLoading? (
           <Loading.LoadingCom />
        ) :undefined;
        return (
          <Layout tit="数据加载">
            <div className="g-item-show ">
              <div className="flex-between">
                <p className="title">通过组件，指定容器的加载</p>
                <div className="m-optBtn">
                  <Button val="show" handle={this.loadingComOpt} name="showPortLoading">
                    打开
                  </Button>
                  <Button
                    colorType="green"
                    styleType="line-btn"
                    name="showPortLoading"
                    val="close"
                    handle={this.loadingComOpt}
                  >
                    <span>{closePortalTime ? closePortalTime : ""}</span>
                    <span>关闭</span>
                  </Button>
                </div>
              </div>
              <div ref={this.loadingRef}>{portalLoadCom}</div>
              <div className="inp-item">
                <span>指定加载的容器：</span>
                <CheckBox
                  name="wrapDom"
                  value="wrap-loading"
                  changeHandle={this.changeWrap}
                  checked={wrapDom === "wrap-loading"}
                >
                  wrap-loading
                </CheckBox>
                <CheckBox
                  name="wrapDom"
                  value="root-loading"
                  changeHandle={this.changeWrap}
                  checked={wrapDom === "root-loading"}
                >
                  root-loading
                </CheckBox>
              </div>
            </div>
            <div className="g-item-show">
              <CodeBlock tit="通过组件，再用react Portal 指定渲染的容器">
                {str1}
              </CodeBlock>
            </div>
            <div className="g-item-show " >
              <div className="flex-between">
                <p>直接在所在的父容器渲染</p>
                <div >
                   <div className="m-optBtn">
                  <Button val="show" name="showLoading" handle={this.loadingComOpt}>
                    打开
                  </Button>
                  <Button
                    colorType="green" 
                    name="showLoading"
                    styleType="line-btn"
                    val="close"
                    handle={this.loadingComOpt}
                  >
                    <span>{closeComTime ? closeComTime : ""}</span>
                    <span>关闭</span>
                  </Button>
                </div>
                </div>
              </div>
              <div className="relative-box">
                {loadingCom}
              </div>
            </div>
            <div className="g-item-show">
              <CodeBlock tit="直接在所在的父容器渲染">
                {str2}
              </CodeBlock>
            </div>

            <div className="g-item-show flex-between">
              <p className="title">
                通过调用loading方法,3s后调用关闭方法
              </p>
              <div className="m-optBtn">
                <Button val="open" handle={this.btnLoadingFn}>
                  打开
                </Button>
                <Button
                  colorType="green"
                  styleType="line-btn"
                  val="close"
                  handle={this.btnLoadingFn}
                >
                  <span>{closeTime ? closeTime : undefined}</span>
                  <span>关闭</span>
                </Button>
              </div>
            </div>
            <div className="g-item-show">
              <CodeBlock tit="通过调用loading方法">
                {str3}
              </CodeBlock>
            </div>
          </Layout>
        );
    }
}


export default Demo;