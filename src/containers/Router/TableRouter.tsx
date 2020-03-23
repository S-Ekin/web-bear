/**
 * @name name
 * @description description
 * @time 2020-02-20
 */
import * as React from "react";
import {Switch,Route} from 'react-router-dom';
import TableList from '@componentDemo/table/Demo';
import TableTree from '@componentDemo/treeTable/Demo';
import TableFix from '@componentDemo/TableList/demo';

type Props={

};
type States={

};

class TableRouter extends React.PureComponent<Props,States> {


    state:States={

    };
    render(){
        const {} = this.props;

        return (
            <Switch>
                <Route component={TableList} path="/table/list"/>
                <Route component={TableTree} path="/table/tree"/>
                <Route component={TableFix} path="/table/frozen"/>
            </Switch>
        );
    }
}


export default TableRouter;