/**
 * @name name
 * @description description
 * @time 2019-09-18
 */
import "./index.scss";
import * as React from "react";
import { Button } from "@component/button/index";
import Layout from "@component/layout/Layout";
import {createImmutableMap} from "@component/util/createImmutaleMap";
import { Input, CheckBox } from "@component/input/index";
import CodeBlock from "@container/codeBlock/CodeBlock";
import {str1 } from "./CodeStr";
import data from "../../table/data";
import { ScrollBox } from "@component/scroll";
import { IScrollMethods } from "@component/scroll/scroll";
type Props = {
};
type config = {
  height: string;
  className: string;
  keepBarShow:boolean,
  time:string;
};

type States = {
  immuConfig:IImmutalbeMap<config>;
  preConfig: IImmutalbeMap<config>;
  listStartIndex: number;
  top:string;
  key:number;
};
interface IDemo {
  changeConfig(e: React.ChangeEvent<HTMLInputElement>):void;
}

const config:config = {
  height: "300",
  className: "",
  time: "300",
  keepBarShow: false,
};

class Demo extends React.PureComponent<Props, States> implements IDemo {
  state: States = {
    immuConfig: createImmutableMap(config),
    preConfig: createImmutableMap(config),
    listStartIndex: 0,
    top: "",
    key: 1
  };
  scrollMethods:undefined | IScrollMethods ;
  bindScrollMethods = (scrollMethods:IScrollMethods) => {
    this.scrollMethods = scrollMethods;
  }
  changeConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dom = e.currentTarget;
    const name = dom.name as keyof config;
    let value =  name === "keepBarShow" ? dom.value === "1" : dom.value;

    this.setState((pre) => ({
      immuConfig: pre.immuConfig.set(name, value),
    }));
  }

  btnHandle = (e:React.MouseEvent<HTMLButtonElement>) => {
    const dom = e.currentTarget;
    const type = dom.name;
    if (type === "btn1") {
      this.setState((pre) => ({
        preConfig: pre.immuConfig,
        key: pre.key + 1
      }));
    } else if (type === "btn2") {
      this.setState({
        listStartIndex: Math.round(data.length * (Math.random()))
      });
    }

  }
  scrollTo=() => {
    this.scrollMethods!.scrollToTop(+this.state.top);
  }
  getList () {
    return data.slice(this.state.listStartIndex).map((val, index) => (
      <div className="list-item" key={val.eventNo}>
        <div>{index + 1}</div>
        <div>{val.org_name}</div>
        <div>{val.eventNo}</div>
        <div>{val.category_name}</div>
        <div>{val.a_SHANGBAOREN}</div>
      </div>
    ));
  }
  changeInp = (e:React.ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    this.setState({
      top: val
    });
  }
  getCodeBlockTit1 () {
    return (
      <>
        <div>
          <Input
            value={this.state.top}
            norequire
            changeFn={this.changeInp}
            type="number"
          >
            <span>外部控制向下滚动</span></Input>
          <span style={{padding: "0 16px", }}/>
          <Button handle={this.scrollTo}>滚动</Button>
        </div>
      </>
    );
  }
  render () {
    const { preConfig, immuConfig, listStartIndex, key } = this.state;
    const {
      height,
      className,
      keepBarShow,
      time
    } = immuConfig.toJS();
    return (
      <Layout tit="滚动条" className="scroll-page">
        <div className="g-item-show ">
          <div className="flex-between">
            <Button
              handle={this.btnHandle}
              name="btn1"
            >
              刷新配置
            </Button>
            <Button
              handle={this.btnHandle}
              name="btn2"
            >
              改变数据量: {data.length - listStartIndex}
            </Button>
          </div>
          <div>
            <div className="inp-item">
              <Input
                type="text"
                changeFn={this.changeConfig}
                name="className"
                norequire
                value={className}
              >
                  类名 className:
              </Input>
            </div>
            <div className="inp-item">
              <Input
                type="number"
                norequire
                changeFn={this.changeConfig}
                name="height"
                value={height}
              >
                  高度 height:
              </Input>
            </div>
            <div className="inp-item">
              <Input
                type="number"
                norequire
                changeFn={this.changeConfig}
                name="time"
                value={time}
              >
                  延迟更新滚动条的时间（比如在菜单收缩完成后开始更新） time:
              </Input>
            </div>
            <div className="inp-item">
              <span>保持滚动条显示 keepBarShow：</span>
              <CheckBox
                name="keepBarShow"
                value="1"
                type="radio"
                checked={keepBarShow}
                changeHandle={this.changeConfig}
              >
                      是
              </CheckBox>
              <CheckBox
                name="keepBarShow"
                value="2"
                type="radio"
                checked={!keepBarShow}
                changeHandle={this.changeConfig}
              >
                      否
              </CheckBox>
            </div>
          </div>
        </div>
        <div className="g-item-show">
          <CodeBlock tit={this.getCodeBlockTit1()} language="jsx">{str1}</CodeBlock>
        </div>
        <div className="g-item-show">
          <ScrollBox
            key={key}
            className={preConfig.get("className")}
            keepBarShow={preConfig.get("keepBarShow")}
            height={+preConfig.get("height")}
            bindIntiScroll={this.bindScrollMethods}
          >
            <div className="main-demo" >
              {this.getList()}
            </div>
          </ScrollBox>
        </div>
        <div style={{height: 500, padding: 20, border: "1px solid", overflow: "auto"}}>
          <div  style={{height: 1500, background: "red"}}></div>
        </div>
      </Layout>
    );
  }
}

export default Demo;
