import React from 'react';
import axios from 'axios';
import clsx from 'clsx';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';

import red from '@material-ui/core/colors/red';

const styles = {
    messageBox: {
        display: 'flex',
        justifyContent: 'center',
        fontSize: '12px',
        color: red[600]
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
    leftOrient: {
        justifyContent: 'flex-start'
    },
    marginRight10px: {
        marginRight: '10px'
    },
    link: {
        color: 'inherit',
        textDecoration: 'none'
    }
};

const instance = axios.create({
    baseURL: 'http://localhost:8000/api'
});

class ProgrammingLanguageContainer extends React.Component<any, any> {

    constructor(props: any){
        super(props);
        this.state = {
            languages: [],
            isAdd: false,
            newProgrammingLanguage: {
                name: ''
            }
        };
    }

    componentDidMount = () => {
        this.getLanguages();
    }

    getLanguages = () => {
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
        });
    }

    onModalAddClose = () => {
        this.setState({
            isAdd: false,
            newProgrammingLanguage: {
                name: ''
            }
        });
    }

    addLanguage = () => {
        instance.post('/programming-language', {
            'name': this.state.newProgrammingLanguage.name
        }).then((response) => {
            this.setState({
                isAdd: false
            }, () => {
                Swal.fire({
                    title: 'Success',
                    text: 'Language added successfully',
                    type: 'success'
                }).then(() => {
                    this.getLanguages();
                    this.setState({
                        isAdd: false,
                        newProgrammingLanguage: {
                            name: ''
                        }
                    });
                });
            });
        }).catch((err) => {
            this.setState({
                isAdd: false,
                newProgrammingLanguage: {
                    name: ''
                }
            }, () => {
                Swal.fire({
                    title: 'Error Occurred',
                    text: 'Something went wrong on request',
                    type: 'error'
                });
            });
        });
    }

    deleteLanguage = (id: number, name: string) => {
        Swal.fire({
            title: 'Delete Confirmation',
            text: `Are you sure want to delete "${name}"`,
            type: 'warning',
            showCancelButton: true
        }).then((result) => {
            if(result.value){
                instance.delete(`/programming-language/${id}`).then(() => {
                    Swal.fire({
                        title: 'Deleted!',
                        text: `"${name}" deleted successfully`,
                        type: 'success'
                    }).then(() => {
                        this.getLanguages();
                    });
                }).catch((err) => {
                    Swal.fire({
                        title: 'Error Occurred',
                        text: 'Something went wrong on request',
                        type: 'error'
                    });
                });
            }
        });
    }

    render = () => {
        return (
            <>
                <Typography variant="h6">Programming Language</Typography>

                <Divider className={this.props.classes.divider} />

                <div className={this.props.classes.buttonContainer}>
                    <Chip icon={<AddIcon />} label="Add" clickable={true} variant="outlined" color="primary" onClick={() => this.setState({ isAdd: true })} />
                </div>

                <Divider className={this.props.classes.divider} />

                {this.state.languages.length < 1 && 
                    <div className={this.props.classes.messageBox}>
                        <Typography variant="h6">No Data</Typography>
                    </div>
                }

                {this.state.languages.length > 0 &&
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Language Name</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.languages.map((v: any) => (
                                <TableRow key={v.id}>
                                    <TableCell>{v.name}</TableCell>
                                    <TableCell>
                                        <div className={clsx(this.props.classes.buttonContainer, this.props.classes.leftOrient, this.props.classes.noMargin)}>
                                            <Link to={`${this.props.match.path}/${v.id}/snippet`} className={clsx(this.props.classes.link)}>
                                                <Chip icon={<SettingsEthernetIcon />} 
                                                    label="Snippet" 
                                                    variant="outlined" 
                                                    color="primary" 
                                                    className={clsx(this.props.classes.marginRight10px)} 
                                                    clickable={true}
                                                />
                                            </Link>
                                            <Chip icon={<DeleteIcon />} 
                                                label="Delete" 
                                                variant="outlined" 
                                                color="secondary" 
                                                className={clsx(this.props.classes.marginRight10px)} 
                                                clickable={true}
                                                onClick={() => this.deleteLanguage(v.id, v.name)}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                }

                <Modal open={this.state.isAdd} onClose={() => this.onModalAddClose()} className={this.props.classes.modalContainer}>
                    <div className={this.props.classes.modal}>
                        <Typography variant="h6">Add Programming Language</Typography>
                        <Divider className={this.props.classes.divider} />
                        <TextField label="Programming Language Name" 
                                    value={this.state.newProgrammingLanguage.name} 
                                    onChange={(e) => this.setState({newProgrammingLanguage: { name: e.target.value}})}
                                    margin="normal"
                                    className={this.props.classes.textField}
                                    autoFocus={true} />
                        <div className={clsx(this.props.classes.buttonContainer, this.props.classes.noMargin)}>
                            <Button variant="contained" color="primary" onClick={() => this.addLanguage()}>
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

export default withStyles(styles)(ProgrammingLanguageContainer);