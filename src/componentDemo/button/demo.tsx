/**
 * @name name
 * @description description
 * @time 2019-09-18
 */
import * as React from "react";
import { Button, GroupBtn } from "@component/button/index";
import Layout from "@component/layout/Layout";
import {createImmutableMap} from "@component/util/createImmutaleMap";
import { Input, CheckBox } from "@component/input/index";
import CodeBlock from "@container/codeBlock/CodeBlock";
import {str1,str2,str3,list,str4} from "./CodeStr";
type Props = {};
type btnConfig = {
	styleType: "normal-btn" | "dashed-btn" | "line-btn";//边框样式
    colorType: "danger" | "primary" | "green" | "yellow"; //颜色
    className:string;//button className
	name: string;//button 里的name
	val: string;//button 里的value
	dataSet: string;//button data-field 
	noAnimate: boolean;
	disabled:boolean;
};

type group = {
	icon:string;
	id:string;
	text:string;
	itemIcon?:string;
};
type States = {
	btnImmuConfig:IImmutalbeMap<btnConfig>;
	groupImmuConfig:IImmutalbeMap<group>;
};
interface IDemo {
	changeConfig(e: React.ChangeEvent<HTMLInputElement>):void;
}

const btnConfig:btnConfig = {
	styleType: "normal-btn" ,
    colorType: "primary" ,
    className:"",
	name: "",
	val: "",
	dataSet: "",
	noAnimate: false,
	disabled:false,
};
const groupConfig:group = {
	icon:"",
	id:"id",
	text:"text",
	itemIcon:"",
};

class Demo extends React.PureComponent<Props, States> implements IDemo {
  state: States = {
    btnImmuConfig: createImmutableMap(btnConfig),
    groupImmuConfig: createImmutableMap(groupConfig),
  };

  groupFn = (field: string) => {
    console.log(field);
  }
  changeConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dom = e.currentTarget;
    const name = dom.name as any;
    let value: any = dom.value;

    if (["disabled", "noAnimate"].includes(name)) {
      value = value === "1" ? true : false;
    }

    this.setState((pre) => {
      return {
        btnImmuConfig: pre.btnImmuConfig.set(name, value),
      };
    });
  }
  changeGroupConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dom = e.currentTarget;
    const name = dom.name as any;
    let value: any = dom.value;

    this.setState((pre) => {
      return {
        groupImmuConfig: pre.groupImmuConfig.set(name, value),
      };
    });
  }
  btnHandle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const dom = e.currentTarget;
    const val = dom.value;
    const dataSet = dom.dataset;
    const className = [...dom.classList.values()];
    const name = dom.name;
    console.log(val, dataSet, className, name);
  }
  render() {
    const { btnImmuConfig,groupImmuConfig } = this.state;
    const {
      colorType,
      className,
      styleType,
      name,
      dataSet,
      disabled,
      noAnimate,
      val,
	} = btnImmuConfig.toJS();
	const {icon} = groupImmuConfig.toJS();
    return (
      <Layout tit="按钮">
        <div className="g-item-show ">
          <div>
            <Button
              styleType={styleType}
              name={name}
              className={className}
              colorType={colorType}
              val={val}
              disabled={disabled}
              noAnimate={noAnimate}
              dataSet={dataSet}
              handle={this.btnHandle}
            >
              按钮
            </Button>
          </div>
          <div className="flex-between">
            <div>
              <div className="inp-item">
                <span>颜色 colorType：</span>
                <CheckBox
                  name="colorType"
                  value="danger"
                  type="radio"
                  checked={colorType === "danger"}
                  changeHandle={this.changeConfig}
                >
                  danger
                </CheckBox>
                <CheckBox
                  name="colorType"
                  value="green"
                  type="radio"
                  checked={colorType === "green"}
                  changeHandle={this.changeConfig}
                >
                  green
                </CheckBox>
                <CheckBox
                  name="colorType"
                  value="primary"
                  type="radio"
                  checked={colorType === "primary"}
                  changeHandle={this.changeConfig}
                >
                  primary
                </CheckBox>
                <CheckBox
                  name="colorType"
                  value="yellow"
                  type="radio"
                  checked={colorType === "yellow"}
                  changeHandle={this.changeConfig}
                >
                  yellow
                </CheckBox>
              </div>
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
                  type="text"
                  norequire={true}
                  changeFn={this.changeConfig}
                  name="name"
                  value={name}
                >
                  按钮 name:
                </Input>
              </div>
              <div className="inp-item">
                <Input
                  type="text"
                  norequire={true}
                  changeFn={this.changeConfig}
                  name="val"
                  value={val}
                >
                  按钮 val:
                </Input>
              </div>
            </div>
            <div>
              <div className="inp-item">
                <span>样式 styleType：</span>
                <CheckBox
                  name="styleType"
                  value="normal-btn"
                  type="radio"
                  checked={styleType === "normal-btn"}
                  changeHandle={this.changeConfig}
                >
                  normal-btn
                </CheckBox>
                <CheckBox
                  name="styleType"
                  value="line-btn"
                  type="radio"
                  checked={styleType === "line-btn"}
                  changeHandle={this.changeConfig}
                >
                  line-btn
                </CheckBox>
                <CheckBox
                  name="styleType"
                  value="dashed-btn"
                  type="radio"
                  checked={styleType === "dashed-btn"}
                  changeHandle={this.changeConfig}
                >
                  dashed-btn
                </CheckBox>
              </div>

              <div className="inp-item">
                <Input
                  type="text"
                  changeFn={this.changeConfig}
                  name="dataSet"
                  norequire={true}
                  value={dataSet}
                >
                  按钮 dataSet:
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
              <div className="inp-item">
                <span>无点击动画 noAnimate：</span>
                <CheckBox
                  name="noAnimate"
                  value="1"
                  type="radio"
                  checked={noAnimate}
                  changeHandle={this.changeConfig}
                >
                  是
                </CheckBox>
                <CheckBox
                  name="noAnimate"
                  value="2"
                  type="radio"
                  checked={!noAnimate}
                  changeHandle={this.changeConfig}
                >
                  否
                </CheckBox>
              </div>
            </div>
          </div>
        </div>
        <div className="g-item-show">
          <CodeBlock tit="按钮的点击事件：handle">{str1}</CodeBlock>
        </div>
        <div className="g-item-show">
          <div>
            <div className="flex-between">
              <GroupBtn list={list} clickFn={this.groupFn} icon={icon}>
                下拉按钮
              </GroupBtn>
              <GroupBtn list={list} clickFn={this.groupFn} icon={icon}>
                下拉按钮
              </GroupBtn>
              <Button>test</Button>
            </div>
            <div>
              <div className="inp-item">
                <Input
                  type="text"
                  changeFn={this.changeGroupConfig}
                  name="icon"
                  norequire={true}
                  value={icon}
                >
                  父级图标 icon:
                </Input>
              </div>
            </div>
          </div>
        </div>
        <div className="g-item-show">
          <CodeBlock tit="按钮组的点击事件：clickFn">{str2}</CodeBlock>
        </div>
        <div className="g-item-show">
          <CodeBlock tit="按钮组的数据：list">{str3}</CodeBlock>
        </div>
         <div className="g-item-show">
          <CodeBlock tit="按钮组的关键css" language="css">{str4}</CodeBlock>
        </div>
      </Layout>
    );
  }
}

export default Demo;