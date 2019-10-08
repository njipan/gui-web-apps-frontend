import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import clsx from 'clsx';

import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';

import red from '@material-ui/core/colors/red';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import ListIcon from '@material-ui/icons/List';

const styles = {
    divider: {
        margin: '10px 0'
    },
    messageBox: {
        display: 'flex',
        justifyContent: 'center',
        color: red[500],
        padding: '10px 0'
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginRight: '10px'
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
    noMargin: {
        margin: '0'
    },
    textField: {
        width: '100%',
        margin: '5px 0'
    },
    marginRight10px: {
        marginRight: '10px'
    }
};

const instance = axios.create({
    baseURL: 'http://localhost:8000/api'
});

interface IProperty {
    id: number;
    name: string;
}

class GuiPropertyContainer extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            properties: [],
            isAdd: false,
            newProperty: {
                name: '',
                sub_properties: ''
            }
        }
    }

    componentDidMount = () => {
        this.getProperties();
    }

    getProperties = () => {
        instance.get('/gui-property').then(({data}) => {
            this.setState({
                properties: data as IProperty[]
            });
        }).catch((err) => {
            Swal.fire({
                title: 'Error Occurred',
                text: 'Something wrong with service',
                type: 'error'
            });
        });
    }

    onChangeNew = (newValue: any, property: string) => {
        let {newProperty} = this.state;
        newProperty[property] = newValue;

        this.setState({
            newProperty: newProperty
        });
    }

    addProperty = () => {
        const { newProperty } = this.state;
        instance.post('/gui-property', {
            name: newProperty.name,
            sub_properties: newProperty.sub_properties
        }).then(({data}) => {
            this.setState({
                isAdd: false,
                newProperty: {
                    name: '',
                    sub_properties: ''
                }
            }, () => {
                this.getProperties();
                Swal.fire({
                    title: 'Success',
                    text: 'Property added successfully',
                    type: 'success'
                });
            });
        }).catch(({response}) => {
            const {data} = response;

            this.setState({
                isAdd: false
            }, () => {
                Swal.fire({
                    title: response.status === 400 ? 'Failed' : 'Error Occurred',
                    text: response.status === 400 ? data.message : 'Something wrong with service',
                    type: 'error'
                }).then(() => {
                    this.setState({
                        isAdd: true
                    });
                });
            });
        })
    }

    deleteProperty = (id: number, name: string) => {
        Swal.fire({
            title: 'Delete Confirmation',
            text: `Are you sure want to delete "${name}"?`,
            type: 'warning',
            showCancelButton: true
        }).then(({value}) => {
            if(value) {
                instance.delete(`/gui-property/${id}`).then(({data}) => {
                    this.getProperties();
                    Swal.fire({
                        title: 'Success',
                        text: 'Property deleted successfully',
                        type: 'success'
                    });
                }).catch(({response}) => {
                    Swal.fire({
                        title: response.status === 500 ? 'Error Occurred' : 'Failed',
                        text: response.status === 500 ? 'Something wrong with service' : '',
                        type: 'error'
                    });
                });
            }
        });
    }

    render = () => {
        const { properties, isAdd, newProperty } = this.state;

        return (
            <>
                <Typography variant="h6">GUI Property</Typography>

                <Divider className={this.props.classes.divider} />

                <div className={this.props.classes.buttonContainer}>
                    <Button variant="contained" color="primary" onClick={() => this.setState({isAdd: true})}>
                        <AddIcon />
                        Add
                    </Button>
                </div>

                <Divider className={this.props.classes.divider} />

                { properties.length > 0 ?
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Property Name</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                properties.map((v: IProperty, i: any) => (
                                    <TableRow key={i}>
                                        <TableCell>{v.name}</TableCell>
                                        <TableCell>
                                            <div>
                                                <Link to={`${this.props.match.path}/${v.id}/mapping`}>
                                                    <Button variant="contained" color="primary" className={this.props.classes.marginRight10px}>
                                                        <ListIcon />
                                                        Mapping
                                                    </Button>
                                                </Link>
                                                <Button variant="contained" color="secondary" onClick={() => this.deleteProperty(v.id, v.name)}>
                                                    <DeleteIcon />
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>

                :

                    <div className={this.props.classes.messageBox}>
                        <Typography variant="h6">No Data</Typography>
                    </div>
                }

                <Modal open={isAdd} onClose={() => this.setState({isAdd: false, newProperty: {name: ''}})} className={this.props.classes.modalContainer}>
                    <div className={this.props.classes.modal}>
                        <Typography variant="h6">Add GUI Property</Typography>

                        <Divider className={this.props.classes.divider} />

                        <TextField label="Property Name"
                                    value={newProperty.name} 
                                    onChange={(e) => this.onChangeNew(e.target.value, 'name')}
                                    className={this.props.classes.textField}
                                    autoFocus={true} />

                        <TextField label="Sub Properties" 
                                    value={newProperty.sub_properties}
                                    onChange={(e) => this.onChangeNew(e.target.value, 'sub_properties')}
                                    className={this.props.classes.textField} />

                        <FormHelperText>{'Add "," as separator'}</FormHelperText>
                        <FormHelperText>{'Fill blank if does not need sub properties'}</FormHelperText>

                        <Divider className={this.props.classes.divider} />

                        <div className={clsx(this.props.classes.buttonContainer, this.props.classes.noMargin)}>
                            <Button variant="contained" color="primary" onClick={() => this.addProperty()}>
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

export default withStyles(styles)(GuiPropertyContainer);