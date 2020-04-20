/**
 * @name name
 * @description description
 * @time 2020-04-18
 */
import * as React from "react";
import Layout from "@component/layout/Layout";
import {createImmutableMap} from "@component/util/createImmutaleMap";
import {Input,Search} from "@component/input/index";
import {str3} from "./CodeStr";
import CodeBlock from "@container/codeBlock/CodeBlock";

type config = {
   // searchHandle: (keyword: string,field:string) => void;
	//closeHandle?: (field?:string) => void;
	tip: string;
	width:number;
	field:string;
};
const config:config = {
	tip:"",
	width:0,
	field:"",
}

type Props={

};
type States={

    immuConfig:IImmutalbeMap<config>;
};
interface ISearchDemo {

    changeConfig(e: React.ChangeEvent<HTMLInputElement>):void;
}
class SearchDemo extends React.PureComponent<Props, States>
  implements ISearchDemo {
  state: States = {
    immuConfig: createImmutableMap(config),
  };
  changeConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dom = e.currentTarget;
    const name = dom.name as any;
    let value: any = dom.value;
    if (["width"].includes(name)) {
      value = ~~value;
    }
    this.setState((pre) => {
      return {
        immuConfig: pre.immuConfig.set(name, value),
      };
    });
  }
  searchHandle=(keyword:string,field:string)=>{
    console.log(keyword,field);
  }
  closeHandle=(field:string)=>{
    console.log(field);
    
  }
  render() {
    const {immuConfig} = this.state;
    const {tip,field,width} = immuConfig.toJS();

    return (
      <Layout tit="搜索框">
        <div className="g-item-show">
          <div className="inp-item">
            <span>搜索框：</span>
            <Search
             tip={tip}
             field={field}
             width={width}
             searchHandle={this.searchHandle}
             closeHandle={this.closeHandle}
            />
          </div>
          <div >
              <div className="inp-item">
                <Input value={field} name="field" changeFn={this.changeConfig} >
                  field :
                </Input>
              </div>
               <div className="inp-item">
                <Input value={tip} name="tip" changeFn={this.changeConfig}
                  norequire={true}
                >
                  tip：
                </Input>
              </div> 
              <div className="inp-item">
                <Input value={`${width}`} name="width" changeFn={this.changeConfig}
                  norequire={true}
                >
                  width：
                </Input>
              </div>
            </div>
        </div>
        <div className="g-item-show">
          <CodeBlock tit="搜索函数">{str3}</CodeBlock>
        </div>
      </Layout>
    );
  }
}


export default SearchDemo;