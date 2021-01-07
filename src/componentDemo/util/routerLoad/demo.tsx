/**
 * @name 懒加载
 * @description 异步加载
 * @time 2021-01-07
 */
import "./index.scss";
import * as React from "react";
import { Button } from "@component/button/index";
import Layout from "@component/layout/Layout";
import CodeBlock from "@container/codeBlock/CodeBlock";
import {str1 } from "./CodeStr";
import LoadAble from "@component/util/routerLoad";

type parame = {
  text?:string;
};
// tslint:disable-next-line: variable-name
const PendingCom:React.FunctionComponent = ()=>{
  return (
    <div className="pending common">
      待异步加载的组件
    </div>
  );
};

type Props = {};
type States = {
  LoaderComArr: React.ComponentType<parame>[];
};
class Demo extends React.PureComponent<Props, States> {
  state: States = {
    LoaderComArr: []
  };
  
  btnHandle = (e:React.MouseEvent<HTMLButtonElement>) => {
    const dom = e.currentTarget;
    const type = dom.name;
    if (type === "btn1") {
      this.setState(pre => {
        const arr = pre.LoaderComArr;
        return {
          LoaderComArr: arr.concat([LoadAble<parame>({
                           loader:()=>import("./asyncCom")
                        })])
        };
      });
    } else if (type === "btn2") {
      this.setState(pre => {
        const arr = pre.LoaderComArr;
        return {
          LoaderComArr: arr.concat([LoadAble<parame>({
                           loader:()=>import("./asyncCom2")
                        })])
        };
      });
    } else if(type === "btn3"){
      this.setState({
        LoaderComArr:[]
      });
    }
  }

  getAsyncComList(){
    const { LoaderComArr } = this.state;
    // tslint:disable-next-line: variable-name
    return LoaderComArr.length ? LoaderComArr.map((Com, index) =>{
        return <Com key={index} text={`${index + 1}`} />;
    }) : <PendingCom />;
  }

  render() {
    return (
      <Layout tit="动态路由加载" className="loadable-page">
        <div className="g-item-show ">
          <div className="flex-between">
            <Button
              handle={this.btnHandle}
              name="btn1"
            >
              动态加载1
            </Button>   
            <Button
              handle={this.btnHandle}
              name="btn2"
            >
              动态加载2
            </Button> 
             <Button
              handle={this.btnHandle}
              name="btn3"
            >
              复位
            </Button>          
          </div>
          <div className="box">
              <div className="com1 common">
                已经存在的组件
              </div>
              <div style={{display: "flex", flexWrap: "wrap",}}>
              {this.getAsyncComList()}
              </div>
          </div>
        </div>
        <div className="g-item-show">
            <CodeBlock tit="动态加载说明" language="html">
              {str1}
            </CodeBlock>
          </div>
      </Layout>
    );
  }
}

export default Demo;