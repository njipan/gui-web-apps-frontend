import React from 'react';
import clsx from 'clsx';
import { withStyles, Paper, Grid } from '@material-ui/core';

const styles = {
    content: {
        height: "100vh",
        borderRadius: 0,
        position : "relative" as "relative",
        userSelect: 'none' as 'none'
    },
    center:{
        margin: "0 auto",
    },
    elementContent:{
        position: "absolute" as "absolute",
        top: 10,
        left: 10
    },
};

class GuiPreviewContainer extends React.Component<any,any>{
    constructor(props:any){
        super(props);
    }
    
    componentDidMount(){
    }

    setProperties=(type:string,target:any)=>{
        const {activeEl} = this.state;
        const elements = [...this.state.elements];
        
        if(activeEl!=null){
            const index = activeEl.getAttribute('data-index')-1;
            if(type==="x"){
                activeEl.style.left = `${target.value}px`;
                elements[index].properties[1].sub_properties.x = Number(target.value);
                
            } else if(type==="y"){
                activeEl.style.top = `${target.value}px`;
                elements[index].properties[1].sub_properties.y = Number(target.value);
            }
            this.setState({elements});
        }
    }

    createComponent = (id: number, type: string, props: any, element_id:number) => {
        // const { text, x, y, width, height } = props;
        const text = props[0].value;
        const {x,y} = props[1].sub_properties;

        switch(id){
            case 1:
                return (
                    <button key={element_id} 
                            data-index={element_id} 
                            className={clsx(this.props.classes.elementContent, "elementCanvas")}
                            style={{
                                left: `${x}px`,
                                top: `${y}px`
                            }}
                    >{text}</button>
                );
            case 2:
                return (
                    <label key={element_id}
                            data-index={element_id}
                            className={clsx(this.props.classes.elementContent, "elementCanvas")}
                            style={{
                                left: `${x}px`,
                                top: `${y}px`
                            }}
                    >{text}</label>
                );
            case 3:
                return (
                    <div 
                        key={element_id}
                        className={clsx(this.props.classes.elementContent, "elementCanvas")}
                        style={{
                            left: `${x}px`,
                            top: `${y}px`
                        }}
                        data-index={element_id}
                    >
                        <input type='checkbox'
                                id={`cb-comp-${element_id}`}
                                
                        />
                        {text}
                        {/* <label key={element_id} htmlFor={`cb-comp-${element_id}`}>
                            {text}
                        </label> */}
                    </div>
                );
            case 4:
                    return (
                        <div 
                            className={clsx(this.props.classes.elementContent, "elementCanvas")}
                            key={element_id}
                            data-index={element_id}
                            style={{
                                left: `${x}px`,
                                top: `${y}px`
                            }}
                         >
                            <input type='radio'
                                    id={`rd-comp-${element_id}`}
                                    
                            />
                            {text}
                            {/* <label key={element_id} htmlFor={`rd-comp-${element_id}`}>
                                {text}
                            </label> */}
                        </div>
                    );
        }
    }

    render(){
        console.log(this.props.location.state.elements);
        const {elements} = this.props.location.state;
        let rElements: any[] = [];
        elements.map((v:any,i:any)=>{
            rElements.push(this.createComponent(v.component_id, v.type, v.properties,v.element_id));
        });
        return (
            <Grid className={this.props.classes.center} item xs={6}>
            <Paper className={this.props.classes.content}>
                {rElements}
            </Paper>
            </Grid>
        )
    }
}

export default withStyles(styles)(GuiPreviewContainer);