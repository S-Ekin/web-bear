const str1 = `
const total= 200;
const count = 5;
 randomChildContent =() => {
       const child1 = Math.random()*10;
        const child2 = Math.random()*10;
        
        this.setState(()=>{
        let tabH = 0;    
        if (child1 < count) {
            tabH = total / 2;
        } else {
            tabH = 0;
        } 

        if (child2 < count) {
            tabH = tabH || 180;
        } else {
            tabH = tabH ? total- 180 :total/ 2;
        }
            return {
                child1H:tabH,
                child2H:total- tabH,
                child1,
                child2,
            };
        });
    }
`;

const str2 = `
	
`;

const str3 = `
`;

export { str1, str2, str3 };
