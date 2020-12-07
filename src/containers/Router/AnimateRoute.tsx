/**
 * @author: SEKin 
 * @Date: 2020-12-07 10:04:42 
 * @description:  动画组件
 * @Last Modified time: 2020-12-07 10:04:42 
 */
import * as React from "react";
import { Switch, Route } from "react-router-dom";
import Slide from "@componentDemo/animate/slide/demo";
type Props={

};
type States={

};

class AnimateRouter extends React.PureComponent<Props,States> {
    state:States={

    };
    render(){
        const {} = this.props;

        return (
            <Switch>
                <Route path="/animate/slide"  component={Slide}/>
            </Switch>
        );
    }
}


export default AnimateRouter;