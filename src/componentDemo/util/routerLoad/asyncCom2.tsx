
/**
 * @name SEkin
 * @description 异步组件
 * @time 2021-01-07
 */
import * as React from "react";

type Props={
  text?:string
};
type States={

};
class AsyncCom2 extends React.PureComponent<Props, States> {


  state:States={

  };
  render () {
    const {text} = this.props;

    return (
      <div className="async-com2 common">
                异步加载的组件B{text}
      </div>
    );
  }
}


export default AsyncCom2;
