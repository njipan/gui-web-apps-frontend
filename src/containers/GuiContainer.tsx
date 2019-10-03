import React from 'react';
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import { withStyles } from "@material-ui/core";
import { Stage, Layer } from 'react-konva';

// import { Button } from '../core/gui/components/Button';
import IButton from "../core/gui/models/IButton";
import TreeView from "../components/TreeView";

const styles = {
    content: {
        height: "100vh",
        borderRadius: 0,
        position : "relative" as "relative"
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
            button,
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
            ]
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
        const components = [...this.state.components];
        components.push({
            type: 'button',
            point: {x: 50, y: 30},
            onClick : () => {}
        });
        this.setState({components});
    };

    componentDidUpdate():void{

    }

    dragAndDrop = (evt:any) :void =>{
        let el = evt.target;
        console.log(el);
        el.onmousedown = function (event:any){
            let shiftX = event.clientX - el.getBoundingClientRect().left;
            let shiftY = event.clientY - el.getBoundingClientRect().top;

            el.style.position = 'absolute';
            el.style.zIndex = 1000;
            document.body.append(el);
            let obj = event.path[0];
            moveAt(event.pageX,event.pageY);

            function moveAt(pageX:number,pageY:number){
                if (obj.offsetLeft + obj.clientWidth - 5 >= window.outerWidth) {
                    el.style.left = window.outerWidth - obj.clientWidth-5 + 'px';
                    document.removeEventListener('mousemove',onMouseMove);
                    el.onmouseup = null;
                } else {
                    el.style.left = pageX - shiftX+'px';
                }
                
                if(obj.offsetLeft-8<=0 ){
                    el.style.left = obj.offsetLeft+2 + 'px';
                    document.removeEventListener('mousemove',onMouseMove);
                    el.onmouseup = null;
                } else{
                    el.style.left = pageX - shiftX+'px';
                }
                
                if(obj.offsetTop + obj.clientHeight-4 >=window.innerHeight){
                    el.style.top = window.innerHeight - obj.clientHeight-4+'px';
                    document.removeEventListener('mousemove',onMouseMove);
                    el.onmouseup = null;
                } else{
                    el.style.top = pageY - shiftY+'px';
                }

                if(obj.offsetTop-8<=0 ){
                    el.style.top = obj.offsetTop+2 + 'px';
                    document.removeEventListener('mousemove',onMouseMove);
                    el.onmouseup = null;
                } else{
                    el.style.top = pageY - shiftY+'px';
                }
            }

            function onMouseMove(event : any){
                moveAt(event.pageX,event.pageY);
            }

            document.addEventListener('mousemove',onMouseMove);

            el.onmouseup = function(){
                document.removeEventListener('mousemove',onMouseMove);
                el.onmouseup = null;
            }

            el.ondragstart = function(){
                return false;
            }
        }
    }

    render(){
        return (
            <>
            <Grid container spacing={0}>
                <Grid item xs={3}>
                    <Paper className={this.props.classes.content}>
                        <TreeView data={this.state.explorers} />
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper 
                        className={this.props.classes.content}
                    >
                        <button /*ref={(e)=>this.dragAndDrop(e)}*/>test</button>
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
                                <button onClick={this.createButton}>Button</button>
                                <button>Label</button>
                                <button>Checkbox</button>
                                <button>Radio</button>
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