import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

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

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

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
    }
}

const instance = axios.create({
    baseURL: 'http://localhost:8000/api'
});

class ProgrammingModuleContainer extends React.Component<any, any> {
    constructor(props: any){
        super(props);
        this.state = {
            selectedLanguage: -1,
            languages: [],
            modules: [],
            isAdd: false,
            newModule: {
                name: '',
                file: null
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
            instance.get(`/programming-module/get-by-programming-id/${newValue}`).then(({ data }) => {
                this.setState({
                    modules: data
                });
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

    render = () => {
        return (
            <>
                <Typography variant="h6">Programming Module</Typography>

                <Divider className={this.props.classes.divider} />

                <FormControl className={this.props.classes.formControl}>
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
                        <Divider className={this.props.classes.divider} />

                        <div className={this.props.classes.buttonContainer}>
                            <Button variant="contained" color="primary" onClick={() => this.setState({isAdd: true})}>
                                <AddIcon />
                                Add
                            </Button>
                        </div>

                        <Divider className={this.props.classes.divider} />

                        {this.state.modules.length > 0 &&
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
                                                <a className={this.props.classes.link} 
                                                    href={'http://localhost:8000' + v.file_path} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                >
                                                    File
                                                </a>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="contained" color="secondary">
                                                    <DeleteIcon />
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        }

                        {this.state.modules.length < 1 &&
                            <div className={this.props.classes.messageBox}>
                                <Typography variant="h6">No Data</Typography>
                            </div>
                        }
                    </>
                }

                <Modal open={this.state.isAdd} onClose={() => this.onModalAddClose()} className={this.props.classes.modalContainer}>
                    <div className={this.props.classes.modal}>
                        <Typography variant="h6">Add Programming Module</Typography>
                        <Divider className={this.props.classes.divider} />
                    </div>
                </Modal>
            </>
        );
    }
}

export default withStyles(styles)(ProgrammingModuleContainer)