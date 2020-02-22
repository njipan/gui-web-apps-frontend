import React from 'react';
import axios from './../shared/modules/axios';
import Swal from 'sweetalert2';
import clsx from 'clsx';
import Moment from 'react-moment';

import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Link from '@material-ui/core/Link';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import AddBoxIcon from '@material-ui/icons/AddBox';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import EditIcon from '@material-ui/icons/Edit';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';

import red from '@material-ui/core/colors/red';

const styles = {
    formControl: {
        width: '100%'
    },
    select: {
        width: '100%'
    },
    divider: {
        margin: '10px 0'
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        margin: '10px 0',
        marginRight: '20px'
    },
    messageBox: {
        display: 'flex',
        justifyContent: 'center',
        fontSize: '12px',
        color: red[600]
    },
    link: {
        color: 'inherit'
    },
    modalContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modal: {
        minWidth: '50%',
        backgroundColor: 'white',
        padding: '10px 20px',
        borderRadius: '5px'
    },
    textField: {
        width: '100%'
    },
    noMargin: {
        margin: '0'
    },
    fileField: {
        width: '100%',
        padding: '10px 0'
    },
    card: {
        margin: '16px 0'
    },
    cardItem: {
        padding: '16px'
    },
    icon : {
        fontSize : 16,
        marginLeft : '12px'
    },
    marginRight10px: {
        marginRight: '10px'
    }
}

const instance = axios;

class ProgrammingModuleContainer extends React.Component<any, any> {
    constructor(props: any){
        super(props);
        this.state = {
            selectedLanguage: -1,
            languages: [],
            modules: [],
            isAdd: false,
            newModule: {
                name: ''
            }
        }
    }

    componentDidMount = () => {
        instance.get('/programming-language').then(({ data }) => {
            this.setState({
                languages: data
            });
        }).catch((err) => {
            if(!axios.isCancel(err)){
                Swal.fire({
                    title: 'Error Occurred',
                    text: 'Something went wrong on request',
                    type: 'error'
                });
            }
            else{
                console.log(err.message);
            }
        });
    }

    onLanguageChange = (newValue: any) => {
        this.setState({
            selectedLanguage: newValue
        }, () => {
            this.getModules(newValue);
        });
    }

    getModules = (id: number) => {
        instance.get(`/programming-module/get-by-programming-id/${id}`).then(({ data }) => {
            this.setState({
                modules: data
            });
        });
    }

    onModalAddClose = () => {
        this.setState({
            isAdd: false,
            newModule: {
                name: '',
                file: null
            }
        });
    }

    deleteModule = (id: number, name: string) => {
        Swal.fire({
            title: 'Delete Confirmation',
            text: `Are you sure want to delete "${name}"`,
            type: 'warning',
            showCancelButton: true
        }).then((result) => {
            if(result.value){
                instance.delete(`/programming-module/${id}`).then((response) => {
                    this.getModules(this.state.selectedLanguage);
                    Swal.fire({
                        title: 'Success',
                        text: `"${name}" is deleted`,
                        type: 'success'
                    });
                }).catch((err) => {
                    Swal.fire({
                        title: 'Error Occurred',
                        text: 'Something wrong with request',
                        type: 'error'
                    });
                });
            }
        });
    } 

    addModule = () => {
        let data = new FormData();
        let file = document.getElementById('file') as any;
        this.setState({
            isAdd: false
        }, () => {
            if(file !== null && this.state.newModule.name !== '' && this.state.selectedLanguage !== -1){
                console.log(this.state.selectedLanguage);
                console.log(this.state.newModule.name);
                console.log(file.files);
                data.append('programming_id', this.state.selectedLanguage);
                data.append('name', this.state.newModule.name);
                data.append('file', file.files[0]);
                console.log(data);
                
                instance.post('/programming-module', data, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((response) => {
                    this.getModules(this.state.selectedLanguage);
                    Swal.fire({
                        title: 'Success',
                        text: 'Module added successfully',
                        type: 'success'
                    });
                }).catch((err) => {
                    console.log(err);
                    Swal.fire({
                        title: 'Error Occurred',
                        text: 'Something wrong with service',
                        type: 'error'
                    });
                });
            }
            else{
                Swal.fire({
                    title: 'Error Occurred',
                    text: 'Please fill all field',
                    type: 'error'
                });
            }
        });
    }

    render = () => {
        const {classes} = this.props;

        return (
            <>
                <Typography variant="h6">Programming Module</Typography>

                <Divider className={classes.divider} />

                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="programming-language">Programming Language</InputLabel>
                    <Select value={this.state.selectedLanguage} 
                            inputProps={{
                                id: 'programming-language'
                            }}
                            onChange={
                                (e) => this.onLanguageChange(e.target.value)
                            }
                    >
                        <MenuItem value="-1" selected disabled>-- Choose Programming Language --</MenuItem>
                        {this.state.languages.map((v: any) => (
                            <MenuItem key={v.id} value={v.id}>{v.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {this.state.selectedLanguage !== -1 &&
                    <>
                        <Divider className={classes.divider} />

                        <Grid container className={classes.card}>
                            <Chip icon={<AddBoxIcon className={classes.icon} />} 
                                label="Create" 
                                clickable={true} 
                                variant="outlined" 
                                color="primary" 
                                onClick={() => this.setState({ isAdd: true })} 
                            />
                        </Grid>

                        {
                            this.state.modules.length > 0 &&
                            this.state.modules.map((v: any, i: any) => (
                                <Card key={i} className={classes.card}>
                                    <Grid container spacing={2} direction="column" className={this.props.classes.cardItem}>
                                        <Grid item xs={12} sm>
                                            <Typography variant="h6">{v.name}</Typography>
                                        </Grid>
                                        <Grid container direction="row">
                                            <Grid item xs sm={6} md={6}>
                                                <Grid container direction="row">
                                                    <Chip 
                                                        label={<Moment date={v.created_at} interval={0} format="DD MMM YYYY" />}
                                                        color="default" 
                                                        icon={ <CalendarTodayIcon className={this.props.classes.icon} /> }
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Grid item xs sm={6} md={6}>
                                                <Grid container direction="row" justify="flex-end">
                                                    <Link href={v.file_path} target="_blank" underline="none" rel="noreferrer">
                                                        <Chip icon={<InsertDriveFileIcon className={this.props.classes.icon} />} 
                                                            label="Show File" 
                                                            variant="outlined" 
                                                            color="default" 
                                                            className={clsx(this.props.classes.marginRight10px)} 
                                                            clickable={true}
                                                        />
                                                    </Link>
                                                    <Chip icon={<EditIcon className={this.props.classes.icon} />} 
                                                        label="Update" 
                                                        variant="outlined" 
                                                        color="primary" 
                                                        className={clsx(this.props.classes.marginRight10px)} 
                                                        clickable={true}
                                                    />
                                                    <Chip icon={<DeleteIcon className={this.props.classes.icon} />} 
                                                        label="Delete" 
                                                        variant="outlined" 
                                                        color="secondary" 
                                                        className={clsx(this.props.classes.marginRight10px)} 
                                                        clickable={true}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Card>
                            ))
                        }

                        {/* {this.state.modules.length > 0 &&
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Module Name</TableCell>
                                        <TableCell>File</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.modules.map((v: any) => (
                                        <TableRow key={v.id}>
                                            <TableCell>{v.name}</TableCell>
                                            <TableCell>
                                                <a className={classes.link} 
                                                    href={'http://localhost:8000' + v.file_path} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                >
                                                    File
                                                </a>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="contained" color="secondary" onClick={() => this.deleteModule(v.id, v.name)}>
                                                    <DeleteIcon />
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        } */}

                        {this.state.modules.length < 1 &&
                            <div className={classes.messageBox}>
                                <Typography variant="h6">No Data</Typography>
                            </div>
                        }
                    </>
                }

                <Modal open={this.state.isAdd} onClose={() => this.onModalAddClose()} className={classes.modalContainer}>
                    <div className={classes.modal}>
                        <Typography variant="h6">Add Programming Module</Typography>

                        <Divider className={classes.divider} />

                        <TextField label="Programming Module Name" 
                                    value={this.state.newModule.name} 
                                    onChange={(e) => this.setState({newModule: { name: e.target.value}})}
                                    margin="normal"
                                    className={classes.textField}
                                    autoFocus={true} />
                        <Input type="file" id="file" margin="dense" className={classes.fileField} />

                        <Divider className={classes.divider} />

                        <div className={clsx(classes.buttonContainer, classes.noMargin)}>
                            <Button variant="contained" color="primary" onClick={() => this.addModule()}>
                                <AddIcon />
                                Add
                            </Button>
                        </div>
                    </div>
                </Modal>
            </>
        );
    }
}

export default withStyles(styles)(ProgrammingModuleContainer)