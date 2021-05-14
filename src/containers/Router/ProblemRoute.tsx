/**
 * @name 数据结构
 * @description description
 * @time 2020-03-19
 */
import * as React from "react";
import {Switch, Route} from 'react-router-dom';
import Balance from '../../problem/balance/demo/Demo';

type Props={

};
type States={

};

class BlogRoute extends React.PureComponent<Props, States> {


  state:States={

  };
  render () {

    return (
      <Switch>
        <Route component={Balance} path="/problem/balence" />
      </Switch>
    );
  }
}


export default BlogRoute;
