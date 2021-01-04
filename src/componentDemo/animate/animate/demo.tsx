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
import notice from "@component/toast/index";
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
  animation: AnimateType | "domProps"; // 动画效果过程
  animateObj:{
        "width": string,
        "height": string,
        "transformX": string,
        "transformY": string
  }
  domPropsArr:string[];
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
    domPropsArr:["width","height","transform"],
    animateObj:{
        "width": "500",
        "height": "250",
        "transformX": "0",
        "transformY": "0"
    }
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
      if (val !== "domProps") { // 动画名
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
    } else if (name === "domProps") { // 属性复选框
      if (document.querySelectorAll("#propsBox .no-fill").length) {
        notice.add("填写完整！","warn");
        return;
      }
      const val = dom.value as keyof domAnimateProp;
      this.setState(pre => {
        let arr = pre.domPropsArr;
        if (arr.includes(val)) {
          arr = arr.filter(key => key!== val);
        } else {
          arr = arr.concat([val]);
        }
       
        return {
          domPropsArr: arr,
        };
      }); 
    } else  {// 输入框
        const val = dom.value;
        this.setState(pre =>{
          return {
            animateObj:Object.assign({},pre.animateObj,{
                [name]:val,
            })
          };
        });
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
        this.setState(pre =>{
          const { domPropsArr, animateObj} = pre;
          const domObj:any = {}; 
            domPropsArr.forEach(k => {
              const val = animateObj[k as keyof States["animateObj"]];
              if (k === "transform") {
                domObj.transform = `translate(${animateObj["transformX"]}px, ${animateObj["transformY"]}px)`;
              } else {
                domObj[k] = val ;
              }
          }); 
          return {
            immuConfig: pre.immuConfig.set("animation", domObj),
          };
        });
    }
  }
  render() {
    const { preConfig, immuConfig, key, animation, domPropsArr, animateObj} = this.state;
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
          <div className="inp-item" id="propsBox">
            <CheckBox
              name="animation"
              value="domProps"
              type="radio"
              checked={animation === "domProps"}
              changeHandle={this.changeAnimation}
            >
              <span>属性名：</span>
              <Button handle={this.btnHandle} name="btn2" disabled={animation !== "domProps"}>
               设置
              </Button>
              <CheckBox
                name="domProps"
                value="width"
                type="checkbox"
                checked={domPropsArr.includes("width")}
                changeHandle={this.changeAnimation}
              >
                <Input
                  type="number"
                  changeFn={this.changeAnimation}
                  name="width"
                  value={animateObj["width"]}
                  width={100}
                  norequire={!domPropsArr.includes("width")}
                >
                  width:
                </Input>
              </CheckBox>
              <CheckBox
                name="domProps"
                value="height"
                type="checkbox"
                checked={domPropsArr.includes("height")}
                changeHandle={this.changeAnimation}
              >
                <Input
                  type="number"
                  changeFn={this.changeAnimation}
                  value={animateObj["height"]}
                  name="height"
                  norequire={!domPropsArr.includes("height")}
                  width={100}
                >
                  height:
                </Input>
              </CheckBox>
              <CheckBox
                name="domProps"
                value="transform"
                type="checkbox"
                checked={domPropsArr.includes("transform")}
                changeHandle={this.changeAnimation}
              >
                <Input
                  type="number"
                  changeFn={this.changeAnimation}
                  name="transformX"
                  value={animateObj["transformX"]}
                  norequire={!domPropsArr.includes("transform")}
                  width={100}
                >
                  transformX:
                </Input>
                <Input
                  type="number"
                  changeFn={this.changeAnimation}
                  name="transformY"
                  value={animateObj["transformY"]}
                  norequire={!domPropsArr.includes("transform")}
                  width={100}
                >
                  transformY:
                </Input>
              </CheckBox>
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
