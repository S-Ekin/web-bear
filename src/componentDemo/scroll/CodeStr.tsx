export const str1 = `
class Demo extends React.PureComponent<Props, States> implements IDemo {
	
  scrollMethods:undefined | IScrollMethods ;
  bindScrollMethods = (scrollMethods:IScrollMethods)=>{
    this.scrollMethods = scrollMethods;
  }
	render () {
		return (
			<ScrollBox
				key={key}
				className={preConfig.get("className")}
				noStopPageScroll={preConfig.get("noStopPageScroll")}
				keepBarShow={preConfig.get("keepBarShow")}
				height={+preConfig.get("height")}
				bindIntiScroll={this.bindScrollMethods}
			>
				<div className="main-demo" >
				{this.getList()}
				</div>
			</ScrollBox>
		)
	}
}
`;
