import React, {MouseEvent} from 'react';
import clsx from 'clsx';
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import { withStyles } from "@material-ui/core";

// import { Button } from '../core/gui/components/Button';
import IButton from "../core/gui/models/IButton";
import TreeView from "../components/TreeView";

const styles = {
    content: {
        height: "100vh",
        borderRadius: 0,
        position : "relative" as "relative",
        userSelect: 'none' as 'none'
    },
    halfVerticalScreen : {
        height: 50
    },
    elementContent:{
        position: "absolute" as "absolute",
        top: 10,
        left: 10
    },
};

class GuiContainer extends React.Component <any, any> {

    private canvas = React.createRef<HTMLDivElement>();

    constructor(props : any){
        super(props);
        const button: IButton = {
            point : {
                x : 10,
                y : 10,
            },
            height : 100,
            width: 100,
            text : 'sdafdsaf',
            backgroundColor : 'grey',
            onClick : () => { alert('clicked'); }
        };
        this.state = {
            isHold: false,
            activeEl:null,
            button,
            elements:[
                {
                    id: 1,
                    type:'button',
                    props: {
                        text: 'test',
                        x: 10,
                        y: 10
                    }
                }
            ],
            tasks:[
                {
                    point:{top:0,left:0}
                }
            ],
            components : [
                {
                    type: 'button',
                    point: {x: 10, y: 30},
                    onClick : () => {}
                }
            ],
            explorers : [
                {
                    name: 'Project 1',
                    childrens : []
                },
                {
                    name: 'Project 2',
                    childrens : [
                        {
                            name: 'File 1',
                            childrens : []
                        },
                    ]
                }
            ],
            mouseInComp: {
                x: 0,
                y: 0
            }
        };
    }

    componentDidMount(): void {
        if(!this.canvas.current) return;
        this.setState({
            canvasWidth : this.canvas.current.clientWidth,
            canvasHeight: this.canvas.current.clientHeight,
        });
    }

    createButton = () : void=> {
        const elements = [...this.state.elements];
        elements.push({
            id: elements.length + 1,
            type:'button',
            props: {
                text: 'Button',
                x: 10,
                y: 10
            }
        });
        this.setState({elements});
    };

    componentDidUpdate():void{
        //Initialize can drag within body of html
        let body = document.getElementsByTagName('body')[0];
        body.onmouseup = this.setMouseUp;
        body.onmousedown = this.setMouseDown;
        body.onmousemove = this.moveAt;
        body.ondragstart = this.ondragstart;
    }

    componentWillUnmount = () => {
        //Remove event of body
        let body = document.getElementsByTagName('body')[0];
        body.onmouseup = null;
        body.onmousedown = null;
        body.onmousemove = null;
        body.ondragstart = null;
    }

    setMouseDown=(e:any)=>{
        this.setState({
            isHold:true,
            activeEl:e.target
        });
        
    }

    setMouseUp=(e:any)=>{
        this.setState({
            isHold:false,
            activeEl:null
        });
        
    }

    moveAt=(e:any)=>{
        const {isHold,activeEl, mouseInComp} = this.state;
        // console.log(mouseInComp);
        if(isHold && activeEl!==null){
            if(activeEl.className.indexOf("elementCanvas")===-1) return;
            
            let shiftX = e.clientX - activeEl.parentElement.getBoundingClientRect().left;// + mouseInComp.x;
            let shiftY = e.clientY - activeEl.parentElement.getBoundingClientRect().top;// + mouseInComp.y;
            let rightSideActiveEl = activeEl.getBoundingClientRect().right;
            let rightSideParentEl = activeEl.parentElement.getBoundingClientRect().right;
            let leftSideParentEl = activeEl.parentElement.getBoundingClientRect().left;
            let bottomSideParentEl = activeEl.parentNode.clientHeight;
            let leftStyleActiveEl =activeEl.style.left;
            
            let rightSide = Math.floor(rightSideParentEl - leftSideParentEl - activeEl.clientWidth);
            let bottomSide = bottomSideParentEl - activeEl.clientHeight;
            //For X
            // if(leftStyleActiveEl.substring(leftStyleActiveEl.length-2,0) >= -1 && rightSideActiveEl<rightSideParentEl){
            if(shiftX > 0 && shiftX < rightSide){
                
                //kalau di antara canvas, si element gerak
                activeEl.style.left = `${shiftX}px`;
            } else if(shiftX <= 0){
                //kalau dia di luar dari -1 (sebelah kiri canvas), dia kembali jadi 0
                activeEl.style.left = '0px';
            } else if(shiftX >= rightSide) {
                //kalau dia di luar dari sebelah kanan canvas, dia kembali ke kanan canvas
                activeEl.style.left = (rightSideParentEl-leftSideParentEl-activeEl.clientWidth-5)+'px';
            }

            //For Y
            if(shiftY > 0 && shiftY < bottomSide){
                activeEl.style.top = `${shiftY}px`;
            }
            else if(shiftY <= 0){
                activeEl.style.top = '0px';
            }
            else if(shiftY >= bottomSide){
                activeEl.style.top = `${bottomSide}px`;
            }
        }
    }

    ondragstart = () :boolean=>{
        return false;
    }
    
    onMoveInComp = (e: any) => {
        this.setState({
            mouseInComp: {
                x: e.nativeEvent.layerX,
                y: e.nativeEvent.layerY
            }
        });
    }

    createComponent = (id: number, type: string, props: any) => {
        const { text, x, y, width, height } = props;

        switch(type){
            case 'button':
                return (
                    <button key={id} 
                            data-index={id} 
                            className={clsx(this.props.classes.elementContent, "elementCanvas")}
                            onMouseMove={this.onMoveInComp}
                    >{text}</button>
                );
            case 'label':
                return (
                    <label key={id}
                            data-index={id}
                            className={clsx(this.props.classes.elementContent, "elementCanvas")}
                            onMouseMove={this.onMoveInComp}
                    >{text}</label>
                );
            case 'checkbox':
                return (
                    <label key={id}>
                        <input type='checkbox'
                                id={`cb-comp-${id}`}
                                data-index={id}
                                className={clsx(this.props.classes.elementContent, "elementCanvas")}
                                onMouseMove={this.onMoveInComp}
                        />
                        {text}
                    </label>
                );
        }
    }

    addComponents = (type: any) => {
        const elements = [...this.state.elements];
        elements.push({
            id: elements.length + 1,
            type: type,
            props: {
                text: type,
                x: 10,
                y: 10
            }
        });
        this.setState({elements});
    }

    render(){
        const {elements} = this.state;

        let rElements: any[] = [];
        elements.map((v: any, i: any)=>{
            rElements.push(this.createComponent(v.id, v.type, v.props));
        });
        return (
            <>
            <Grid container spacing={0}
                className={this.props.classes.content}
                onMouseUp={this.setMouseUp}
                onMouseDown={this.setMouseDown}
                onMouseMove={this.moveAt}
                onDragStart={this.ondragstart}
            >
                <Grid item xs={3}>
                    <Paper className={this.props.classes.content}>
                        <TreeView data={this.state.explorers} />
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper className={this.props.classes.content}>
                        { rElements }
                    </Paper>
                </Grid>
                <Grid item xs={3}>
                    <Paper className={this.props.content}>
                        <Grid className={this.props.content}>
                            <div>
                                <Typography variant="h6" component="h2">
                                    Components
                                </Typography>
                            </div>
                            <div>
                                <button onClick={() => this.addComponents('button')}>Button</button>
                                <button onClick={() => this.addComponents('label')}>Label</button>
                                <button onClick={() => this.addComponents('checkbox')}>Checkbox</button>
                                <button onClick={() => this.addComponents('radio')}>Radio</button>
                            </div>
                        </Grid>
                        <Grid>
                            <div>
                                <Typography variant="h6" component="h2">
                                    Properties
                                </Typography>
                            </div>
                            <div>
                                <div>
                                    <span>Position X : </span> <br/>
                                    <input type="text"/>
                                </div>
                                <div>
                                    <span>Position Y : </span> <br/>
                                    <input type="text"/>
                                </div>
                            </div>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
            </>
        );
    }

    onMouseOver(evt: any){
        document.body.style.cursor = 'pointer';
    }

    onMouseOut(evt: any){
        document.body.style.cursor = 'default';
    }
}

export default withStyles(styles)(GuiContainer);