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
import { CheckBox,Input } from "@component/input/index";
import CodeBlock from "@container/codeBlock/CodeBlock";
import {str1 } from "./CodeStr";
import { SlideBox } from "@component/animate/index";
type Props = {};
type config = {
  isImmedia: boolean; // 连续点击时，立马结束上一次动画
  slide: boolean;
  directionUp: boolean; // 下拉框在显示框上还是下
  className:string;
};

type States = {
  immuConfig:IImmutalbeMap<config>;
  preConfig: IImmutalbeMap<config>;
  key:number;
};
interface IDemo {
	changeConfig(e: React.ChangeEvent<HTMLInputElement>):void;
}

const config:config = {
  isImmedia: false,
  slide: false,
  directionUp: false,
  className:"",
};

class Demo extends React.PureComponent<Props, States> implements IDemo {
  state: States = {
    immuConfig: createImmutableMap(config),
    preConfig: createImmutableMap(config),
    key:1
  };
 
  changeConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dom = e.currentTarget;
    const name = dom.name as keyof config;
    let value = ["className"].includes(name) ? dom.value.trim():  dom.value === "1";

    this.setState((pre) => {
      return {
        immuConfig: pre.immuConfig.set(name, value),
      };
    });
  }
  
  btnHandle = (e:React.MouseEvent<HTMLButtonElement>) => {
    const dom = e.currentTarget;
    const type = dom.name;
    if (type === "btn1") {
      this.setState(pre=>{
        return {
          preConfig: pre.immuConfig,
          key: pre.key+1
        };
      });
    } else if (type === "btn2") {
     this.setState(pre=>{
        return {
          preConfig: pre.preConfig.set("slide",!pre.preConfig.get("slide")),
        };
      });
    }
  }

  getList () {

    return new Array(15).fill("").map((_val, index) => {
      return (
        <div className="item" key={index}>
          {index + 1}
        </div>
      );
    });
  }
 
  render() {
    const { preConfig,immuConfig,key } = this.state;
    const {
      isImmedia,slide,directionUp,className
	} = immuConfig.toJS();
    return (
      <Layout tit="下拉组件" className="slideBox-page">
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
              下拉
            </Button>
          </div>
          <div className="flex-between">
            <div>
              <div className="inp-item">
                    <span>动画立即执行 isImmedia：</span>
                    <CheckBox
                      name="isImmedia"
                      value="1"
                      type="radio"
                      checked={isImmedia}
                      changeHandle={this.changeConfig}
                    >
                      是
                    </CheckBox>
                    <CheckBox
                      name="isImmedia"
                      value="2"
                      type="radio"
                      checked={!isImmedia}
                      changeHandle={this.changeConfig}
                    >
                      否
                    </CheckBox>
                  </div>
              <div className="inp-item">
                    <span>下拉方向 directionUp：</span>
                    <CheckBox
                      name="directionUp"
                      value="1"
                      type="radio"
                      checked={directionUp}
                      changeHandle={this.changeConfig}
                    >
                      是
                    </CheckBox>
                    <CheckBox
                      name="directionUp"
                      value="2"
                      type="radio"
                      checked={!directionUp}
                      changeHandle={this.changeConfig}
                    >
                      否
                    </CheckBox>
                  </div>
              <div className="inp-item">
                    <span>下拉状态 slide：</span>
                    <CheckBox
                      name="slide"
                      value="1"
                      type="radio"
                      checked={slide}
                      changeHandle={this.changeConfig}
                    >
                      是
                    </CheckBox>
                    <CheckBox
                      name="slide"
                      value="2"
                      type="radio"
                      checked={!slide}
                      changeHandle={this.changeConfig}
                    >
                      否
                    </CheckBox>
                  </div>
            </div>
            <div>
              <div className="inp-item">
                <Input
                  type="text"
                  changeFn={this.changeConfig}
                  name="className"
                  norequire={true}
                  value={className}
                >
                  类名 className:
                </Input>
              </div>
              <div className="inp-item">
                样式  styleObj: 【行内样式】
              </div>
            </div>
          </div>
            
        </div>
        <div className="g-item-show">
          <div className="slide-test">下拉面板</div>
          <div className="slide-box">
             <SlideBox
              isImmedia={preConfig.get("isImmedia")}
              slide={preConfig.get("slide")}
              key={key}
              directionUp={preConfig.get("directionUp")}
              >
                <div className="text-box">
                  {this.getList()}
                </div>
              </SlideBox>
              </div>
        </div>
        <div className="g-item-show">
          <CodeBlock tit="可被用到的组件" language="html">{str1}</CodeBlock>
        </div>
      </Layout>
    );
  }
}

export default Demo;