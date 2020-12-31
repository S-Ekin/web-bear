/*
 * @name SEkin
 * @description 动画组件
 * @time 2020-12-31
 */
import "./index.scss";
import * as React from "react";
import { Button } from "@component/button/index";
import Layout from "@component/layout/Layout";
import { createImmutableMap } from "@component/util/createImmutaleMap";
import { CheckBox, Input } from "@component/input/index";
import CodeBlock from "@container/codeBlock/CodeBlock";
import { str1 } from "./CodeStr";
import { Animate } from "@component/animate/index";
import { AnimateType, domAnimateProp } from "@component/animate/animateType";
type Props = {};
type config = {
  animation: AnimateType | domAnimateProp; // 动画效果过程
  spanWrapEle: boolean;
  className: string;
  display: "block" | "inline-block" | "flex";
  duration: number;
  runMount: boolean; // 组件挂载的时候就展示
};

type States = {
  immuConfig: IImmutalbeMap<config>;
  preConfig: IImmutalbeMap<config>;
  key: number;
  animation: AnimateType | keyof domAnimateProp; // 动画效果过程
};
interface IDemo {
  changeConfig(e: React.ChangeEvent<HTMLInputElement>): void;
}

const config: config = {
  animation: "fadeIn", // 动画效果过程
  spanWrapEle: false,
  className: "h200",
  display: "block",
  duration: 300,
  runMount: false, // 组件挂载的时候就展示
};
class Demo extends React.PureComponent<Props, States> implements IDemo {
  state: States = {
    immuConfig: createImmutableMap(config),
    preConfig: createImmutableMap(config),
    animation: "fadeIn",
    key: 1,
  };
  animateObj={
      "dom-width": "500",
      "dom-height": "250",
      "dom-transformX": "0",
      "dom-transformY": "0"
  };
   initStyle = {
     height: 200
   }; 

  changeConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dom = e.currentTarget;
    const name = dom.name as keyof config;
    let value = ["runMount", "spanWrapEle"].includes(name)
      ? dom.value === "1"
      : dom.value.trim();

    this.setState((pre) => {
      return {
        immuConfig: pre.immuConfig.set(name, value),
      };
    });
  }

  changeAnimation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dom = e.currentTarget;
    const name = dom.name as any;
    if (name === "animation") { // chebkbox
      const val = dom.value as States["animation"];
      if (!["width", "height", "transform", "opacity"].includes(val)) {
          this.setState((state)=>{
            return {
              animation: val,
              immuConfig: state.immuConfig.set("animation", val as AnimateType)
            };
          });      
      } 
      this.setState({
        animation: val,
      });
    } else  {// 输入框
        const val = dom.value;
        if (name.includes(this.state.animation) && val !== this.animateObj[name as "dom-width"] ) {
           this.setState((state)=>{
            const objVal = name === "dom-transformX" ?
             `translate(${val}px, ${this.animateObj["dom-transformY"]}px)` : 
             name === "dom-transformY" ? `translate(${this.animateObj["dom-transformX"]}px, ${val}px)`  : +val;
            return {
              immuConfig: state.immuConfig.set("animation", {
                [state.animation]: objVal,
              }),
            };
          });
        }

        this.animateObj[name as "dom-width"] = val;
    }
  }

  btnHandle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const dom = e.currentTarget;
    const type = dom.name;
    if (type === "btn1") {
      this.setState((pre) => {
        return {
          preConfig: pre.immuConfig,
          key: pre.key + 1,
        };
      });
    } else if (type === "btn2") {
      console.log(1);
    }
  }
  render() {
    const { preConfig, immuConfig, key, animation} = this.state;
    const {
      className,
      runMount,
      spanWrapEle,
      display,
      duration,
    } = immuConfig.toJS();
    return (
      <Layout tit="动画组件" className="animate-page">
        <div className="g-item-show ">
          <div className="flex-between">
            <Button handle={this.btnHandle} name="btn1">
              刷新配置
            </Button>
            <Button handle={this.btnHandle} name="btn2">
              下拉
            </Button>
          </div>
          <div className="flex-between">
            <div>
              <div className="inp-item">
                <span>动画展示 runMount：</span>
                <CheckBox
                  name="runMount"
                  value="1"
                  type="radio"
                  checked={runMount}
                  changeHandle={this.changeConfig}
                >
                  是
                </CheckBox>
                <CheckBox
                  name="runMount"
                  value="2"
                  type="radio"
                  checked={!runMount}
                  changeHandle={this.changeConfig}
                >
                  否
                </CheckBox>
              </div>
              <div className="inp-item">
                <span>span包裹元素 spanWrapEle:</span>
                <CheckBox
                  name="spanWrapEle"
                  value="1"
                  type="radio"
                  checked={spanWrapEle}
                  changeHandle={this.changeConfig}
                >
                  是
                </CheckBox>
                <CheckBox
                  name="spanWrapEle"
                  value="2"
                  type="radio"
                  checked={!spanWrapEle}
                  changeHandle={this.changeConfig}
                >
                  否
                </CheckBox>
              </div>
              <div className="inp-item">
                <span>display样式 display：</span>
                <CheckBox
                  name="display"
                  value="flex"
                  type="radio"
                  checked={display === "flex"}
                  changeHandle={this.changeConfig}
                >
                  flex
                </CheckBox>
                <CheckBox
                  name="display"
                  value="block"
                  type="radio"
                  checked={display === "block"}
                  changeHandle={this.changeConfig}
                >
                  block
                </CheckBox>
                <CheckBox
                  name="display"
                  value="inline-block"
                  type="radio"
                  checked={display === "inline-block"}
                  changeHandle={this.changeConfig}
                >
                  inline-block
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
                <Input
                  type="number"
                  changeFn={this.changeConfig}
                  name="duration"
                  norequire={true}
                  value={`${duration}`}
                >
                  动画时间 duration:
                </Input>
              </div>
              <div className="inp-item">样式 styleObj: 【行内样式】</div>
            </div>
          </div>
        </div>
        <div className="g-item-show">
          <div style={{ marginBottom: 16, }}>
            <span>动画类型 animation：</span>
          </div>
          <div className="inp-item">
            <span>动画名：</span>
            <CheckBox
              name="animation"
              value="fadeIn"
              type="radio"
              checked={animation === "fadeIn"}
              changeHandle={this.changeAnimation}
            >
              fadeIn
            </CheckBox>
            <CheckBox
              name="animation"
              value="fadeOut"
              type="radio"
              checked={animation === "fadeOut"}
              changeHandle={this.changeAnimation}
            >
              fadeOut
            </CheckBox>
            <CheckBox
              name="animation"
              value="bounceDownIn"
              type="radio"
              checked={animation === "bounceDownIn"}
              changeHandle={this.changeAnimation}
            >
              bounceDownIn
            </CheckBox>
            <CheckBox
              name="animation"
              value="bounceRightIn"
              type="radio"
              checked={animation === "bounceRightIn"}
              changeHandle={this.changeAnimation}
            >
              bounceRightIn
            </CheckBox>
            <CheckBox
              name="animation"
              value="bounceDownOut"
              type="radio"
              checked={animation === "bounceDownOut"}
              changeHandle={this.changeAnimation}
            >
              bounceOutIn
            </CheckBox>
          </div>
          <div className="inp-item">
            <span>属性名：</span>
            <CheckBox
              name="animation"
              value="width"
              type="radio"
              checked={animation === "width"}
              changeHandle={this.changeAnimation}
            >
              <Input
                type="number"
                blurFn={this.changeAnimation}
                name="dom-width"
                width={100}
                norequire={true}
              >
                width:
              </Input>
            </CheckBox>
            <CheckBox
              name="animation"
              value="height"
              type="radio"
              checked={animation === "height"}
              changeHandle={this.changeAnimation}
            >
              <Input
                type="number"
                blurFn={this.changeAnimation}
                name="dom-height"
                width={100}
                norequire={true}
              >
                height:
              </Input>
            </CheckBox>
            <CheckBox
              name="animation"
              value="transform"
              type="radio"
              checked={animation === "transform"}
              changeHandle={this.changeAnimation}
            >
              <Input
                type="number"
                blurFn={this.changeAnimation}
                name="dom-transformX"
                norequire={true}
                width={100}
              >
                transformX:
              </Input>
              <Input
                type="number"
                blurFn={this.changeAnimation}
                name="dom-transformY"
                width={100}
                norequire={true}
              >
                transformY:
              </Input>
            </CheckBox>
          </div>

          <div className="show-box">
            <div style={{ width: 500, }}>
              <Animate
                runMount={preConfig.get("runMount")}
                animation={immuConfig.get("animation")}
                className={preConfig.get("className")}
                display={preConfig.get("display")}
                spanWrapEle={preConfig.get("spanWrapEle")}
                duration={preConfig.get("duration")}
                styleObj={this.initStyle}
                key={key}
              >
                <div className="text-box">测试容器</div>
              </Animate>
            </div>
          </div>
        </div>
        <div className="g-item-show">
          <CodeBlock tit="可被用到的组件" language="html">
            {str1}
          </CodeBlock>
        </div>
      </Layout>
    );
  }
}

export default Demo;
