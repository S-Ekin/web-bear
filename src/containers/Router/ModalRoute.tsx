/**
 * @name 模态框
 * @description description
 * @time 2020-04-10
 */
import * as React from "react";
import {Switch,Route} from 'react-router-dom';
import Toast from "../../componentDemo/toast/index";
import Modal from "../../componentDemo/modal/Demo";

type Props={

};
type States={

};
interface IModalRoute {

}
class ModalRoute extends React.PureComponent<Props,States> implements IModalRoute{


    state:States={

    };
    render(){

        return (
            <Switch>
            <Route component={Modal} path="/alert/modal" />
            <Route component={Toast} path="/alert/toast" />
        </Switch>
        );
        
    }
}


export default ModalRoute;