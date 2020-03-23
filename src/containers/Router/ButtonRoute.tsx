/**
 * @name 按钮和输入框类型
 * @description description
 * @time 2020-02-19
 */
import * as React from "react";
import {Switch,Route} from 'react-router-dom';
import ButtonDemo from '@componentDemo/button/demo';

type Props={

};
type States={

};

class ButtonRoute extends React.PureComponent<Props,States> {


    state:States={

    };
    render(){

        return (
            <Switch>
                <Route component={ButtonDemo} path="/button/common" />
            </Switch>
        );
    }
}


export default ButtonRoute;
