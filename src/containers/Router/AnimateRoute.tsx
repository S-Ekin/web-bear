/**
 * @author: SEKin
 * @Date: 2020-12-07 10:04:42
 * @description:  动画组件
 * @Last Modified time: 2020-12-07 10:04:42
 */
import * as React from "react";
import { Switch, Route } from "react-router-dom";
import Slide from "@componentDemo/animate/slide/demo";
import Animate from "@componentDemo/animate/animate/demo";
import Scroll from "@componentDemo/animate/scroll/demo";
type Props={

};
type States={

};
class AnimateRouter extends React.PureComponent<Props, States> {
  state:States={

  };
  render () {
    return (
      <Switch>
        <Route path="/animate/slide"  component={Slide}/>
        <Route path="/animate/animate"  component={Animate}/>
        <Route path="/animate/scroll"  component={Scroll}/>
      </Switch>
    );
  }
}


export default AnimateRouter;
