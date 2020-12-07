export const str1 = `
// 菜单
<SlideBox slide={node.get("drop")} >
	<ul className="child-ul">
		{this.subMenu(child,parIndex)}
	</ul>						
</SlideBox>

// 下拉框
<div
	className={"m-drop {directionUp ? "direction-up" : ""}"}
	style={dropWidth?{width:dropWidth}:undefined}
>
	<SlideBox slide={drop} directionUp={directionUp}>
		<Drop 
			filedObj={this.filedObj} 
			data={data} 
			changeSelect={this.changeSelect}
			selected={selected}
			dropStyle={this.dropStyle}
			initSelect={this.initSelect}
			initComboVal={initComboVal}	
			formatterDropItem={formatterDropItem}
			clickMethod={this.bindSelectFn}
		/>
	</SlideBox>
</div>

// 日历
<div className="g-calendar-box" >
	<SlideBox
		slide={expand}
	>
		<div style={{ display: "flex", }}>
			<CalendarView
				fixProps={this.fixProps}
				selTimeObj={selTimeArr.get(0)!}
				showViewArr={showViewArr}
				curTime={this.curTime}
				lastYear={pannelLastYear.get(0)!}
				showTimeObj={showTimeArr.get(0)!}
				rotate={rotate}
				viewIndex={0}
				changeBasicState={this.changeBasicState}
			/>
			{secondViews}
		</div>
	</SlideBox>
</div>
`;
