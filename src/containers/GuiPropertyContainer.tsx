import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import clsx from 'clsx';
import Moment from 'react-moment';

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
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';

import red from '@material-ui/core/colors/red';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import ListIcon from '@material-ui/icons/List';
import AddBoxIcon from '@material-ui/icons/AddBox';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import EditIcon from '@material-ui/icons/Edit';

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
    link: {
        color: 'inherit',
        textDecoration: 'none'
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

                { properties.length > 0 ?
                    properties.map((v: any, i: any) => (
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
                                            <Link to={`${this.props.match.path}/${v.id}/mapping`} className={this.props.classes.link}>
                                                <Chip icon={<ListIcon className={this.props.classes.icon} />} 
                                                    label="Mapping Snippet" 
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
                                                onClick={() => this.deleteProperty(v.id, v.name)}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Card>
                    ))
                    // <Table>
                    //     <TableHead>
                    //         <TableRow>
                    //             <TableCell>Property Name</TableCell>
                    //             <TableCell>Action</TableCell>
                    //         </TableRow>
                    //     </TableHead>
                    //     <TableBody>
                    //         {
                    //             properties.map((v: IProperty, i: any) => (
                    //                 <TableRow key={i}>
                    //                     <TableCell>{v.name}</TableCell>
                    //                     <TableCell>
                    //                         <div>
                    //                             <Link to={`${this.props.match.path}/${v.id}/mapping`}>
                    //                                 <Button variant="contained" color="primary" className={this.props.classes.marginRight10px}>
                    //                                     <ListIcon />
                    //                                     Mapping
                    //                                 </Button>
                    //                             </Link>
                    //                             <Button variant="contained" color="secondary" onClick={() => this.deleteProperty(v.id, v.name)}>
                    //                                 <DeleteIcon />
                    //                                 Delete
                    //                             </Button>
                    //                         </div>
                    //                     </TableCell>
                    //                 </TableRow>
                    //             ))
                    //         }
                    //     </TableBody>
                    // </Table>

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