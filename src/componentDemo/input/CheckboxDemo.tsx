/**
 * @name name
 * @description description
 * @time 2020-04-18
 */
import * as React from "react";
import Layout from "@component/layout/Layout";
import {createImmutableMap} from "@component/util/createImmutaleMap";
import {Input,CheckBox} from "@component/input/index";
import {str2} from "./CodeStr";
import CodeBlock from "@container/codeBlock/CodeBlock";

type config = {
	checked: boolean;
	value: string;
	name: string;
	hasChecked: boolean;
	type: "checkbox" | "radio";
	disabled:boolean;
};
type Props={

};
type States={

    immuConfig:IImmutalbeMap<config>;
};
interface ICheckboxDemo {
    changeConfig(e: React.ChangeEvent<HTMLInputElement>):void;
}
const config:config = {
	checked: false,
	value: "",
	name: "",
	hasChecked: false,
	type: "checkbox",
	disabled:false,
};
class CheckboxDemo extends React.PureComponent<Props,States> implements ICheckboxDemo{


    state:States={
    immuConfig:createImmutableMap(config)
    };
    changeConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
        const dom = e.currentTarget;
        const name = dom.name as any;
        let value: any = dom.value;
        if(["disabled","hasChecked",].includes(name)){
            value = value === "1";
        }
        this.setState((pre) => {
        return {
            immuConfig: pre.immuConfig.set(name, value),
        };
        });
    }
    changeFn=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const dom = e.currentTarget!;
        const name = dom.name;
        const value = dom.value;
        console.log(name,value);
        this.setState(pre=>{
            return {
                immuConfig:pre.immuConfig.set("checked",dom.checked)
            };
        });
    }
    render(){
        const {immuConfig} = this.state;
        const {checked,name,type,disabled,value,hasChecked} = immuConfig.toJS();

        return (
          <Layout tit="复选框">
            <div className="g-item-show">
              <div className="inp-item">
                <span>复选框：</span>
                <CheckBox
                  changeHandle={this.changeFn}
                  checked={checked}
                  hasChecked={hasChecked}
                  value={value}
                  name={name}
                  type={type}
                  disabled={disabled}
                >
                  复选框
                </CheckBox>
              </div>
              <div className="flex-between">
                <div>
                  <div className="inp-item">
                    <Input
                      value={name}
                      name="name"
                  norequire={true}
                      changeFn={this.changeConfig}
                    >
                      name :
                    </Input>
                  </div>
                  <div className="inp-item">
                    <span>禁用 disabled：</span>
                    <CheckBox
                      name="disabled"
                      value="1"
                      checked={disabled}
                      changeHandle={this.changeConfig}
                    >
                      是
                    </CheckBox>
                    <CheckBox
                      name="disabled"
                      value="2"
                      checked={!disabled}
                      changeHandle={this.changeConfig}
                    >
                      否
                    </CheckBox>
                  </div>
                  <div className="inp-item">
                    <span>多选时 子节点有选中的时 hasChecked ：</span>
                    <CheckBox
                      name="hasChecked"
                      value="1"
                      checked={hasChecked}
                      changeHandle={this.changeConfig}
                    >
                      有
                    </CheckBox>
                    <CheckBox
                      name="hasChecked"
                      value="2"
                      checked={!hasChecked}
                      changeHandle={this.changeConfig}
                    >
                      无
                    </CheckBox>
                  </div>
                </div>
                <div>
                  <div className="inp-item">
                    <Input
                      value={value}
                      name="value"
                  norequire={true}
                      changeFn={this.changeConfig}
                    >
                      value：
                    </Input>
                  </div>
                  <div className="inp-item">
                    <span>type ：</span>
                    <CheckBox
                      name="type"
                      value="radio"
                      type="radio"
                      checked={type === "radio"}
                      changeHandle={this.changeConfig}
                    >
                      单选
                    </CheckBox>
                    <CheckBox
                      name="type"
                      value="checkbox"
                      checked={type === "checkbox"}
                      changeHandle={this.changeConfig}
                    >
                      多选
                    </CheckBox>
                  </div>
                </div>
              </div>
            </div>
            <div className="g-item-show">
              <CodeBlock tit="改变函数">{str2}</CodeBlock>
            </div>
          </Layout>
        );
    }
}


export default CheckboxDemo;