/**
 * @name name
 * @description description
 * @time 2020-04-18
 */
import * as React from "react";
import Layout from "@component/layout/Layout";
import {createImmutableMap} from "@component/util/createImmutaleMap";
import {Input, CheckBox, Textarea} from "@component/input/index";
import {str1} from "./CodeStr";
import CodeBlock from "@container/codeBlock/CodeBlock";
import {IImmutalbeMap} from "@component/util/immutableUtil";
import "./index.scss";
type inputConfig = {
  dataSet:string;
  value:string;
  name:string;
  width:number;
  className: string;
  placeholder:string;
  norequire:boolean;
  disabled:boolean;
};
type Props={

};
type States={
  immuConfig:IImmutalbeMap<inputConfig>;
  ableMatch: boolean;
};
interface IDemo {
  changeFn(e:React.ChangeEvent<HTMLTextAreaElement>):void;
}
const inputConfig:inputConfig = {
  dataSet: "",
  value: "",
  placeholder: "提示",
  name: "",
  width: 0,
  norequire: false,
  disabled: false,
  className: "v-resize",
};
class Demo extends React.PureComponent<Props, States> implements IDemo {

  state:States={
    immuConfig: createImmutableMap(inputConfig),
    ableMatch: false,
  };
  changeFn=(e:React.ChangeEvent<HTMLTextAreaElement>) => {
    const dom = e.currentTarget!;
    const dataSet = dom.dataset;
    const name = dom.name;
    const value = dom.value;
    console.log(dataSet, name);
    this.setState((pre) => ({
      immuConfig: pre.immuConfig.set("value", value)
    }));
  }

  matchValFn=(value?:string) => !value || value.includes("验证")

  changeConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dom = e.currentTarget;
    const name = dom.name as keyof inputConfig;
    let value: string | number | boolean = dom.value;
    if (name === "width") {
      value = ~~value;
    } else if (name === "norequire" || name === "disabled") {
      value = value === "1";
    }
    this.setState((pre) => ({
      immuConfig: pre.immuConfig.set(name, value),
    }));
  }
  render () {
    const {immuConfig} = this.state;

    const {value, width, name, dataSet, norequire, disabled, placeholder, className} = immuConfig.toJS();

    return (
      <Layout tit="输入框">
        <div className="g-item-show">
          <div className="inp-item">
            <Textarea
              changeFn={this.changeFn}
              value={value}
              width={width}
              placeholder={placeholder}
              name={name}
              className={className}
              dataSet={dataSet}
              disabled={disabled}
              norequire={norequire}
            >
                  文本框：
            </Textarea>
          </div>
          <div className="flex-between">
            <div>
              <div className="inp-item">
                <Input
                  name="value"
                  norequire={norequire}
                  changeFn={this.changeConfig}
                  value={value}
                >
                      值 value：
                </Input>
              </div>
              <div className="inp-item">
                <Input
                  name="width"
                  norequire
                  changeFn={this.changeConfig}
                  value={`${width}`}
                >
                      宽度 width：
                </Input>
              </div>
              <div className="inp-item">
                <Input
                  disabled
                  value="相关事件的"
                >
                      change:changeFn | blur:blurFn
                </Input>
              </div>
              <div className="inp-item">
                <Input
                  disabled
                  width={280}
                  value="值验证的函数，返回true则变红"
                >
                      vlaue验证 matchValFn
                </Input>
              </div>

              <div className="inp-item">
                <span>禁用 disabled：</span>
                <CheckBox
                  name="disabled"
                  value="1"
                  type="radio"
                  checked={disabled}
                  changeHandle={this.changeConfig}
                >
                      是
                </CheckBox>
                <CheckBox
                  name="disabled"
                  value="2"
                  type="radio"
                  checked={!disabled}
                  changeHandle={this.changeConfig}
                >
                      否
                </CheckBox>
              </div>
            </div>
            <div>
              <div className="inp-item">
                <Input
                  name="placeholder"
                  norequire
                  changeFn={this.changeConfig}
                  value={placeholder}
                >
                    提示  placeholder:
                </Input>
              </div>
              <div className="inp-item">
                <Input
                  name="dataSet"
                  norequire
                  changeFn={this.changeConfig}
                  value={dataSet}
                >
                      dataSet：
                </Input>
              </div>
              <div className="inp-item">
                <Input
                  name="name"
                  norequire
                  changeFn={this.changeConfig}
                  value={name}
                >
                      名称 name：
                </Input>
              </div>
              <div className="inp-item">
                <Input
                  name="className"
                  norequire
                  changeFn={this.changeConfig}
                  value={className}
                >
                      类名 className：
                </Input>
              </div>
              <div className="inp-item">
                <span>不是必填 norequire：</span>
                <CheckBox
                  name="norequire"
                  value="1"
                  type="radio"
                  checked={norequire}
                  changeHandle={this.changeConfig}
                >
                      是
                </CheckBox>
                <CheckBox
                  name="norequire"
                  value="2"
                  type="radio"
                  checked={!norequire}
                  changeHandle={this.changeConfig}
                >
                      否
                </CheckBox>
              </div>
            </div>
          </div>
        </div>
        <div className="g-item-show">
          <CodeBlock tit="改变函数">{str1}</CodeBlock>
        </div>
      </Layout>
    );
  }
}


export default Demo;
