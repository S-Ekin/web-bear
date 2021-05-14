import * as React from "react";
import CrashPage from './CrashPage';
import notice from '../toast/index';
type props={
  msg?:string; // 内容
  type?:"crash" | "noFind"; // 标题
  init:{init:boolean};
  bindGetHasError?:(getHasErrorFn:()=>boolean)=>void;
};
type states = {
  hasError:boolean;
  preInit:{init:boolean};
};
export default class ErrorBoundary extends React.Component<props, states> {
  static  getDerivedStateFromProps (nextProps:props, preState:states):Partial<states> | null {
    const newInit = nextProps.init;
    if (newInit !== preState.preInit) {
      return {
        hasError: newInit.init,
        preInit: nextProps.init
      };
    } else {
      return null;
    }
  }
  static getDerivedStateFromError () {
    return {hasError: true};
  }

  state:states = {
    hasError: false,
    preInit: this.props.init
  };
  constructor (prop:props) {
    super(prop);
    const {bindGetHasError} = prop;
    if (bindGetHasError) {
      bindGetHasError(this.getHasError);
    }
  }
  getHasError=() => this.state.hasError
  reload=() => {
    this.setState(() => ({
      hasError: false
    }), () => {
      notice.clear();
    });
  }
  componentDidCatch () {
    notice.add("数据操作出错，点击按钮重新加载页面！", "warn", true);
  }
  render () {

    const {type, msg }  = this.props;

    if (this.state.hasError) {
      return <CrashPage reloadFn={this.reload} type={type} msg={msg} />;
    } else {
      return this.props.children;
    }
  }
}
