/**
 * @name name
 * @description description
 * @time 2020-02-20
 */
import * as React from "react";
import Loading from '@componentDemo/loading/Demo';
import { Switch, Route } from "react-router-dom";
import CrashPage from '@componentDemo/crashPage/demo';
import EmptyIcon from '@componentDemo/icon/demo';
type Props={

};
type States={

};

class LoadingRouter extends React.PureComponent<Props, States> {


  state:States={

  };
  render () {
    return (
      <Switch>
        <Route component={Loading} path="/loading/index"/>
        <Route component={CrashPage} path="/loading/crash"/>
        <Route component={EmptyIcon} path="/loading/empty"/>
      </Switch>
    );
  }
}


export default LoadingRouter;
