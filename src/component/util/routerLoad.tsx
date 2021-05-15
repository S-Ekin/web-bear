/**
 * @author: SEKin
 * @Date: 2021-01-06 10:34:25
 * @description:  动态路由加载
 * @Last Modified time: 2021-01-06 10:34:25
 */

import * as React from "react";
import LoadCom from "../loading/Loading";
type IMyLoadeRouteCom<p> = React.ComponentType<p>;
type IloadObj<p> = {
  loading?:()=>React.ReactNode;
  loader(): Promise<{ default: IMyLoadeRouteCom<p>} | IMyLoadeRouteCom<p>>;
};
type Props<p> = {
  loadObj:IloadObj<p>;
  children:(com:React.ComponentType<p>)=>React.ReactNode;
};
type States<p> = {
  Com:React.ComponentType<p> | undefined;
  preLoadObj:Props<p>["loadObj"];
};

class RouterLoad<P> extends React.PureComponent<Props<P>, States<P>> {
  state:States<P>={
    Com: undefined,
    preLoadObj: this.props.loadObj
  };
  componentDidMount () {
    const { loadObj } = this.props;
    loadObj.loader().then((com) => {
      this.setState({
        Com: typeof com === "object" ? com.default : com,
      });
    });
  }

  getLoad () {
    const { loadObj: {loading} } = this.props;
    return loading ? loading() : <LoadCom.LoadingCom />;
  }
  componentDidUpdate () {
    const { loadObj } = this.props;
    if (this.state.preLoadObj !== loadObj) {
      loadObj.loader().then((com) => {
        this.setState({
          Com: typeof com === "object" ? com.default : com,
          preLoadObj: loadObj,
        });
      });
    }
  }
  render () {
    const { Com } = this.state;
    const {children} = this.props;
    return !Com ? this.getLoad() : children(Com);
  }
}


const loadable = function<e> (loadObj:IloadObj<e>) {
  // todo: 有点搞不清楚 RouterLoad 明明要传类型参数，这里没有传，而且也不是自动取的 loadObj的类型参数，因为鼠标放上去显示的是 定义类时的那个类型参数名称。
  const MyLoadRoute:React.FunctionComponent<e> = (route) => (
    <RouterLoad loadObj={loadObj} >
      {(Com:React.ComponentType<e>) => <Com  {...route} >{route.children}</Com>}
    </RouterLoad>
  );

  return MyLoadRoute;
};

export default loadable;
