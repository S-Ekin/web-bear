import * as ReactDom from "react-dom";
import * as React from "react";

type props = {

};
type states = {
  show: boolean;
  hasShade:boolean;
};
class Loading extends React.PureComponent<props, states> {
  state: states = {
    show: true,
    hasShade: false
  };
  toggle = (show:boolean, hasShade?:boolean) => {
    this.setState({
      show: show,
      hasShade: !!hasShade
    });
  }

  render () {
    const { show, hasShade } = this.state;
    const shadeName = hasShade  ? "g-shade" : "";
    return (
      <div className={`g-loading ${shadeName} ${!show ? "hide-loading" : ""}`} >
        <div className="m-loading">
          <b className="loading-text">loading...</b>
        </div>
      </div>
    );
  }
}
// tslint:disable-next-line: no-null-keyword
let loadingRef:null | Loading = null;
const createLoad = function (callback?:()=>void) {
  const wrap = document.getElementById("wrap-loading");
  if (!wrap) {
    throw new Error("不存在Loading组件的容器，请生成id为 wrap-loading");
  }
  ReactDom.render(<Loading ref={(ref) => (loadingRef = ref)} />, wrap, function () {
    if (callback) {
      callback();
    }
  });
};

const loadfn = {
  open: function (hasShade?:boolean) {
    if (!loadingRef) {
      createLoad(function () {
        loadingRef!.toggle(true, hasShade);
      });
    } else {
      loadingRef!.toggle(true, hasShade);
    }
  },
  close: function () {
    if (loadingRef) {
		    loadingRef.toggle(false);
    }
  },
};
export {createLoad};
export default loadfn;
