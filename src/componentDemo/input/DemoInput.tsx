/**
 * @name name
 * @description description
 * @time 2020-04-18
 */
import * as React from "react";
import Layout from "@component/layout/Layout";
import {createImmutableMap} from "@component/util/createImmutaleMap";
import {Input, CheckBox} from "@component/input/index";
import {str1, str4} from "./CodeStr";
import CodeBlock from "@container/codeBlock/CodeBlock";
import {IImmutalbeMap} from "@component/util/immutableUtil";
type inputConfig = {
  dataSet:string;
  value:string;
  name:string;
  type:"text"|"number";
  width:number;
  placeholder:string;
  styleName:"normal" ;
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
  changeFn(e:React.ChangeEvent<HTMLInputElement>):void;
}
const inputConfig:inputConfig = {
  dataSet: "",
  value: "",
  placeholder: "提示",
  name: "",
  type: "text",
  width: 0,
  norequire: false,
  styleName: "normal",
  disabled: false
};
class Demo extends React.PureComponent<Props, States> implements IDemo {


  state:States={
    immuConfig: createImmutableMap(inputConfig),
    ableMatch: false,
  };
  changeFn=(e:React.ChangeEvent<HTMLInputElement>) => {
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
    let value: string | number |boolean = dom.value;
    if (name === "width") {
      value = ~~value;
    } else if (name === "norequire" || name === "disabled") {
      value = value === "1";
    }
    this.setState((pre) => ({
      immuConfig: pre.immuConfig.set(name, value),
    }));
  }
  getMatchTit () {
    const {ableMatch} = this.state;
    const fn = (e:React.ChangeEvent<HTMLInputElement>) => {
      const dom = e.currentTarget;
      const value = dom.value;
      this.setState({
        ableMatch: value === "1"
      });
    };
    return (<div className="inp-item">
      <span>开启验证 matchValFn：(有验证函数就不会去匹配norequire)</span>
      <CheckBox
        name="ableMatch"
        value="1"
        type="radio"
        checked={ableMatch}
        changeHandle={fn}
      >
                      是
      </CheckBox>
      <CheckBox
        name="ableMatch"
        value="2"
        type="radio"
        checked={!ableMatch}
        changeHandle={fn}
      >
                      否
      </CheckBox>
    </div>);
  }
  render () {
    const {immuConfig, ableMatch} = this.state;

    const {value, width, name, dataSet, type, styleName, norequire, disabled, placeholder} = immuConfig.toJS();

    return (
      <Layout tit="输入框">
        <div className="g-item-show">
          <div className="inp-item">
            <Input
              changeFn={this.changeFn}
              value={value}
              width={width}
              placeholder={placeholder}
              name={name}
              matchValFn={ableMatch ? this.matchValFn : undefined}
              dataSet={dataSet}
              type={type}
              disabled={disabled}
              norequire={norequire}
              styleName={styleName}
            >
                  输入框：
            </Input>
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
                <span>类型 type：</span>
                <CheckBox
                  name="type"
                  value="text"
                  type="radio"
                  checked={type === "text"}
                  changeHandle={this.changeConfig}
                >
                      text：
                </CheckBox>
                <CheckBox
                  name="type"
                  value="number"
                  type="radio"
                  checked={type === "number"}
                  changeHandle={this.changeConfig}
                >
                      number：
                </CheckBox>
              </div>
              <div className="inp-item">
                <span>样式 styleName：</span>
                <CheckBox
                  name="styleName"
                  value="normal"
                  type="radio"
                  checked={styleName === "normal"}
                  changeHandle={this.changeConfig}
                >
                      normal：
                </CheckBox>
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
        <div className="g-item-show">
          <CodeBlock tit={this.getMatchTit()} >{str4}</CodeBlock>
        </div>
      </Layout>
    );
  }
}


export default Demo;
