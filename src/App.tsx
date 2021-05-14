import "./component/my-css/main.scss";
import App from "./containers/index";
import * as React from "react";
import * as ReactDom from "react-dom";
import "@component/my-icon/iconfont.js";
const domApp = document.getElementById("app");

ReactDom.render((
  <App />
), domApp);


if (module.hot) {
  // 热替换react
  module.hot.accept("./containers/index", () => {
    import("./containers/index").then((module) => {
      // tslint:disable-next-line:variable-name
      const AppCom = module.default;
      ReactDom.render((
        <AppCom />
      ), domApp);
    });
  });
}
