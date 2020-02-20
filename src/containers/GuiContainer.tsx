import React from 'react';
import clsx from 'clsx';
import axios from 'axios';
import Swal from 'sweetalert2';
import styled from 'styled-components';

import IButton from "../core/gui/models/IButton";
import GuiPreviewContainer from './GuiPreviewContainer';
import { make } from '../core/gui/factory';
import ProjectApi from '../apis/ProjectApi';
import FileApi from '../apis/FileApi';
import CodeGeneratorApi from '../apis/CodeGenerateApi';

import { withStyles, TextField } from "@material-ui/core";
import Divider from '@material-ui/core/Divider';
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Chip from '@material-ui/core/Chip';
import Modal from '@material-ui/core/Modal';
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import AddIcon from '@material-ui/icons/Add';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Loader from '../components/Loader';

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
    },
    textField: {
        width: '100%'
    },
    menuItem: {
        fontWeight: 'normal' as 'normal',
        marginBottom: '5px',
        cursor: 'pointer' as 'pointer'
    }
};

const instance = axios.create({
    baseURL: 'http://localhost:8000/api',
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
    private codeGeneratorApi: CodeGeneratorApi;

    constructor(props : any){
        super(props);
        this.projectApi = new ProjectApi();
        this.fileApi = new FileApi();
        this.codeGeneratorApi = new CodeGeneratorApi();

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
            isFetchingProjects : false,
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
            components : [],
            showWindowPortal:false,
            projectId:0,
            fileId:0,
            explorers: [],
            mouseInComp: {
                x: 0,
                y: 0
            },
            isAddProject: false,
            isAddFile: false,
            isOpenFP: false,
            menuStatus: {
                x: 0,
                y: 0,
                isWorking: false,
                isOpen: false,
                data: {
                    type: '',
                    id: -1,
                    project_id: -1,
                    file_id: -1
                }
            },
            isShowLanguage: false
        };
    }

    componentDidMount(): void {
        document.oncontextmenu = document.body.oncontextmenu = () => {return false;}

        this.setState({ isFetchingProjects : true});
        instance.get('/programming-language').then(({data})=>{
            this.setState({
                programmingLanguages: data as ILanguage,
                isFetchingProjects : false
            })
        });
        this.getAllProjects();
        this.getAllComponents();
        if(!this.canvas.current) return;
        this.setState({
            canvasWidth : this.canvas.current.clientWidth,
            canvasHeight: this.canvas.current.clientHeight,
        });
    }

    getAllProjects = () => {
        instance.get('/projects').then(({data})=>{
            this.setState({
                explorers: data as IProject
            })
        });
    }

    getAllComponents = () => {
        instance.get('/gui-component').then(({data}) => {
            this.setState({
                components: data
            })
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
        this.showDirectoryMenu(e);
    }

    setMouseUp=(e:any)=>{
        this.setState({
            isHold:false
        });
        
    }

    setProperties=(type:string, target:any, id: any)=>{
        
        const {activeEl} = this.state;
        const elements = [...this.state.elements];
        
        if(activeEl != null) {
            const ids = id.split('|');
            const index = elements.findIndex((v: any) => {
                return v.element_id === parseInt(activeEl.getAttribute('data-index'));
            });
            const propIndex = elements[index].properties.findIndex((v: any) => {
                return v.property_id === parseInt(ids[0]);
            });
            let property = elements[index].properties[propIndex];
            if(typeof(property) !== 'undefined') {
                if(typeof(property.sub_properties) !== 'undefined' && Object.keys(property.sub_properties).length > 0) {
                    property.sub_properties[ids[1]] = target.value;
                }
                else {
                    property.value = target.value;
                }
            }
            elements[index].properties[propIndex] = property;
            this.setState({elements});
        }
    }

    moveAt=(e:any)=>{
        const {isHold,activeEl, mouseInComp, elements} = this.state;
        if(isHold && activeEl!==null){
            if(activeEl.className.indexOf("elementCanvas") === -1) return;

            // const index = activeEl.getAttribute('data-index')-1;
            let rightSideParentEl = activeEl.parentElement.getBoundingClientRect().right;
            let leftSideParentEl = activeEl.parentElement.getBoundingClientRect().left;
            let topSideParentEl = activeEl.parentElement.getBoundingClientRect().top;
            let bottomSideParentEl = activeEl.parentElement.getBoundingClientRect().bottom;
            let shiftX = e.clientX - leftSideParentEl - mouseInComp.x;// + mouseInComp.x;
            let shiftY = e.clientY - topSideParentEl - mouseInComp.y;// + mouseInComp.y;
            
            let rightSide = Math.floor(rightSideParentEl - leftSideParentEl - activeEl.clientWidth);
            let bottomSide = Math.floor(bottomSideParentEl - topSideParentEl - activeEl.clientHeight);
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
                activeEl.style.left = (rightSideParentEl - leftSideParentEl - activeEl.clientWidth - 3)+'px';
            }
                
            //For Y
            if(shiftY > 0 && shiftY < bottomSide){
                activeEl.style.top = `${shiftY}px`;
            }
            else if(shiftY <= 0){
                activeEl.style.top = '0px';
            }
            else if(shiftY >= bottomSide){
                activeEl.style.top = `${bottomSideParentEl - topSideParentEl - activeEl.clientHeight - 4}px`;
            }

            const index = elements.findIndex((v: any) => {
                return v.element_id === parseInt(activeEl.getAttribute('data-index'));
            });
            const propIndex = elements[index].properties.findIndex((v: any) => {
                let sns = ['location', 'position'];
                let name = v.property_name.toLowerCase().trim();
                return sns.indexOf(name) > -1;
            });

            if(propIndex > -1) {
                elements[index].properties[propIndex].sub_properties = {
                    x: parseInt(activeEl.style.left),
                    y: parseInt(activeEl.style.top)
                };
            }
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
        const {elements,frame,activeLanguage, projectId, fileId} = this.state;
        const content = {
            language_id: activeLanguage,
            frame,
            elements
        }
        this.fileApi.update(projectId, fileId, '', content).then(({data})=>{
            Swal.fire({
                title: 'Success',
                text: 'Save File Successfully',
                type: 'success'
            });
        }).catch(console.log);
    }

    loadAndPreviewFile = (type: Number, projectId: Number, fileId: Number) =>{
        //let elements = [...this.state.elements];
        instance.get(`/projects/${projectId}/files/${fileId}`).then(({data})=>{
            data.content = JSON.parse(data.content);
            switch(type){
                case ClickType.LOAD:
                        this.setState({
                            elements: data.content !== null ? data.content.elements : [],
                            projectId,
                            fileId
                        });
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
            Swal.fire({
                title: 'Success',
                text: 'Generate Code Successfully',
                type: 'success'
            });
        }).catch(console.log);
    }

    addComponents = (type: any, id: number) => {
        const { components } = this.state;
        const elements = [...this.state.elements];
        let selectedComponent = components.find((v: any) => {
            return v.id === id;
        });
        if(typeof(selectedComponent) !== 'undefined') {
            elements.push({
                element_id: elements.length + 1,
                component_id: selectedComponent.id,
                properties: selectedComponent.properties.map((v: any) => {
                    let property: any = {
                        property_id: v.id,
                        property_name: v.name,
                        value: ''
                    };

                    if(v.sub_properties !== '') {
                        let sub_properties: any = {};
                        v.sub_properties.split(',').forEach((sp: string) => {
                            sub_properties[sp] = '';
                        });
                        property['value'] = '.';
                        property['sub_properties'] = sub_properties;
                    }

                    return property;
                })
            });
            this.setState({elements});
        }
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

    showDirectoryMenu = (e: any) => {
        let allowRoles = [
            'directory-menu',
            'download-option'
        ];
        let attrs = e.target.parentElement.parentElement.attributes;
        let tagRole = typeof(attrs) !== 'undefined' && typeof(attrs['data-role']) !== 'undefined' ? attrs['data-role'].value : '';
        if(tagRole === '') {
            let attrss = e.target.attributes;
            tagRole = typeof(attrss) !== 'undefined' && typeof(attrss['data-role']) !== 'undefined' ? attrss['data-role'].value : '';
        }

        const { menuStatus, isShowLanguage } = this.state;
        if(allowRoles.indexOf(tagRole) > -1) {
            if(e.stopPropagation) e.stopPropagation();
            else if(window.event) window.event.cancelBubble = true;
            e.preventDefault();

            let type = typeof(attrs) !== 'undefined' && typeof(attrs['data-type']) !== 'undefined' ? attrs['data-type'].value : '';
            if(type === 'project-menu' || type === 'item-menu') {
                if(menuStatus.isOpen) {
                    e.target.click();
                    menuStatus.isOpen = false;
                    menuStatus.isWorking = true;
                    this.setState({
                        menuStatus: menuStatus
                    });
                }

                return;
            }
            else if(type === 'language') {
                if(isShowLanguage) {
                    e.target.click();
                    this.setState({
                        isShowLanguage: false
                    });
                }

                return;
            }

            let isOpen = e.button === 2 && (typeof(attrs['data-type']) !== 'undefined' && typeof(attrs['data-id']) !== 'undefined') ? true : false;
            let isShowLanguagee = (typeof(attrs['data-type']) !== 'undefined' && typeof(attrs['data-id']) !== 'undefined') && type === 'language' ? true : false;
            let dataType = typeof(attrs['data-type']) !== 'undefined' ? attrs['data-type'].value : '';
            let project_id = -1;
            let file_id = -1;

            if(menuStatus.isWorking && !(dataType === 'project' || dataType === 'file')) {
                dataType = menuStatus.data.type;
                project_id = menuStatus.data.project_id;
                file_id = menuStatus.data.file_id;
            }
            else {
                let id = (typeof(attrs['data-id']) !== 'undefined' ? attrs['data-id'].value : -1).toString();
                if(type === 'project') {
                    project_id = parseInt(id);
                }
                else if(type === 'file') {
                    // project|file
                    let ids = id.split("|");
                    project_id = parseInt(ids[0]);
                    file_id = parseInt(ids[1]);
                }
            }
            let data = {
                type: dataType,
                project_id: project_id,
                file_id: file_id
            };
            this.setState({
                menuStatus: {
                    isOpen: isOpen,
                    x: e.clientX,
                    y: e.clientY,
                    data: data
                },
                isShowLanguage: isShowLanguagee
            });

            return false;
        }
        else if(!menuStatus.isWorking) {
            this.setState({
                menuStatus: {
                    isOpen: false
                },
                isShowLanguage: false
            });
        }

        return true;
    }

    DirectoryList = (props: any) => {
        const { explorers } = this.state;
        const { classes } = this.props;
        const { xs } = props;

        let openHandler = () => {
            this.getProjects(() => {
                const { projects } = this.state;

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
                        <AddIcon className={classes.iconControl} onClick={() => this.setState({isAddProject: true})} />
                        <FolderOpenIcon className={classes.iconControl} onClick={openHandler} />
                    </div>

                    <Divider />

                    { 
                    (!this.state.isFetchingProjects &&
                    <TreeView
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpandIcon={<ChevronRightIcon />}
                        className={classes.padding10px}
                        onContextMenu={() => {return false;}}
                    >
                        {explorers.map((v:IProject)=>(
                            <TreeItem key={v.id} nodeId={String(v.id)} label={v.name} data-role="directory-menu" data-type="project" data-id={v.id}>
                                {v.files.map((value:IFile)=>(
                                    <TreeItem key={value.id} 
                                        nodeId={String(value.id)} 
                                        label={value.name} 
                                        data-role="directory-menu"
                                        data-type="file"
                                        data-id={`${v.id}|${value.id}`}
                                        onClick={()=>this.loadAndPreviewFile(1,v.id,value.id)} />
                                ))}
                            </TreeItem>
                        ))}
                    </TreeView>
                    ) 
                    ||  
                    <Grid item xs={12} style={{ marginTop: '36px' }}>
                        <Loader size={48}/>
                    </Grid>
                    }
                </Paper>
            </Grid>
        );
    }

    LanguageOption = () => {
        const { programmingLanguages } = this.state;
        const MenuCard = styled(Card)`
            padding: 16px;
            position: absolute;
            bottom: 0px;
            left: 0px;
        `;
        
        let generateCode = (language_id: number) => {
            let language = programmingLanguages.find((v: any) => v.id === language_id);
            if(typeof(language) === 'undefined') return;

            const { elements } = this.state;
            this.codeGeneratorApi.generate(language.id, [], elements).then(({data}) => {
                console.log(data);
                let a = document.createElement('a');
                a.href = data.url_download;
                a.download = data.file_name;
                a.click();
            }).catch(console.log);
        }

        return (
            <MenuCard>
                <Grid container direction="column">
                    <List>
                        {
                            programmingLanguages.map((v: any) => (
                                <ListItem button key={v.id} data-role="download-option" data-type="language" onClick={() => generateCode(v.id)}>
                                    <ListItemText>{v.name}</ListItemText>
                                </ListItem>
                            ))
                        }
                    </List>
                </Grid>
            </MenuCard>
        )
    }

    GuiEditor = (props: any) => {
        const { elements, components, isShowLanguage } = this.state;
        const { classes } = this.props;
        const { xs } = props;
 
        return (
            <Grid item xs={xs}>
                {this.state.showWindowPortal &&
                    <GuiPreviewContainer>
                        <Paper className={classes.content} >
                            {elements.map((v:any)=>(
                                make(components, v, this.onMoveInComp, clsx(classes.elementContent, "elementCanvas"))
                            ))}
                        </Paper>
                    </GuiPreviewContainer>
                }

                <Paper className={clsx(classes.content, classes.flexCenter)} style={{backgroundColor:'#ccc'}}>
                    <Paper className={clsx(classes.content)} style={{width: '300px', height:'300px', margin: 'auto'}}>
                        {elements.map((v:any)=>(
                            make(components, v, this.onMoveInComp, clsx(classes.elementContent, "elementCanvas"))
                        ))}
                    </Paper>
                    <Grid container className={clsx(classes.guiControl, classes.padding10px)}>
                        <Grid item xs={6}>
                            <Chip clickable={true} 
                                label="Download"
                                variant="outlined"
                                color="primary"
                                deleteIcon={<ArrowDropDownIcon />}
                                onDelete={() => this.setState({ isShowLanguage: true })}
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
                        { isShowLanguage && <this.LanguageOption /> }
                    </Grid>
                </Paper>
            </Grid>
        );
    }

    ComponentProperty = (props: any) => {
        const { activeEl, components, elements } = this.state;
        const { classes } = this.props;
        const { xs } = props;

        let properties: any = [];
        if(activeEl != null) {
            let component = elements.find((v: any) => {
                return v.element_id === parseInt(activeEl.getAttribute('data-index'));
            });
            if(typeof(component) !== 'undefined') {
                component.properties.forEach((prop: any) => {
                    if(typeof(prop.sub_properties) !== 'undefined') {
                        Object.keys(prop.sub_properties).forEach((sp: any) => {
                            properties.push({
                                id: `${prop.property_id}|${sp}`,
                                name: `${prop.property_name} ${sp}`,
                                value: prop.sub_properties[sp]
                            });
                        });
                    }
                    else {
                        properties.push({
                            id: prop.property_id + '',
                            name: `${prop.property_name}`,
                            value: prop.value
                        });
                    }
                });
            }
        }

        return (
            <Grid item xs={xs}>
                <Grid className={clsx(classes.content, classes.halfHeight)}>
                    <Typography variant="h6" className={classes.paperHeader}>Components</Typography>

                    <Divider />

                    <div className={classes.padding10px}>
                        {
                            components.filter((v: any) => {
                                return v.id !== 1;
                            }).map((v: any) => (
                                <Chip key={v.id} 
                                    clickable={true} 
                                    label={v.name} 
                                    variant="outlined" 
                                    color="primary" 
                                    onClick={() => this.addComponents(v.name.toLowerCase(), v.id)} 
                                    className={clsx(classes.chip, classes.marginv10px)}
                                />
                            ))
                        }
                    </div>
                </Grid>
                <Divider />
                {
                    activeEl !== null &&
                    <Grid className={classes.halfHeight}>
                        <Typography variant="h6" className={classes.paperHeader}>Properties</Typography>

                        <Divider />

                        <div className={classes.padding10px} style={{
                            height: '39vh',
                            overflow: 'auto' as 'auto'
                        }}>
                            {
                                properties.map((v: any) => (
                                    <div key={v.id}>
                                        <TextField label={v.name}
                                            className={clsx(classes.marginv10px, classes.textField)}
                                            value={v.value}
                                            onChange={(e) => this.setProperties(v.name, e.target, v.id)}
                                        />
                                    </div>
                                ))
                            }
                            {/* <div>
                                <TextField label="Text" 
                                    className={clsx(classes.marginv10px, classes.textField)} 
                                    value={activeEl.innerText || activeEl.value}
                                    onChange={(e)=>{this.setProperties("text",e.target)}}
                                    // onKeyUp={(e)=>{this.setProperties("x",e.target)}}
                                />
                            </div>
                            <div>
                                <TextField label="Position X" 
                                    className={clsx(classes.marginv10px, classes.textField)} 
                                    value={activeEl.style.left.substr(0, activeEl.style.left.indexOf('px'))}
                                    onChange={(e)=>{this.setProperties("x",e.target)}}
                                    // onKeyUp={(e)=>{this.setProperties("x",e.target)}}
                                />
                            </div>
                            <div>
                                <TextField label="Position Y" 
                                    className={clsx(classes.marginv10px, classes.textField)} 
                                    value={activeEl.style.top.substr(0, activeEl.style.top.indexOf('px'))}
                                    onChange={(e)=>{this.setProperties("y",e.target)}}
                                    // onKeyUp={(e)=>{this.setProperties("y",e.target)}}
                                />
                            </div> */}
                        </div>
                    </Grid>
                }
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
        const { isAddProject, itemName } = this.state;
        const { classes } = this.props;

        let handleClose = () => {
            this.setState({
                isAddProject: false
            });
        };

        let addItem = () => {
            this.projectApi.insert(itemName).then(({data}) => {
                this.setState({
                    isAddProject: false
                }, () => {
                    this.getAllProjects();
                    Swal.fire({
                        title: 'Success',
                        text: 'Add Project Successfully',
                        type: 'success'
                    });
                })
            })
        };

        return (
            <Modal open={isAddProject || false} onClose={handleClose} className={clsx(classes.flexCenter)}>
                <div className={clsx(classes.modalContent, classes.padding10px)}>
                    <Typography variant="h6">Add Project</Typography>

                    <Divider />

                    <FormControl className={classes.formControlS}>
                        <TextField label="Item Name" value={itemName || ''} onChange={(e) => this.setState({itemName: e.target.value})} className={classes.marginv10px} autoFocus={true} />
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

    AddFileModal = (props: any) => {
        const { isAddFile, menuStatus } = this.state;
        const { classes } = this.props;
        const [ fileName, setFileName ] = React.useState('');

        const closeHandler = () => {
            this.setState({
                isAddFile: false
            })
        }

        const addFile = () => {
            this.fileApi.insert(menuStatus.data.project_id, fileName).then(({data}) => {
                menuStatus.isWorking = false;
                this.setState({
                    menuStatus: menuStatus,
                    isAddFile: false
                }, () => {
                    this.getAllProjects();
                    Swal.fire({
                        title: 'Success',
                        text: 'Add File Successfully',
                        type: 'success'
                    });
                });
            });
        }

        return (
            <Modal open={(isAddFile && typeof(menuStatus.data) !== 'undefined') || false} onClose={closeHandler} className={classes.flexCenter}>
                <div className={clsx(classes.modalContent, classes.padding10px)}>
                    <Typography variant="h6">Add File</Typography>

                    <Divider />

                    <FormControl className={classes.formControlS}>
                        <TextField label="File Name" value={fileName || ''} onChange={(e) => setFileName(e.target.value)} className={classes.marginv10px} />
                    </FormControl>
                    <div className={clsx(classes.startFromRight, classes.marginv10px)}>
                        <Chip icon={<AddIcon />} label="Add" variant="outlined" color="primary" clickable={true} onClick={addFile} />
                    </div>
                </div>
            </Modal>
        )
    }

    DirectoryMenu = (props: any) => {
        const { menuStatus } = this.state;
        const { classes } = this.props;
        const MenuCard = styled(Card)`
            padding: 16px;
            position: absolute;
            top: ${menuStatus.y}px;
            left: ${menuStatus.x}px;
        `;

        const addFile = () => {
            this.setState({
                isAddFile: true
            });
        }

        const deleteFile = () => {
            menuStatus.isOpen = false;
            this.setState({
                menuStatus
            }, () => {
                Swal.fire({
                    title: 'Delete Confirmation',
                    text: 'Are you sure want to delete this file?',
                    type: 'warning',
                    showCancelButton: true
                }).then(({value}) => {
                    if(value) {
                        this.fileApi.delete(menuStatus.data.project_id, menuStatus.data.file_id).then(() => {
                            this.getAllProjects();
                            Swal.fire({
                                title: 'Deleted',
                                text: 'Delete file successfully',
                                type: 'success'
                            });
                        });
                    }
                });
            });
        };

        const deleteProject = () => {
            menuStatus.isOpen = false;
            this.setState({
                menuStatus
            }, () => {
                Swal.fire({
                    title: 'Delete Confirmation',
                    text: 'Are you sure want to delete this project?',
                    type: 'warning',
                    showCancelButton: true
                }).then(({value}) => {
                    if(value) {
                        this.projectApi.delete(menuStatus.data.project_id).then(() => {
                            this.getAllProjects();
                            Swal.fire({
                                title: 'Deleted',
                                text: 'Delete project successfully',
                                type: 'success'
                            });
                        })
                    }
                })
            })
        }

        return (
            <>
                {
                    menuStatus.isOpen &&
                    <MenuCard>
                        <Grid container direction="column">
                            {
                                menuStatus.data.type === 'project' &&
                                <List>
                                    <ListItem button data-role="directory-menu" data-type="project-menu" onClick={addFile}>
                                        <ListItemIcon>
                                            <AddIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Add File" />
                                    </ListItem>
                                    <ListItem button data-role="directory-menu" data-type="project-menu">
                                        <ListItemIcon>
                                            <EditIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Rename" />
                                    </ListItem>
                                    <ListItem button data-role="directory-menu" data-type="project-menu" onClick={deleteProject}>
                                        <ListItemIcon>
                                            <DeleteIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Delete" />
                                    </ListItem>
                                </List>
                            }
                            {
                                menuStatus.data.type === 'file' &&
                                <List>
                                    <ListItem button data-role="directory-menu" data-type="project-menu">
                                        <ListItemIcon>
                                            <EditIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Rename" />
                                    </ListItem>
                                    <ListItem button data-role="directory-menu" data-type="project-menu" onClick={deleteFile}>
                                        <ListItemIcon>
                                            <DeleteIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Delete" />
                                    </ListItem>
                                </List>
                            }
                        </Grid>
                    </MenuCard>
                }
            </>
        );
    }

    render = () => {
        const { fileId } = this.state;

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
                    
                    {
                        fileId > 0 &&
                        <>
                            <this.GuiEditor xs={8} />
                            <this.ComponentProperty xs={2} />
                        </>
                    }
                </Grid>
                <this.AddModal />
                <this.AddFileModal />
                <this.OpenFileModal />
                <this.DirectoryMenu />
            </>
        );
    }
}

export default withStyles(styles)(GuiContainer);