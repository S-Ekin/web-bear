import * as React from "react";
import {createPortal} from "react-dom";

type LoadingProp = {
  container:HTMLElement;
  shade?:boolean;// 是否有蒙层
};

type LoadingState = {

};

class Loading extends React.PureComponent<LoadingProp, LoadingState> {

  // tslint:disable-next-line: variable-name
  static LoadingCom:React.SFC<{shade?:boolean}>=({shade}) => {
    const shadeName = shade ? "g-shade" : "";
    return (
      <div className={` g-loading ${shadeName}`}>
        <div className="m-loading">
          <b className="loading-text">loading...</b>
        </div>
      </div>
    );
  }
  render () {
    const {container, shade} = this.props;
    return  createPortal(<Loading.LoadingCom  shade={shade}/>, container);
  }
}

export default Loading;
