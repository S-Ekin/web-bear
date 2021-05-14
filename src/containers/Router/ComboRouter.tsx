/**
 * @name 下拉框的类型
 * @description description
 * @time 2020-02-21
 */
import * as React from "react";
import {Switch, Route} from 'react-router-dom';
import Calendar from '@componentDemo/calendar/Demo';
import Combobox from '@componentDemo/combo/list/demo';
import ComboTree from '@componentDemo/combo/tree/demo';

type Props={

};
type States={

};

class ComboRouter extends React.PureComponent<Props, States> {


  state:States={

  };
  render () {

    return (
      <Switch>
        <Route component={Calendar} path="/combo/calendar"/>
        <Route component={Combobox} path="/combo/list"/>
        <Route component={ComboTree} path="/combo/tree"/>
      </Switch>
    );

  }
}


export default ComboRouter;
