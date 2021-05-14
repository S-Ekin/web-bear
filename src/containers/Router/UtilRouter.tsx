/**
 * @name name
 * @description 滚动条
 * @time 2020-11-25
 */
import * as React from "react";
import { Switch, Route } from "react-router-dom";
import LoadRoute from "@componentDemo/util/routerLoad/demo";
type Props={

};
type States={

};

class ScrollRouter extends React.PureComponent<Props, States> {
  state:States={

  };
  render () {

    return (
      <Switch>
        <Route path="/util/routerLoad"  component={LoadRoute}/>
      </Switch>
    );
  }
}


export default ScrollRouter;
