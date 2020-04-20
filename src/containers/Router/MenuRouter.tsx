
/**
 * @name 菜单类型
 * @description description
 * @time 2020-04-20
 */
import * as React from "react";
import {Switch , Route} from 'react-router-dom';
import MenuDemo from '@componentDemo/menu/Demo';

type Props={

};
type States={

};

class ComboRouter extends React.PureComponent<Props,States> {


    state:States={

    };
    render(){
        const {} = this.props;

        return (
            <Switch>
                <Route component={MenuDemo} path="/menu/list"/>
            </Switch>
        );
        
    }
}


export default ComboRouter;