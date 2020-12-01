/**
 * @name name
 * @description 滚动条
 * @time 2020-11-25
 */
import * as React from "react";
import { Switch, Route } from "react-router-dom";
import NormalScrollBox from "@componentDemo/scroll/demo";
type Props={

};
type States={

};

class ScrollRouter extends React.PureComponent<Props,States> {
    state:States={

    };
    render(){
        const {} = this.props;

        return (
            <Switch>
                <Route path="/scroll/normal"  component={NormalScrollBox}/>
            </Switch>
        );
    }
}


export default ScrollRouter;