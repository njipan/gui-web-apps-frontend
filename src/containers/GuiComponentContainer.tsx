import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TextField from '@material-ui/core/TextField';

import AddIcon from '@material-ui/icons/Add';
import ListIcon from '@material-ui/icons/List';
import DeleteIcon from '@material-ui/icons/Delete';

import red from '@material-ui/core/colors/red';

const styles = {
    spaceAbove: {
        marginTop: '10px !important'
    },
    divider: {
        margin: '10px 0'
    },
    messageBox: {
        display: 'flex',
        justifyContent: 'center',
        color: red[500]
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
    width100: {
        width: '100%'
    },
    noMargin: {
        margin: '0'
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

class GuiComponentContainer extends React.Component<any, any> {

    constructor(props: any){
        super(props);
        this.state = {
            components: [],
            isAdd: false,
            newComponent: {
                name: ''
            }
        };
    }

    componentDidMount = () => {
        this.getComponents();
    }

    getComponents = () => {
        instance.get('/gui-component').then(({data}) => {
            this.setState({
                components: data
            });
        }).catch((err) => {
            Swal.fire({
                title: 'Error Occurred',
                text: 'Something wrong with service',
                type: 'error'
            });
        });
    }

    addComponent = () => {
        const {newComponent} = this.state;

        instance.post('/gui-component', {
            name: newComponent.name
        }).then(({data}) => {
            this.setState({
                isAdd: false,
                newComponent: {
                    name: ''
                }
            }, () => {
                this.getComponents();
                Swal.fire({
                    title: 'Success',
                    text: 'Component saved successfully',
                    type: 'success'
                });
            });
        }).catch((err) => {
            const {response} = err;
            const {data} = response;
            
            this.setState({
                isAdd: false
            }, () => {
                Swal.fire({
                    title: (response.status === 400 ? 'Failed' : 'Error Occurred'),
                    text: (response.status === 400 ? data.message : 'Something wrong with service'),
                    type: 'error'
                }).then(() => {
                    this.setState({
                        isAdd: true
                    });
                });
            });
        });
    }

    deleteComponent = (id: any, name: any) => {
        Swal.fire({
            title: 'Delete Confirmation',
            text: `Are you sure want to delete "${name}"?`,
            type: 'warning',
            showCancelButton: true
        }).then((result) => {
            if(result.value){
                instance.delete(`/gui-component/${id}`).then(({data}) => {
                    this.getComponents();
                    Swal.fire({
                        title: 'Success',
                        text: 'Component deleted successfully',
                        type: 'success'
                    });
                }).catch((err) => {
                    Swal.fire({
                        title: 'Error Occurred',
                        text: 'Something wrong with service',
                        type: 'error'
                    });
                });
            }
        });
    }

    render = () => {
        const { components, isAdd, newComponent } = this.state;

        return (
            <>
                <Typography variant="h6">GUI Component</Typography>

                <Divider className={this.props.classes.divider} />

                <div className={this.props.classes.buttonContainer}>
                    <Button variant="contained" color="primary" onClick={() => this.setState({ isAdd: true })}>
                        <AddIcon />
                        Add
                    </Button>
                </div>

                <Divider className={this.props.classes.divider} />

                <div>
                    {components.length > 0 &&
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Component Name</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {components.map((v: any, i: any) => (
                                    <TableRow key={i}>
                                        <TableCell>{v.name}</TableCell>
                                        <TableCell>
                                            <div>
                                                <Link to={`${this.props.match.path}/${v.id}/mapping`} className={this.props.classes.link}>
                                                    <Button variant="contained" color="primary" className={clsx(this.props.classes.marginRight10px)}>
                                                        <ListIcon />
                                                        Mapping
                                                    </Button>
                                                </Link>
                                                <Button variant="contained" color="secondary" onClick={() => this.deleteComponent(v.id, v.name)}>
                                                    <DeleteIcon />
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    }

                    {components.length < 1 &&
                        <div className={this.props.classes.messageBox}>
                            <Typography variant="h6">No Data</Typography>
                        </div>
                    }
                </div>

                <Modal open={isAdd} onClose={() => this.setState({isAdd: false})} className={this.props.classes.modalContainer}>
                    <div className={this.props.classes.modal}>
                        <Typography variant="h6">Add GUI Component</Typography>

                        <Divider className={this.props.classes.divider} />

                        <TextField label="Component Name" 
                                    value={newComponent.name} 
                                    onChange={(e) => {this.setState({newComponent:{name: e.target.value}})}}
                                    className={this.props.classes.width100}
                                    autoFocus={true} />

                        <div className={clsx(this.props.classes.buttonContainer, this.props.classes.noMargin, this.props.classes.spaceAbove)}>
                            <Button variant="contained" color="primary" onClick={() => this.addComponent()}>
                                <AddIcon />
                                Add
                            </Button>
                        </div>
                    </div>
                </Modal>
            </>
        )
    }
}

export default withStyles(styles)(GuiComponentContainer);