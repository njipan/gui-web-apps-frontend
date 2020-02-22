import React from 'react';
import axios from './../shared/modules/axios';
import Swal from 'sweetalert2';
import clsx from 'clsx';
import Moment from 'react-moment';
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
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';

import AddIcon from '@material-ui/icons/Add';
import ListIcon from '@material-ui/icons/List';
import DeleteIcon from '@material-ui/icons/Delete';
import AddBoxIcon from '@material-ui/icons/AddBox';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import EditIcon from '@material-ui/icons/Edit';

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
    }
};

const instance = axios;

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

                <Grid container className={this.props.classes.card}>
                    <Chip icon={<AddBoxIcon className={this.props.classes.icon} />} 
                        label="Create" 
                        clickable={true} 
                        variant="outlined" 
                        color="primary" 
                        onClick={() => this.setState({ isAdd: true })} 
                    />
                </Grid>

                {/* <Divider className={this.props.classes.divider} /> */}

                <div>
                    {
                        components.length > 0 &&
                        components.map((v: any, i: any) => (
                            <Card key={i} className={this.props.classes.card}>
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
                                                <Link to={`${this.props.match.path}/${v.id}/mapping-class`} className={this.props.classes.link}>
                                                    <Chip icon={<ListIcon className={this.props.classes.icon} />} 
                                                        label="Mapping Class" 
                                                        variant="outlined" 
                                                        color="primary" 
                                                        className={clsx(this.props.classes.marginRight10px)} 
                                                        clickable={true}
                                                    />
                                                </Link> 
                                                <Link to={`${this.props.match.path}/${v.id}/mapping-property`} className={this.props.classes.link}>
                                                    <Chip icon={<ListIcon className={this.props.classes.icon} />} 
                                                        label="Mapping Property" 
                                                        variant="outlined" 
                                                        color="primary" 
                                                        className={clsx(this.props.classes.marginRight10px)} 
                                                        clickable={true}
                                                    />
                                                </Link>
                                                <Chip icon={<DeleteIcon className={this.props.classes.icon} />} 
                                                    label="Delete" 
                                                    variant="outlined" 
                                                    color="secondary" 
                                                    className={clsx(this.props.classes.marginRight10px)} 
                                                    clickable={true}
                                                    onClick={() => this.deleteComponent(v.id, v.name)}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Card>
                        ))
                    }
                    {/* {components.length > 0 &&
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
                                                <Link to={`${this.props.match.path}/${v.id}/mapping-class`} className={this.props.classes.link}>
                                                    <Button variant="contained" color="primary" className={clsx(this.props.classes.marginRight10px)}>
                                                        <ListIcon />
                                                        Mapping Class
                                                    </Button>
                                                </Link>
                                                <Link to={`${this.props.match.path}/${v.id}/mapping-property`} className={this.props.classes.link}>
                                                    <Button variant="contained" color="primary" className={clsx(this.props.classes.marginRight10px)}>
                                                        <ListIcon />
                                                        Mapping Property
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
                    } */}

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