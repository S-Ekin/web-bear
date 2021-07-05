/**
 * @name name
 * @description description
 * @time 2020-04-18
 */
import * as React from "react";
import Layout from "@component/layout/Layout";
import {createImmutableMap} from "@component/util/createImmutaleMap";
import {Input, Search} from "@component/input/index";
import {str3} from "./CodeStr";
import CodeBlock from "@container/codeBlock/CodeBlock";
import {IImmutalbeMap} from "@component/util/immutableUtil";

type config = {
  // searchHandle: (keyword: string,field:string) => void;
  // closeHandle?: (field?:string) => void;
  tip: string;
  width:number;
  field:string;
  tit: string;
};
const config:config = {
  tip: "",
  width: 0,
  field: "",
  tit: "",
};

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
    const name = dom.name as keyof config;
    let value: string | number = dom.value;
    if (["width"].includes(name)) {
      value = ~~value;
    }
    this.setState((pre) => ({
      immuConfig: pre.immuConfig.set(name, value),
    }));
  }
  searchHandle=(keyword:string, field:string) => {
    console.log(keyword, field);
  }
  closeHandle=(field:string) => {
    console.log(field);

  }
  render () {
    const {immuConfig} = this.state;
    const {tip, field, width, tit} = immuConfig.toJS();

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
            >
              {tit}
            </Search>
          </div>
          <div >
            <div className="inp-item">
              <Input value={field} name="field" changeFn={this.changeConfig} >
                  字段 field :
              </Input>
            </div>
            <div className="inp-item">
              <Input value={tip} name="tip" changeFn={this.changeConfig}
                norequire
              >
                 提示语 tip：
              </Input>
            </div>
            <div className="inp-item">
              <Input value={`${width}`} name="width" changeFn={this.changeConfig}
                norequire
              >
                宽度  width：
              </Input>
            </div>
            <div className="inp-item">
              <Input value={`${tit}`} name="tit" changeFn={this.changeConfig}
                norequire
              >
                 搜索按钮 tit：
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
