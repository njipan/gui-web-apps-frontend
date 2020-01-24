import React/*, {MouseEvent, Children}*/ from 'react';
import clsx from 'clsx';
import axios from 'axios';
import Swal from 'sweetalert2';
// import {Link} from 'react-router-dom';

// import { Button } from '../core/gui/components/Button';
import IButton from "../core/gui/models/IButton";
import GuiPreviewContainer from './GuiPreviewContainer';
import { make } from '../core/gui/factory';
import ProjectApi from '../apis/ProjectApi';
import FileApi from '../apis/FileApi';

import { withStyles, TextField } from "@material-ui/core";
import Divider from '@material-ui/core/Divider';
// import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
// import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
// import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';

import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import AddIcon from '@material-ui/icons/Add';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import FolderIcon from '@material-ui/icons/Folder';

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
    formControl:{
        width: '300px',
        marginLeft: 'auto'
    },
    root: {
        width: '100%',
    },
    paperHeader: {
        padding: '10px',
        fontWeight: 'normal' as 'normal'
    },
    iconControl: {
        padding: '5px',
        cursor: 'pointer' as 'pointer',
        borderRight: '1px solid rgba(0, 0, 0, 0.12)'
    },
    controlWrapper: {
        display: 'flex' as 'flex',
        alignItems: 'center' as 'center'
    },
    halfHeight: {
        height: '50%'
    },
    padding10px: {
        padding: '10px'
    },
    margin10px: {
        margin: '10px'
    },
    marginv10px: {
        marginTop: '10px',
        marginBottom: '10px'
    },
    guiControl: {
        position: 'absolute' as 'absolute',
        width: '100%',
        bottom: '0',
        left: '0',
        backgroundColor: 'white'
    },
    startFromRight: {
        display: 'flex' as 'flex',
        justifyContent: 'flex-end' as 'flex-end',
        alignItems: 'center' as 'center'
    },
    chip: {
        marginRight: '5px'
    },
    modalContent: {
        backgroundColor: 'white',
        width: '50vw'
    },
    formControlS: {
        width: '100%'
    },
    flexCenter: {
        display: 'flex' as 'flex',
        justifyContent: 'center' as 'center',
        alignItems: 'center' as 'center'
    },
    fontNormal: {
        fontWeight: 'normal' as 'normal'
    },
    textWithIcon: {
        display: 'flex' as 'flex',
        alignItems: 'center' as 'center'
    },
    marginRight10px: {
        marginRight: '10px'
    }
};

const instance = axios.create({
    baseURL: 'http://localhost:8000/api'
});

export enum ClickType{
    LOAD = 1,
    PREVIEW = 2
}

interface ILanguage{
    id: number;
    name: string;
}

interface IFile{
    id: number;
    name: string;
}

interface IProject{
    id: number;
    name: string;
    files : IFile[];
}

class GuiContainer extends React.Component <any, any> {
    private canvas = React.createRef<HTMLDivElement>();
    private projectApi: ProjectApi;
    private fileApi: FileApi;

    constructor(props : any){
        super(props);
        this.projectApi = new ProjectApi();
        this.fileApi = new FileApi();

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
            programmingLanguages: [],
            activeLanguage: '',
            isHold: false,
            activeEl:null,
            button,
            projects: [],
            frame:[
                {
                    property_id: 1,
                    value: "test"
                }
            ],
            elements:[
                {
                    element_id: 1,
                    component_id: 2,
                    properties:[
                        {
                            property_id: 1,
                            value: "Say Hello"
                        },
                        {
                            property_id: 2,
                            value: '.',
                            sub_properties:
                            {
                                x: 10,
                                y: 10
                            }
                        }
                    ],
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
            showWindowPortal:false,
            projectId:0,
            fileId:0,
            explorers: [],
            mouseInComp: {
                x: 0,
                y: 0
            },
            isAddFP: false,
            isOpenFP: false
        };
    }

    componentDidMount(): void {
        instance.get('/programming-language').then(({data})=>{
            this.setState({
                programmingLanguages: data as ILanguage
            })
        });
        instance.get('/projects').then(({data})=>{
            this.setState({
                explorers: data as IProject
            })
        });
        if(!this.canvas.current) return;
        this.setState({
            canvasWidth : this.canvas.current.clientWidth,
            canvasHeight: this.canvas.current.clientHeight,
        });
    }

    createButton = () : void=> {
        const elements = [...this.state.elements];
        elements.push({
            component_id: elements.length + 1,
            type:'button',
            properties: 
            {
                text: 'Button',
                x: 10,
                y: 10
            }
        });
        this.setState({elements});
    };

    componentDidUpdate(prevProps:any,prevState:any):void{
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
        if(e.target!=null && typeof(e.target.className) === typeof('') && e.target.className.includes("elementCanvas")){
            this.setState({
                isHold:true,
                activeEl:e.target
            });
        }
    }

    setMouseUp=(e:any)=>{
        this.setState({
            isHold:false
        });
        
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

    moveAt=(e:any)=>{
        const {isHold,activeEl, mouseInComp,elements} = this.state;
        // console.log(mouseInComp);
        if(isHold && activeEl!==null){
            
            if(activeEl.className.indexOf("elementCanvas")===-1) return;
            const index = activeEl.getAttribute('data-index')-1;
            let shiftX = e.clientX - activeEl.parentElement.getBoundingClientRect().left - mouseInComp.x;// + mouseInComp.x;
            let shiftY = e.clientY - activeEl.parentElement.getBoundingClientRect().top - mouseInComp.y;// + mouseInComp.y;
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
            let left = activeEl.style.left;
            let x = left.substring(0,left.length-2);
            elements[index].properties[1].sub_properties.x = Number(x);
                
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

            let top = activeEl.style.top;
            let y = top.substring(0,top.length-2);
            elements[index].properties[1].sub_properties.y = Number(y);
        }
    }

    ondragstart = () :boolean=>{
        return false;
    }
    
    onMoveInComp = (e: any) :void =>{
        const { isHold } = this.state;
        if(!isHold) {
            let parentBound = e.target.parentElement.getBoundingClientRect();
            this.setState({
                mouseInComp: {
                    x: e.pageX - parentBound.left - e.target.offsetLeft,
                    y: e.pageY - parentBound.top - e.target.offsetTop
                }
            });
        }
    }

    saveFile = () =>{
        const {elements,frame,activeLanguage} = this.state;
        const content = {
            language_id: activeLanguage,
            frame,
            elements
        }
        instance.post('/projects/1/files',{
            name: 'test',
            content
        }).then(({data})=>{
            Swal.fire({
                title: 'Success',
                text: 'Generate Code Successfully',
                type: 'success'
            });
        }).catch(console.log);
    }

    loadAndPreviewFile = (type:Number,projectId : Number, fileId: Number) =>{
        let elements = [...this.state.elements];
        instance.get(`/projects/${projectId}/files/${fileId}`).then(({data})=>{
            console.log(data.content);
            switch(type){
                case ClickType.LOAD:
                        this.setState({elements:data.content.elements,projectId,fileId});
                    break;
                case ClickType.PREVIEW:
                        let {showWindowPortal} = this.state;
                        showWindowPortal = !showWindowPortal;
                        this.setState({showWindowPortal});
                    break;
            }
        });
        

    }

    generateCode = () =>{
        const {elements,frame,activeLanguage} = this.state;
        instance.post('/code-generator',{
            language_id: activeLanguage,
            frame,
            elements
        }).then(({data})=>{
            console.log('test');
            Swal.fire({
                title: 'Success',
                text: 'Generate Code Successfully',
                type: 'success'
            });
        }).catch(console.log);
    }

    addComponents = (type: any) => {
        console.log(type);
        const elements = [...this.state.elements];
        let id = 0 ;
        switch(type){
            case 'button': 
                id = 2;
            break;
            case 'label': 
                id = 3;
            break;
            case 'checkbox': 
                id = 4;
            break;
            case 'radio': 
                id = 5;
            break;
        }
        elements.push({
            element_id: elements.length + 1,
            component_id: id,
            properties:[
                {
                    property_id: 1,
                    value: type
                },
                {
                    property_id: 2,
                    value: '.',
                    sub_properties:
                    {
                        x: 10,
                        y: 10
                    }
                }
            ]
        });
        this.setState({elements});
    }

    onLanguageChange = (language_id:any) =>{
        instance.get(`/programming-module/get-by-programming-id/${language_id}`).then(({data})=>{
            this.setState({
                activeLanguage:language_id
            });
        });
    }

    toggleWindowPortal=()=>{
        let {showWindowPortal} = this.state;
        showWindowPortal = !showWindowPortal;
        this.setState({showWindowPortal});
        // const showWindowPortal = !this.state.showWindowPortal;
        // this.setState({showWindowPortal});
    }

    preview = () =>{
        let myWindow = window.open("http://localhost:3000/", "_blank", "width=200,height=100");
    }

    getProjects = (callback: any) => {
        this.projectApi.getMyProject().then(({data}) => {
            this.setState({
                projects: data as IProject
            }, callback);
        });
    }

    DirectoryList = (props: any) => {
        const { explorers } = this.state;
        const { classes } = this.props;
        const { xs } = props;

        let openHandler = () => {
            this.getProjects(() => {
                const { projects } = this.state;
                console.log(projects);

                this.setState({
                    isOpenFP: true
                });
            });
        }

        return (
            <Grid item xs={xs}>
                <Paper className={this.props.classes.content}>
                    <Typography variant="h6" className={classes.paperHeader}>Directory</Typography>

                    <Divider />

                    <div className={classes.controlWrapper}>
                        <AddIcon className={classes.iconControl} onClick={() => this.setState({isAddFP: true})} />
                        <FolderOpenIcon className={classes.iconControl} onClick={openHandler} />
                    </div>

                    <Divider />

                    <TreeView
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpandIcon={<ChevronRightIcon />}
                        className={classes.padding10px}
                    >
                    {explorers.map((v:IProject)=>(
                        <TreeItem key={v.id} nodeId={String(v.id)} label={v.name}>
                            {v.files.map((value:IFile)=>(
                                <TreeItem key={value.id} nodeId={String(value.id)} label={value.name} onClick={()=>this.loadAndPreviewFile(1,v.id,value.id)}></TreeItem>
                            ))}
                        </TreeItem>
                        ))}
                    </TreeView>
                </Paper>
            </Grid>
        );
    }

    showLanguageOption = () => {

    }

    GuiEditor = (props: any) => {
        const { elements } = this.state;
        const { classes } = this.props;
        const { xs } = props;

        let Control = (props: any) => {
            return (
                <Grid container className={clsx(classes.guiControl, classes.padding10px)}>
                    <Grid item xs={6}>
                        <Chip clickable={true} 
                            label="Download"
                            variant="outlined"
                            color="primary"
                            deleteIcon={<ArrowDropDownIcon />}
                            onDelete={this.showLanguageOption}
                        />
                        {/* <button onClick={() => this.generateCode()}>Generate Code</button>
                        <FormControl className={this.props.classes.formControl}>
                            <InputLabel htmlFor="select-programming-language">Programming Language</InputLabel>
                            <Select value={this.state.activeLanguage} onChange={(e) => this.onLanguageChange(e.target.value)} inputProps={{
                                id: 'select-programming-language'
                            }}>
                                <MenuItem value="" disabled selected>-- Select Programming Language --</MenuItem>
                                {this.state.programmingLanguages.map((v: ILanguage) => (
                                    <MenuItem value={v.id} key={v.id}>{v.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl> */}
                    </Grid>
                    <Grid item xs={6} className={classes.startFromRight}>
                        <Chip clickable={true} 
                            label={this.state.showWindowPortal ? 'Close' : 'Preview'} 
                            variant="outlined" 
                            color="primary" 
                            onClick={()=>this.loadAndPreviewFile(2,this.state.projectId,this.state.fileId)} className={clsx(classes.chip)} 
                        />
                        <Chip clickable={true} 
                            label="Save"
                            variant="outlined" 
                            color="primary" 
                            onClick={this.saveFile} 
                        />
                    </Grid>
                </Grid>
            );
        };

        return (
            <Grid item xs={xs}>
                {this.state.showWindowPortal &&
                    <GuiPreviewContainer>
                        <Paper className={classes.content} >
                            {elements.map((v:any)=>(
                                make(v,Number(v.component_id), this.onMoveInComp,clsx(classes.elementContent, "elementCanvas"))
                            ))}
                        </Paper>
                    </GuiPreviewContainer>
                }

                <Paper className={clsx(classes.content, classes.flexCenter)} style={{backgroundColor:'#ccc'}}>
                    <Paper className={clsx(classes.content)} style={{width: '300px', height:'300px', margin: 'auto'}}>
                        {elements.map((v:any)=>(
                            make(v,Number(v.component_id), this.onMoveInComp,clsx(classes.elementContent, "elementCanvas"))
                        ))}
                    </Paper>
                    <Control />
                </Paper>
            </Grid>
        );
    }

    ComponentProperty = (props: any) => {
        const { classes } = this.props;
        const { xs } = props;

        let components = [
            'Button',
            'Label',
            'Checkbox',
            'Radio'
        ];

        let Component = (props: any) => {
            return (
                <Grid className={clsx(classes.content, classes.halfHeight)}>
                    <Typography variant="h6" className={classes.paperHeader}>Components</Typography>

                    <Divider />

                    <div className={classes.padding10px}>
                        {
                            components.map((v, i) => (
                                <Chip key={i} 
                                    clickable={true} 
                                    label={v} 
                                    variant="outlined" 
                                    color="primary" 
                                    onClick={() => this.addComponents(v.toLowerCase())} 
                                    className={clsx(classes.chip, classes.marginv10px)}
                                />
                            ))
                        }
                    </div>
                </Grid>
            );
        };

        let Property = (props: any) => {
            return (
                <Grid className={classes.halfHeight}>
                    <Typography variant="h6" className={classes.paperHeader}>Properties</Typography>

                    <Divider />

                    <div className={classes.padding10px}>
                        <div>
                            <span>Position X : </span> <br/>
                            <input className="properties" onKeyUp={(e)=>{this.setProperties("x",e.target)}} type="text"/>
                        </div>
                        <div>
                            <span>Position Y : </span> <br/>
                            <input className="properties" onKeyUp={(e)=>{this.setProperties("y",e.target)}} type="text"/>
                        </div>
                    </div>
                </Grid>
            );
        }

        return (
            <Grid item xs={xs}>
                <Component />
                <Divider />
                <Property className={classes.halfHeight} />
            </Grid>
        );
    }

    onMouseOver(evt: any){
        document.body.style.cursor = 'pointer';
    }

    onMouseOut(evt: any){
        document.body.style.cursor = 'default';
    }

    AddModal = (props: any) => {
        const { isAddFP, itemName } = this.state;
        const { classes } = this.props;

        let handleClose = () => {
            this.setState({
                isAddFP: false
            });
        };

        let addItem = () => {
            this.projectApi.insert(itemName).then(({data}) => {
                this.setState({
                    isAddFP: false
                }, () => {
                    Swal.fire({
                        title: 'Success',
                        text: 'Add Project Successfully',
                        type: 'success'
                    });
                })
            })
        };

        return (
            <Modal open={isAddFP || false} onClose={handleClose} className={clsx(classes.flexCenter)}>
                <div className={clsx(classes.modalContent, classes.padding10px)}>
                    <Typography variant="h6">Add Project</Typography>

                    <Divider />

                    {/* <FormControl className={classes.formControlS}>
                        <InputLabel htmlFor="item-type">Item Type</InputLabel>
                        <Select id="item-type" value={itemType || ''} onChange={(e) => this.setState({itemType: e.target.value})} className={classes.marginv10px}>
                            <MenuItem value="project">Project</MenuItem>
                            <MenuItem value="file">File</MenuItem>
                        </Select>
                    </FormControl> */}
                    <FormControl className={classes.formControlS}>
                        <TextField label="Item Name" value={itemName || ''} onChange={(e) => this.setState({itemName: e.target.value})} className={classes.marginv10px} />
                    </FormControl>
                    <div className={clsx(classes.startFromRight, classes.marginv10px)}>
                        <Chip icon={<AddIcon />} label="Add" variant="outlined" color="primary" clickable={true} onClick={addItem} />
                    </div>
                </div>
            </Modal>
        );
    }

    OpenFileModal = (props: any) => {
        const { isOpenFP, projects } = this.state;
        const { classes } = this.props;

        let handleClose = () => {
            this.setState({
                isOpenFP: false
            });
        };

        let openFile = () => {
            
        };

        let fileNames: any[] = [];
        projects.forEach((p: any) => {
            p.files.forEach((f: any) => {
                fileNames.push({
                    id: f.id,
                    type: 'file',
                    name: `${p.name}/${f.name}`
                });
            });

            fileNames.push({
                id: p.id,
                type: 'project',
                name: p.name
            });
        });

        return (
            <Modal open={isOpenFP || false} onClose={handleClose} className={clsx(classes.flexCenter)}>
                <div className={clsx(classes.modalContent, classes.padding10px)}>
                    <Typography variant="h6">Open File</Typography>
                        
                    <Divider />
                    <div className={classes.marginv10px}>
                        {
                            fileNames.length < 1 &&
                            <div className={clsx(classes.flexCenter)}>
                                <Typography variant="h6">No Data Available</Typography>
                            </div>
                        }

                        { fileNames.length > 0 &&
                            fileNames.map((v: any, i: any) => (
                                <div>
                                    <Typography key={i} variant="h6" className={clsx(classes.fontNormal, classes.textWithIcon)}>
                                        <div className={classes.marginRight10px}>
                                            {v.type === 'project' ? <FolderIcon /> : <InsertDriveFileIcon />}
                                        </div>
                                        {v.name}
                                    </Typography>
                                </div>
                            ))
                        }
                    </div>

                    <Divider />

                    <div className={clsx(classes.startFromRight, classes.marginv10px)}>
                        <Chip label="Cancel" 
                            variant="outlined" 
                            color="secondary" 
                            clickable={true} 
                            onClick={() => this.setState({isOpenFP: false})} className={classes.chip} />
                        {fileNames.length > 0 && <Chip label="Open" variant="outlined" color="primary" clickable={true} onClick={openFile} className={classes.chip} />}
                    </div>
                </div>
            </Modal>
        );
    }

    render(){
        
        return (
            <>
                <Grid container spacing={0}
                    className={this.props.classes.content}
                    onMouseUp={this.setMouseUp}
                    onMouseDown={this.setMouseDown}
                    onMouseMove={this.moveAt}
                    onDragStart={this.ondragstart}
                >
                    <this.DirectoryList xs={2} />
                    <this.GuiEditor xs={8} />
                    <this.ComponentProperty xs={2} />
                </Grid>
                <this.AddModal />
                <this.OpenFileModal />
            </>
        );
    }
}

export default withStyles(styles)(GuiContainer);