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
import { CheckBox, Input } from "@component/input/index";
import CodeBlock from "@container/codeBlock/CodeBlock";
import {str1 } from "./CodeStr";
import { SlideBox } from "@component/animate/index";
import {IImmutalbeMap} from "@component/util/immutableUtil";
type Props = {

};
type config = {
  isImmedia: boolean; // 连续点击时，立马结束上一次动画
  slide: boolean;
  directionUp: boolean; // 下拉框在显示框上还是下
  className:string;
  duration: number; // 下拉时间
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
  duration: 300,
  className: "",
};

class Demo extends React.PureComponent<Props, States> implements IDemo {
  state: States = {
    immuConfig: createImmutableMap(config),
    preConfig: createImmutableMap(config),
    key: 1
  };

  changeConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dom = e.currentTarget;
    const name = dom.name as keyof config;
    let value = ["className", "duration"].includes(name) ? dom.value.trim() :  dom.value === "1";

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
      this.setState((pre) => ({
        preConfig: pre.preConfig.set("slide", !pre.preConfig.get("slide")),
      }));
    }
  }

  getList () {

    return new Array(15).fill("")
      .map((_val, index) => (
        <div className="item" key={index}>
          {index + 1}
        </div>
      ));
  }

  render () {
    const { preConfig, immuConfig, key } = this.state;
    const {
      isImmedia, slide, directionUp, className, duration
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
              <div className="inp-item">
                <span>下拉回调函数 slideFnCallback：</span>
                <span>
                      slideFnCallback?:(isStart?:boolean)boolean|void;
                  <br/>
                     （收缩开始和结束的回调函数。 返回 true 禁止下拉）
                </span>
              </div>
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
                  type="text"
                  changeFn={this.changeConfig}
                  name="duration"
                  norequire
                  value={String(duration)}
                >
                  动画时间 duration:
                </Input>
              </div>
              <div className="inp-item">
                样式  styleObj: 【行内样式】
              </div>
            </div>
          </div>

        </div>
        <div className="g-item-show" style={{paddingBottom: 30, }}>
          <small>故意让 .slide-box元素使用margin并且与.g-item-show直接接触(下边重合)，下拉容器高度为0时，也就是slide-box高度为0, .slide-box 的margin 与 .g-item-show的padding重合, 使其padding消失了-谁小谁消失，导致有一个跳动（动画时间3000会更明显）</small>
          <div className="slide-test">下拉面板</div>
          <div className="slide-box">
            <SlideBox
              isImmedia={preConfig.get("isImmedia")}
              slide={preConfig.get("slide")}
              key={key}
              duration={preConfig.get("duration")}
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
