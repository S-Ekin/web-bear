/**
 * @name name
 * @description description
 * @time 2020-02-20
 */
import * as React from "react";
import {Switch,Route} from 'react-router-dom';
import TableList from '@component/table/demo/Demo';

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
            </Switch>
        );
    }
}


export default TableRouter;