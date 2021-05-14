/**
 * @name 按钮和输入框类型
 * @description description
 * @time 2020-02-19
 */
import * as React from "react";
import {Switch, Route} from 'react-router-dom';
import ButtonDemo from '@componentDemo/button/demo';
import Layout from '@componentDemo/Layout/demo';
import InputDemo from '@componentDemo/input/DemoInput';
import CheckBoxDemo from '@componentDemo/input/CheckboxDemo';
import SearchDemo from '@componentDemo/input/SearchDemo';
import TextareaDemo from '@componentDemo/input/TextareaDemo';

type Props={

};
type States={

};

class ButtonRoute extends React.PureComponent<Props, States> {


  state:States={

  };
  render () {

    return (
      <Switch>
        <Route component={ButtonDemo} path="/inp/button" />
        <Route component={Layout} path="/inp/layout" />
        <Route component={InputDemo} path="/inp/input" />
        <Route component={TextareaDemo} path="/inp/textarea" />
        <Route component={CheckBoxDemo} path="/inp/checkbox" />
        <Route component={SearchDemo} path="/inp/search" />
      </Switch>
    );
  }
}


export default ButtonRoute;
