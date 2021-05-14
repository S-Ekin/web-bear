/**
 * @name 崩溃页面
 * @description description
 * @time 2019-11-22
 */
import * as React from "react";
import {Button} from "../button/index";

type Props={
  msg?:React.ReactNode; // 内容
  type?: "crash" | "noFind"; // 标题
  reloadFn:()=>void;
};
type States={

};

class CrashPage extends React.PureComponent<Props, States> {

  state:States={

  };
  render () {
    const {msg = "导致的原因可能是数据错误，导致页面损坏！请联系相关人员！", reloadFn, type = "crash"} = this.props;
    const tit = type === "crash" ? "页面已经崩溃！" : "抱歉，找不到该页面！";

    return (
      <div className="g-crash-page">
        <div className="crash-main">
          <div className="crash-bg"/>
          <div className="crash-descript">
            <div className={"crash-logo " + type}/>
            <h2>{tit}</h2>
            <div className="crash-txt">
              <div>{msg}</div>
            </div>
            <div>
              <Button handle={reloadFn}>重新加载</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default CrashPage;
