/**
 * @name 页面崩溃处理
 * @description description
 * @time 2020-02-20
 */
import * as React from "react";
import {Button} from '@component/button/index';
import CodeBlock from "@container/codeBlock/CodeBlock";
import Layout from "@component/layout/Layout";
import {str1, str2} from "./CodeStr";
import ErrorBoundary from "@component/crashPage/ErrorBoundary";
import { CheckBox, Input } from "@component/input";
type Props={

};
type States={
  error:boolean;
  init:{init:boolean}
  type: "crash"|"noFind";
  msg:string;
};
interface IDemo {
  createCrash():void;
}

class Demo extends React.PureComponent<Props, States> implements IDemo {

  getHasErrorFn:(()=>boolean) | undefined;
  bindGetHasError=(getHasErrorFn:(()=>boolean)) => {
    this.getHasErrorFn = getHasErrorFn;
  }
  state:States={
    error: false,
    init: {init: false},
    type: "crash",
    msg: "导致的原因可能是数据错误，导致页面损坏！请联系相关人员！",
  };
  createCrash=() => {
    // throw new Error();
    this.setState({
      error: true
    });
  }
  changeConfig=() => {
    this.setState(() => ({
      init: {init: true}
    }));
  }
  changeInit=(e:React.ChangeEvent<HTMLInputElement>) => {
    const dom = e.currentTarget!;
    const value = dom.value;

    this.setState(() => ({
      init: {init: value === "1"}
    }));
  }
  changeInp = (e:React.ChangeEvent<HTMLInputElement>) => {
    const dom = e.currentTarget;
    const value = dom.value.trim();
    const name = dom.name;
    this.setState({
      [name as "msg"]: value,
    });
  }
  getHasErrorBtnHandl=() => {
    const hasError = this.getHasErrorFn!();
    alert(`hasError：${hasError ? "true" : "false"}`);
  }
  getCodeBlockTit () {
    return (
      <div>
        <Button handle={this.getHasErrorBtnHandl}>
                获取错误捕获组件状态
        </Button>
        <b style={{paddingLeft: 10, }}>
                    通过 bindGetHasError
        </b>
      </div>
    );
  }
  render () {
    const {error, init, type, msg} = this.state;
    if (error) {
      throw new Error('故意错误！'); // 显性抛出错误
      // return 隐形抛出错误
    } else {
      return (
        <Layout  tit="错误捕获">
          <div className="g-item-show">
            <ErrorBoundary
              init={init}
              type={type}
              msg={msg}
              bindGetHasError={this.bindGetHasError}
            >
              <div>
              </div>
              <div className="inp-item">
                <Button styleType="line-btn" colorType="danger" handle={this.changeConfig}>抛出当前错误捕获组件的错误</Button>
              </div>
              <div className="inp-item">
                <span>
                                初始化的状态： hasError:
                </span>
                <CheckBox
                  changeHandle={this.changeInit}
                  name="hasError"
                  value="1"
                  checked={init.init}
                >
                               有
                </CheckBox>
                <CheckBox
                  changeHandle={this.changeInit}
                  name="hasError"
                  value="2"
                  checked={!init.init}
                >
                                无
                </CheckBox>
              </div>
              <div className="inp-item">
                <span>
                                提示类型 type：
                </span>
                <CheckBox
                  changeHandle={this.changeInp}
                  name="type"
                  value="crash"
                  checked={type === "crash"}
                >
                               崩溃
                </CheckBox>
                <CheckBox
                  changeHandle={this.changeInp}
                  name="type"
                  value="noFind"
                  checked={type === "noFind"}
                >
                                404
                </CheckBox>
              </div>
              <div className="inp-item">
                <Input value={msg} norequire name="msg" changeFn={this.changeInp}>
                            提示内容 tit：
                </Input>
              </div>
            </ErrorBoundary>
          </div>
          <div className="g-item-show">
            <CodeBlock tit="注意事项">
              {str1}
            </CodeBlock>
          </div>
          <div className="g-item-show">
            <CodeBlock tit={this.getCodeBlockTit()}>
              {str2}
            </CodeBlock>
          </div>
          <div className="g-item-show">
            <Button handle={this.createCrash} >抛出整个路由页面的错误</Button>
          </div>
        </Layout>
      );
    }

  }
}


export default Demo;
