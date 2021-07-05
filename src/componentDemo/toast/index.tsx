/**
 * @name name
 * @description description
 * @time 2020-02-19
 */
import * as React from "react";
import { Button } from "@component/button/index";
import notice from "@component/toast/index";
import { CheckBox, Input } from "@component/input/index";
import { createImmutableMap } from "@component/util/createImmutaleMap";
import CodeBlock from "@container/codeBlock/CodeBlock";
import {IImmutalbeMap} from "@component/util/immutableUtil";
type config = {
  text: string;
  type: "error" | "success" | "warn";
  keep: boolean;
};
type Props = {
};
type States = {
  immuConfig: IImmutalbeMap<config>;
};
const configInit: config = {
  text: "提示",
  type: "error",
  keep: false,
};
interface IIndex {
  openToast():void;
}
const str1 = `
  // 在路由初始化的时候要初始化弹框的容器 wrap-notice
  // 保存notice 的实例，用实例上的方法来添加和减少 提示
<div className="g-main">
  <ErrorBoundary init={initRouter} bindGetHasError={this.bindGetHasError}>
    <Switch>
      <Route path="/button" component={loadable(routerConfig.buttonRouter)} />
      <Route path="/table" component={loadable(routerConfig.tableRouter)} />
      <Route path="/loading" component={loadable(routerConfig.loadingRouter)} />
      <Route path="/combo" component={loadable(routerConfig.comboRouter)} />
      <Route path="/blog" component={loadable(routerConfig.blog)} />
      <Route path="/alert" component={loadable(routerConfig.modal)} />
      <Route path="/menu" component={loadable(routerConfig.menu)} />
    </Switch>
  </ErrorBoundary>
  <div id="inner-modal-wrap"/>
  <div id="wrap-loading" />
  <div id="wrap-notice" />
</div>
`;
class Demo extends React.PureComponent<Props, States> implements IIndex {
  state: States = {
    immuConfig: createImmutableMap(configInit),
  };

  openToast = () => {
    const { immuConfig } = this.state;
    const { type, text, keep} = immuConfig.toJS();
    notice.add(text, type, keep);
  }
  changeConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dom = e.currentTarget;
    const name = dom.name as keyof config;
    let value: string | boolean = dom.value;
    if (name === "keep") {
      value = value === "1";
    }
    this.setState((pre) => ({
      immuConfig: pre.immuConfig.set(name, value),
    }));
  }
  render () {
    const { immuConfig } = this.state;
    const type = immuConfig.get("type");
    const keep = immuConfig.get('keep');
    return (
      <div className="g-layout ">
        <div className="g-layout-head">
          <h3>toast</h3>
        </div>
        <div className="g-layout-article">
          <div className="g-item-show">
            <div className="btn-box flex-between">
              <Button handle={this.openToast}>打开提示</Button>
            </div>

            <div>
              <div className="inp-item">
                <Input
                  changeFn={this.changeConfig}
                  name="text"
                  width={400}
                  value={immuConfig.get("text")}
                >
                  提示内容 text:
                </Input>
              </div>
              <div className="inp-item">
                <span>提示类型 type：</span>
                <CheckBox
                  name="type"
                  value="error"
                  type="radio"
                  checked={type === "error"}
                  changeHandle={this.changeConfig}
                >
                  error
                </CheckBox>
                <CheckBox
                  name="type"
                  value="warn"
                  type="radio"
                  checked={type === "warn"}
                  changeHandle={this.changeConfig}
                >
                  warn
                </CheckBox>
                <CheckBox
                  name="type"
                  value="success"
                  type="radio"
                  checked={type === "success"}
                  changeHandle={this.changeConfig}
                >
                  success
                </CheckBox>
              </div>
              <div className="inp-item">
                <span>自动关闭 keep:</span>
                <CheckBox
                  name="keep"
                  value="1"
                  type="radio"
                  checked={keep}
                  changeHandle={this.changeConfig}
                >
                  否
                </CheckBox>
                <CheckBox
                  name="keep"
                  value="2"
                  type="radio"
                  checked={!keep}
                  changeHandle={this.changeConfig}
                >
                  是
                </CheckBox>
              </div>
            </div>
          </div>
          <div className="g-item-show">
            <CodeBlock tit="toast容器说明" language="html">
              {str1}
            </CodeBlock>
          </div>
        </div>
      </div>
    );
  }
}

export default Demo;
