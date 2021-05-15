import { Redirect, Route, Switch} from "react-router-dom";
import * as React from "react";
import ErrorBoundary from '@component/crashPage/ErrorBoundary';
import {event} from "@component/util/Event";
import notice from "@component/toast/index";
import loadable from "@component/util/routerLoad";
import DefaultPage from "@component/crashPage/defaultPage";
type IMyLoderRouter = Promise<{default: React.ComponentType<AnyObj>} | React.ComponentType<AnyObj>>
const routerConfig:{
  [k:string]:{
    loader: () => IMyLoderRouter ;
  }
} = {
  buttonRouter: {
    loader: () =>
      import(
        /* webpackChunkName: "input" */ "./Router/InpRoute"
      ) as IMyLoderRouter,
  },
  tableRouter: {
    loader: () =>
      import(
        /* webpackChunkName: "table" */ "./Router/TableRouter"
      ) as IMyLoderRouter,
  },

  loadingRouter: {
    loader: () =>
      import(
        /* webpackChunkName: "loading" */ "./Router/LoadingRouter"
      ) as IMyLoderRouter,
  },
  comboRouter: {
    loader: () =>
      import(
        /* webpackChunkName: "combo" */ "./Router/ComboRouter"
      ) as IMyLoderRouter,
  },
  blog: {
    loader: () =>
      import(
        /* webpackChunkName: "blog" */ "./Router/BlogRoute"
      ) as IMyLoderRouter,
  },
  problem: {
    loader: () =>
      import(
        /* webpackChunkName: "problem" */ "./Router/ProblemRoute"
      ) as IMyLoderRouter,
  },
  modal: {
    loader: () =>
      import(
        /* webpackChunkName: "modal" */ "./Router/ModalRoute"
      ) as IMyLoderRouter,
  },
  menu: {
    loader: () =>
      import(
        /* webpackChunkName: "menu" */ "./Router/MenuRouter"
      ) as IMyLoderRouter,
  },
  util: {
    loader: () =>
      import(
        /* webpackChunkName: "util" */ "./Router/UtilRouter"
      ) as IMyLoderRouter,
  },
  animate: {
    loader: () =>
      import(
        /* webpackChunkName: "animate" */ "./Router/AnimateRoute"
      ) as IMyLoderRouter,
  },
};

type props={

};
type state = {
  initRouter:{init:boolean};
};
class MainRouter extends React.PureComponent<props, state> {
  state:state ={
    initRouter: {init: false},
  };
  getHasErrorFn:(()=>boolean) | undefined;
  componentDidMount () {
    event.on("menuClick", (status:boolean) => {
      const hasError = !!(this.getHasErrorFn && this.getHasErrorFn());
      if (hasError) {
        this.setState(() => ({
          initRouter: {init: status}
        }), () => {
          notice.clear();
        });
      }

    });
  }
  componentWillUnmount () {
    event.remove("menuClick");
  }
  bindGetHasError=(getHasErrorFn:(()=>boolean)) => {
    this.getHasErrorFn = getHasErrorFn;
  }

  render () {
    const {initRouter} = this.state;
    return (

      <div className="g-main">
        <ErrorBoundary init={initRouter} bindGetHasError={this.bindGetHasError}>
          <Switch>
            <Route path="/inp" component={loadable(routerConfig.buttonRouter)} />
            <Route path="/table" component={loadable(routerConfig.tableRouter)} />
            <Route path="/loading" component={loadable(routerConfig.loadingRouter)} />
            <Route path="/combo" component={loadable(routerConfig.comboRouter)} />
            <Route path="/blog" component={loadable(routerConfig.blog)} />
            <Route path="/problem" component={loadable(routerConfig.problem)} />
            <Route path="/alert" component={loadable(routerConfig.modal)} />
            <Route path="/menu" component={loadable(routerConfig.menu)} />
            <Route path="/util" component={loadable(routerConfig.util)} />
            <Route path="/animate" component={loadable(routerConfig.animate)} />
            <Redirect from="/" to="/table/list" exact />
            <Route path="/"  component={DefaultPage}/>
          </Switch>
        </ErrorBoundary>
        <div id="inner-modal-wrap"/>
        <div id="wrap-loading" />
        <div id="wrap-notice" />
      </div>

    );

  }
}
export default MainRouter;

