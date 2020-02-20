/**
 * @name name
 * @description description
 * @time 2020-02-20
 */
import * as React from "react";
import Loading from '@component/loading/demo/Index';
import { Switch,Route } from "react-router-dom";
import CrashPage from '@component/crashPage/demo/demo';
type Props={

};
type States={

};

class LoadingRouter extends React.PureComponent<Props,States> {


    state:States={

    };
    render(){
        const {} = this.props;

        return (
            <Switch>
                <Route component={Loading} path="/loading/index"/>
                <Route component={CrashPage} path="/loading/crash"/>
            </Switch>
        );
    }
}


export default LoadingRouter;