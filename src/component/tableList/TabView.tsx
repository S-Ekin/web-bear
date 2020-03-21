/**
 * @name 表格区域视图
 * @description description
 * @time 2020-03-19
 */
import * as React from "react";
import TrItem from './TrItem';
type common =MyTabListSpace.common;
import {SvgIcon} from '../icon/index';
type Props={
    data:common['data'];
    config:common['config'];
    fixObj:common['fixObj'];
    viewIndex:number;
    changeState:common['changeState'];
    changeScrollTop(top:number,viewIndex:number):void;
    setTabBodyDom(dom:HTMLElement,viewIndex:number):void;
};
type States={

};
interface ITabView {
    scrollFn(e:React.UIEvent<HTMLDivElement>):void;
}
class TabView extends React.PureComponent<Props,States> implements ITabView{


    state:States={

    }; 
    colHeadRef:React.RefObject<HTMLDivElement> = React.createRef();
    tabBodyRef:React.RefObject<HTMLDivElement> = React.createRef();
    scrollFn=(e:React.UIEvent<HTMLDivElement>)=>{
        if(!e.currentTarget.classList.contains('action-body')){
            return ;
        }
        const {changeScrollTop,viewIndex} = this.props; 
        const dom = e.currentTarget;
        const left = dom.scrollLeft;
        const colHead = this.colHeadRef.current!;
        colHead.scrollLeft = left;
        changeScrollTop(dom.scrollTop,viewIndex);
        
    }
    checkAll=()=>{

    }
    getCheckAll(){
        const status = true ? "checkbox-marked" :"checkbox-blank";
        return (
            <span onClick={this.checkAll}>
                    <SvgIcon className={status} />
            </span>
        )
    }
    gethead(){
        const {config:{child:cols},} = this.props;
        const tds = cols.map(val=>{
            const {text,width,field} = val ;
            const txt = field === "check" ? this.getCheckAll() : text ;
            return (
                <th style={{width: width,}} className="td-border" key={field}>{txt}</th>
            );
        });
        return (
            <div className="tab-head" >
                 <table>
                     <thead>
                         <tr>{tds}</tr>
                     </thead>
                </table>
            </div>
        );
    }
    createColgroup(){
        const {config:{child:cols}} = this.props;
        const arr = cols.map(val=>{
            const {width,field} = val ;
            const style = width ? {width} : undefined;
            return (
                <col style={style} key={field}/>
            );
        });
        return (
            <colgroup>
                {arr}
            </colgroup>
        );

    }
    componentDidMount(){
        const {config,setTabBodyDom,viewIndex} = this.props;
        const dom = this.tabBodyRef.current;
        if(!dom){
            return ;
        }
        if(!config.forzen){
            this.overBox();
        }
        setTabBodyDom(dom,viewIndex);
    }
    //有滚动条的时候
    overBox(){

        const tbodyDom = this.tabBodyRef.current!;
        const {config:{forzen}} = this.props;
        if(!forzen && tbodyDom.scrollHeight> tbodyDom.clientHeight){
            //给自己的头部隐藏的滚动条占位
            const child = this.colHeadRef.current!.firstElementChild as HTMLDivElement;
            child!.style.paddingRight = "18px";
        }
    }
   
    wheelFn=(e:React.WheelEvent<HTMLDivElement>)=>{
        
        const {changeScrollTop,viewIndex} = this.props;
        const deltay  = e.deltaY; // 每滚动一下，滚动的距离
        const top = this.tabBodyRef.current!.scrollTop;
        const distance = top + deltay;
        this.tabBodyRef.current!.scrollTop = distance;
       
        changeScrollTop(distance,viewIndex);
    }
    makeSign=(e:React.MouseEvent<HTMLDivElement>)=>{
        e.preventDefault();
        const type = e.type;
        const dom = e.currentTarget;
        if(type === "mouseenter"){
            dom.classList.add('action-body');
        }else if(type === "mouseleave"){
            dom.classList.remove('action-body');
        }
    }
    getBody(){
        const {data,fixObj,fixObj:{idField},config,viewIndex,changeState} = this.props;
        const {child:cols} = config;
        const trs = data.map((val,index)=>{
            const id = val.get(idField);
            const isMainView= viewIndex === 0 ;
            return (
                <TrItem
                    key={id}
                    node={val}
                    index={`${index + 1}`}
                    changeState={changeState}
                    cols={cols}
                    isMainView={isMainView}
                    fixObj={fixObj}
                />
            );
            
        });
        const colgroup = this.createColgroup();
        const fn = !config.forzen ? this.scrollFn : undefined;
        const wheel = config.forzen ? this.wheelFn :undefined;
        const makeSignFn = !config.forzen ? this.makeSign :undefined;

        return (
                <div className="tab-body-main" 
                    onScroll={fn} 
                    onWheel={wheel}
                    onMouseEnter={makeSignFn}
                    onMouseLeave={makeSignFn}
                    ref={this.tabBodyRef} 
                >
                    <table>
                        {colgroup}
                        <tbody>
                            {trs} 
                        </tbody>
                    </table>
                </div>
        );
    }
    getMainBody(){
        return (
                <div className="tab-body-wrap">
                    {this.getBody()}
                </div>
        );
    }
    render(){
         const {config:{width,forzen},config} = this.props;
        const styleObj = width && forzen ? {width} : undefined;

        const className = config.forzen ? "tab-view-fix" : "tab-view-scroll";
        return (
            <div className={`${className} tab-viewBody`} style={styleObj}>
                <div className="tab-head-wrap" ref={this.colHeadRef}>
                    {this.gethead()}
                </div>
                {this.getMainBody()}
            </div>
        );
    }
}


export default TabView;