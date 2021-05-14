/**
 * @name 数据结构
 * @description description
 * @time 2020-03-19
 */
import * as React from "react";
import {Switch, Route} from 'react-router-dom';
import BinTree from '../../blog/bintree/demo/Demo';
import Tree from '../../blog/tree/demo/Demo';

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
        <Route component={BinTree} path="/blog/bintree" />
        <Route component={Tree} path="/blog/tree" />
      </Switch>
    );
  }
}


export default BlogRoute;
