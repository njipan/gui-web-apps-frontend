import React from 'react';
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import { withStyles } from "@material-ui/core";
import { Stage, Layer } from 'react-konva';

import { Button } from '../core/gui/components/Button';
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
    }
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


    render(){
        return (
            <Grid container spacing={0}>
                <Grid item xs={3}>
                    <Paper className={this.props.classes.content}>
                        <TreeView data={this.state.explorers} />
                    </Paper>
                </Grid>
                <Grid item xs={6} ref={this.canvas}>
                    <Paper className={this.props.classes.content}>
                        <Stage width={this.state.canvasWidth || 0} height={this.state.canvasHeight || 0}>
                            <Layer onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}>
                                {
                                    this.state.components.length > 0 && this.state.components.map((item: any, key: number) => {
                                        return (
                                            <Button onClick = {item.onClick} point={item.point} key={key}/>
                                        )
                                    })
                                }
                            </Layer>
                        </Stage>
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
        )
    }

    onMouseOver(evt: any){
        document.body.style.cursor = 'pointer';
    }

    onMouseOut(evt: any){
        document.body.style.cursor = 'default';
    }
}

export default withStyles(styles)(GuiContainer);