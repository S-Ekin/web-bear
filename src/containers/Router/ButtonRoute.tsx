/**
 * @name 按钮和输入框类型
 * @description description
 * @time 2020-02-19
 */
import * as React from "react";
import {Switch,Route} from 'react-router-dom';
import ButtonDemo from '@componentDemo/button/demo';
import Layout from '@componentDemo/Layout/demo';
import InputDemo from '@componentDemo/input/DemoInput';
import CheckBoxDemo from '@componentDemo/input/CheckboxDemo';
import SearchDemo from '@componentDemo/input/SearchDemo';

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
                <Route component={Layout} path="/button/layout" />
                <Route component={InputDemo} path="/button/input" />
                <Route component={CheckBoxDemo} path="/button/checkbox" />
                <Route component={SearchDemo} path="/button/search" />
            </Switch>
        );
    }
}


export default ButtonRoute;
