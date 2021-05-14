/**
 * @name  布局的组件
 * @description description
 * @time 2020-04-14
 */
import * as React from "react";
import Layout from "@component/layout/Layout";
import CodeBlock from "@container/codeBlock/CodeBlock";
import {createImmutableMap} from "@component/util/createImmutaleMap";
import { Input} from "@component/input/index";
import {str1, str2, str3} from "./CodeStr";
type Props={
};
type States={
  immuConfig:IImmutalbeMap<config>;
};
type config = {
  tit: string;
  className:string;
};
const config:config = {
  tit: "头部",
  className: "",
};
class Demo extends React.PureComponent<Props, States> {


  state:States={
    immuConfig: createImmutableMap(config)
  };
  changeConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dom = e.currentTarget;
    const name = dom.name as keyof config;
    let value = dom.value;
    this.setState((pre) => ({
      immuConfig: pre.immuConfig.set(name, value),
    }));
  }
  render () {
    const {immuConfig} = this.state;
    const {tit, className} = immuConfig.toJS();
    return (
      <Layout
        tit={tit}
        className={className}
      >
        <div className="g-item-show">
          <div className="inp-item">
            <Input
              value={tit}
              name="tit"
              changeFn={this.changeConfig}
            >
                  头部名称 tit:
            </Input>
          </div>
          <div className="inp-item">
            <Input
              value={className}
              name="className"
              norequire
              changeFn={this.changeConfig}
            >
                  容器类名 className:
            </Input>
          </div>
        </div>

        <div className="g-item-show">
          <CodeBlock  tit="布局的html结构">
            {str1}
          </CodeBlock>
        </div>
        <div className="g-item-show">
          <CodeBlock  tit="整个页面结构" language="html">
            {str3}
          </CodeBlock>
        </div>
        <div className="g-item-show">
          <CodeBlock  tit="布局的一些奇怪地方" language="scss">
            {str2}
          </CodeBlock>
        </div>
      </Layout>
    );
  }
}


export default Demo;
