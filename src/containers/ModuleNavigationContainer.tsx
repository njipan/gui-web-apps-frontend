import React from 'react';
import axios from 'axios';
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
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import AddBoxIcon from '@material-ui/icons/AddBox';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import EditIcon from '@material-ui/icons/Edit';
import MenuBookIcon from '@material-ui/icons/MenuBook';

import red from '@material-ui/core/colors/red';

const instance = axios.create({
    baseURL: 'http://localhost:8000/api'
});

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
    width100: {
        width: '100%'
    },
    littleSpaceTop: {
        marginTop: '10px'
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
    noMargin: {
        margin: '0'
    },
    tableWrapper: {
        height: '400px',
        overflow: 'auto'
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
};

class ModuleNavigationContainer extends React.Component<any, any> {
    constructor(props: any){
        super(props);
        this.state = {
            selectedLanguage: -1,
            selectedModule: -1,
            languages: [],
            modules: [],
            navigations: [],
            isAdd: false,
            newNavigations: [
                {
                    name: '',
                    physical_page: 0,
                    logical_page: 0
                }
            ]
        };
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

    onLanguageChange = (newData: any) => {
        instance.get(`/programming-module/get-by-programming-id/${newData}`).then(({data}) => {
            this.setState({
                modules: data,
                selectedModule: -1,
                selectedLanguage: newData,
                newNavigations: [
                    {
                        name: '',
                        physical_page: 0,
                        logical_page: 0
                    }
                ]
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

    onModuleChange = (newData: any) => {
        instance.get(`/module-navigation/get-by-module-id/${newData}`).then(({data}) => {
            this.setState({
                selectedModule: newData,
                navigations: data,
                newNavigations: [
                    {
                        name: '',
                        physical_page: 0,
                        logical_page: 0
                    }
                ]
            })
        }).catch((err) => {
            console.log(err);
            Swal.fire({
                title: 'Error Occurred',
                text: 'Something wrong with service',
                type: 'error'
            });
        });
    }

    getNavigationOnly = () => {
        instance.get(`/module-navigation/get-by-module-id/${this.state.selectedModule}`).then(({data}) => {
            this.setState({
                navigations: data
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

    addNewNavigation = () => {
        let oldNewNav = this.state.newNavigations;
        oldNewNav.push({
            name: '',
            physical_page: 0,
            logical_page: 0
        });

        this.setState({
            newNavigations: oldNewNav
        });
    }

    deleteNewNavigation = (idx: number) => {
        let oldNewNav = this.state.newNavigations;
        if(oldNewNav.length > 1){
            oldNewNav.splice(idx, 1);

            this.setState({
                newNavigations: oldNewNav
            });
        }
    }

    onChange = (newValue:any, idx: number, prop: string) => {
        let oldNewNav = this.state.newNavigations;
        oldNewNav[idx][prop] = newValue;

        this.setState({
            newNavigations: oldNewNav
        });
    }

    addNavigations = () => {
        let data = this.state.newNavigations;
        data.map((v: any) => {
            v['module_id'] = this.state.selectedModule;
            return v;
        });
        data = data.filter((v: any) => {
            return v.name !== '';
        });

        this.setState({
            isAdd: false
        }, () => {
            instance.post('/module-navigation', data).then((response) => {
                this.getNavigationOnly();
                Swal.fire({
                    title: 'Success',
                    text: 'Navigation added successfully',
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
        });
    }

    deleteNavigation = (id: number, name: string) => {
        Swal.fire({
            title: 'Delete Confirmation',
            text: `Are you sure want to delete "${name}"?`,
            type: 'warning',
            showCancelButton: true
        }).then((result) => {
            if(result.value){
                instance.delete(`/module-navigation/${id}`).then((response) => {
                    this.getNavigationOnly();
                    Swal.fire({
                        title: 'Success',
                        text: `"${name}" is deleted`,
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
        return (
            <>
                <Typography variant="h6">Module Navigation</Typography>

                <Divider className={this.props.classes.divider} />

                <FormControl className={this.props.classes.width100}>
                    <InputLabel htmlFor="programming-language">Programming Language</InputLabel>
                    <Select value={this.state.selectedLanguage} inputProps={{
                        id: 'programming-language'
                    }} onChange={(e) => this.onLanguageChange(e.target.value)}>
                        <MenuItem value="-1" selected disabled>-- Select Programming Language --</MenuItem>
                        {this.state.languages.map((v: any) => (
                            <MenuItem value={v.id} key={v.id}>{v.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {this.state.selectedLanguage !== -1 && 
                    <FormControl className={clsx(this.props.classes.width100, this.props.classes.littleSpaceTop)}>
                        <InputLabel htmlFor="programming-module">Programming Module</InputLabel>
                        <Select value={this.state.selectedModule} inputProps={{
                            id: 'programming-module'
                        }} onChange={(e) => this.onModuleChange(e.target.value)}>
                            <MenuItem value="-1" selected disabled>-- Select Programming Module --</MenuItem>
                            {this.state.modules.map((v: any) => (
                                <MenuItem value={v.id} key={v.id}>{v.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                }

                {this.state.selectedModule !== -1 &&
                    <>
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
                    </>
                }

                {
                    this.state.navigations.length > 0 &&
                    this.state.navigations.map((v: any, i: any) => (
                        <Card className={this.props.classes.card} key={i}>
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
                                                className={this.props.classes.marginRight10px}
                                            />
                                            <Chip 
                                                label={`Physical Page ${v.physical_page}`}
                                                color="secondary" 
                                                icon={ <MenuBookIcon className={this.props.classes.icon} /> }
                                                className={this.props.classes.marginRight10px}
                                            />
                                            <Chip 
                                                label={`Logical Page ${v.logical_page}`}
                                                color="primary" 
                                                icon={ <MenuBookIcon className={this.props.classes.icon} /> }
                                                className={this.props.classes.marginRight10px}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item xs sm={6} md={6}>
                                        <Grid container direction="row" justify="flex-end">
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
                                                onClick={() => this.deleteNavigation(v.id, v.name)}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Card>
                    ))
                }

                {this.state.selectedModule !== -1 && this.state.navigations.length < 1 &&
                    <div className={this.props.classes.messageBox}>
                        <Typography variant="h6">No Data</Typography>
                    </div>
                }

                <Modal className={this.props.classes.modalContainer} open={this.state.isAdd} onClose={() => this.setState({isAdd: false})}>
                    <div className={this.props.classes.modal}>
                        <Typography variant="h6">Add Module Navigation</Typography>

                        <Divider className={this.props.classes.divider} />
                        
                        <div className={this.props.classes.buttonContainer}>
                            <Button variant="contained" color="primary" onClick={() => this.addNewNavigation()}>
                                <AddIcon />
                            </Button>
                        </div>

                        <Divider className={this.props.classes.divider} />

                        <div className={this.props.classes.tableWrapper}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Physical Page</TableCell>
                                        <TableCell>Logical Page</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.newNavigations.map((v: any, i: number) => (
                                        <TableRow key={i}>
                                            <TableCell>
                                                <TextField label={`Navigation #${i+1}`} 
                                                    value={this.state.newNavigations[i].name} 
                                                    onChange={(e) => this.onChange(e.target.value, i, 'name')}
                                                    margin="normal"
                                                    className={this.props.classes.width100} />
                                            </TableCell>
                                            <TableCell>
                                                <TextField label={`Physical Page #${i+1}`} 
                                                    value={this.state.newNavigations[i].physical_page} 
                                                    onChange={(e) => this.onChange(e.target.value, i, 'physical_page')}
                                                    margin="normal"
                                                    className={this.props.classes.width100}
                                                    type="number" />
                                            </TableCell>
                                            <TableCell>
                                                <TextField label={`Logical Page #${i+1}`} 
                                                    value={this.state.newNavigations[i].logical_page} 
                                                    onChange={(e) => this.onChange(e.target.value, i, 'logical_page')}
                                                    margin="normal"
                                                    className={this.props.classes.width100}
                                                    /*type="number"*/ />
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="contained" color="secondary" onClick={() => this.deleteNewNavigation(i)}>
                                                    <DeleteIcon />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <Divider className={this.props.classes.divider} />

                        <div className={clsx(this.props.classes.buttonContainer, this.props.classes.noMargin)}>
                            <Button variant="contained" color="primary" onClick={() => this.addNavigations()}>
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

export default withStyles(styles)(ModuleNavigationContainer);