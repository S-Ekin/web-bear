import * as React from "react";
import {createPortal} from "react-dom";
import {VelocityComponent} from "velocity-react";

type NotificationProps={

}

type NotificationState={
    notices:{tit:string,type:noticeProps["type"],sigin:string,time:number}[];
}


class Notification extends React.PureComponent<NotificationProps,NotificationState>{
   state={
       notices:[]
   } 
        addNotice(tit:string,type:noticeProps["type"],time:number=2400){

            this.setState(pre=>{

                const notice = pre.notices;
                const sigin = this.getKey(notice.length);
                return {
                    notices:pre.notices.concat({tit,type,sigin,time})
                }
            });

            
        }

        getKey(index:number){
            return new Date().getTime() + "-"+index;
        }

        closeHandle=(e:React.MouseEvent<HTMLElement>)=>{
            const key = e.currentTarget!.dataset.key;
            this.removeNotice(key!)
        }

        removeNotice=(key:string)=>{

            this.setState(pre=>{
                return {
                    notices:pre.notices.filter(val=>val.sigin!==key)
                }
            })

        }

        render(){

            const {notices} = this.state;

            const dom = document.getElementById("s-modal");
            return dom ? createPortal((<div className="g-notification">

                {
                    notices.map((node)=>{

                        const {tit,type,sigin,time} = node ;
                    
                        return <Notice  del={this.removeNotice} tit={tit} type={type} time={time} key={sigin}  closeHandle={this.closeHandle} sigin={sigin}/>


                    })
                }
            </div>),dom) : null;
        }
};

type noticeProps={
    type:"error"|"success"|"warn";
    tit:string;
    closeHandle:(e:React.MouseEvent<HTMLElement>)=>void;
    sigin:string;
    time:number;
    del:(key:string)=>void;
}

type noticeState={
    timeId:undefined | number;
}

class Notice extends React.PureComponent<noticeProps,noticeState>{
    state={
        timeId:undefined
    }
    componentDidMount(){

        const {time,del,sigin} = this.props;
        
        if(time>0){

            const timeId = window.setTimeout(function(){

                del(sigin);

            },time);

            this.setState({
                timeId,
            })

        }

    }

    componentWillUnmount(){

        const timeId = this.state.timeId;

        if(timeId){
            window.clearTimeout(timeId);
        }
    }

    render(){

        const {type,tit,closeHandle,sigin} = this.props;

        return (
            <VelocityComponent animation="transition.bounceRightIn" runOnMount={true}>
  
                <div >
                    <span className="g-alertInfo">
                        <span>
                            <span className={type} style={{ paddingRight: 8, fontSize: 24 }}>
                                <i className={"fa " + (type == "success" ? "fa-check-circle" : type == "warn" ? "fa-exclamation-triangle" : "fa-times-circle-o ")}></i>

                            </span>
                            <span className="txt">{tit}</span>
                        </span>
                       
                        <span className="m-alert-close" data-key={sigin} onClick={closeHandle}><i className="fa fa-times fa-lg"  /></span>

                    </span>
                  
                </div>
            </VelocityComponent >
        )
    }
}


export {
    Notification
}
