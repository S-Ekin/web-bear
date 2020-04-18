/**
 * @name name
 * @description description
 * @time 2020-04-18
 */
import * as React from "react";
import Layout from "@component/layout/Layout";
import {createImmutableMap} from "@component/util/createImmutaleMap";
import {Input,CheckBox} from "@component/input/index";
import {str1} from "./CodeStr";
import CodeBlock from "@container/codeBlock/CodeBlock";
type inputConfig = {
    dataSet:string;
    value:string;
    name:string;
    type:"text"|"number";
    width:number;
    styleName:"normal" ;
};
type Props={

};
type States={
    immuConfig:IImmutalbeMap<inputConfig>;
};
interface IDemo {
    changeFn(e:React.ChangeEvent<HTMLInputElement>):void;
}
const inputConfig:inputConfig = {
    dataSet:"",
    value:"",
    name:"",
    type:"text",
    width:0,
    styleName:"normal",
};
class Demo extends React.PureComponent<Props,States> implements IDemo{


    state:States={
        immuConfig:createImmutableMap(inputConfig)
    };
    changeFn=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const dom = e.currentTarget!;
        const dataSet = dom.dataset;
        const name = dom.name;
        const value = dom.value;
        console.log(dataSet,name);
        this.setState(pre=>{
            return {
                immuConfig:pre.immuConfig.set("value",value)
            };
        });
    }
    
    changeConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
        const dom = e.currentTarget;
        const name = dom.name as any;
        let value: any = dom.value;
        if(name === "width"){

            value = ~~value;

        }
        this.setState((pre) => {
        return {
            immuConfig: pre.immuConfig.set(name, value),
        };
        });
    }
    render(){
        const {immuConfig} = this.state;

        const {value,width,name,dataSet,type,styleName} = immuConfig.toJS();

        return (
          <Layout tit="输入框">
            <div className="g-item-show">
              <div className="inp-item">
                <Input 
                    changeFn={this.changeFn} 
                    value={value}
                    width={width}
                    name={name}
                    dataSet={dataSet}
                    type={type}
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
                      changeFn={this.changeConfig}
                      value={value}
                    >
                      值 value：
                    </Input>
                  </div>
                  <div className="inp-item">
                    <Input
                      name="width"
                      changeFn={this.changeConfig}
                      value={`${width}`}
                    >
                      宽度 width：
                    </Input>
                  </div>
                  <div className="inp-item">
                    <Input
                      name="name"
                      changeFn={this.changeConfig}
                      value={name}
                    >
                      名称 name：
                    </Input>
                  </div>
                </div>
                <div>
                  <div className="inp-item">
                    <Input
                      name="dataSet"
                      changeFn={this.changeConfig}
                      value={dataSet}
                    >
                      dataSet：
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
                </div>
              </div>
            </div>
            <div className="g-item-show">
                <CodeBlock tit="改变函数">
                    {str1}
                </CodeBlock>
            </div>
          </Layout>
        );
    }
}


export default Demo;