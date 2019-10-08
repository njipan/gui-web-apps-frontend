import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton'

import SaveIcon from '@material-ui/icons/Save';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const styles = {
    divider: {
        margin: '10px 0'
    },
    textField: {
        width: '100%'
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        margin: '10px 0'
    }
};

const instance = axios.create({
    baseURL: 'http://localhost:8000/api'
})

class ProgrammingComponentContainer extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            languages: [],
            component: {}
        }
    }

    componentDidMount = () => {
        let id = this.props.match.params.id;
        instance.get(`/gui-component/get-component-for-mapping/${id}`).then(({data}) => {
            let component = data;
            let languages: any[] = [];
            instance.get('/programming-language').then(({data}) => {
                console.log(component);
                data.forEach((v: any) => {
                    let language = component.languages.find((l: any) => {
                        return l.id === v.id;
                    });

                    if(typeof(language) === 'undefined'){
                        languages.push({
                            id: v.id,
                            name: v.name,
                            class_name: ''
                        });
                    }
                    else{
                        languages.push({
                            id: language.id,
                            name: language.name,
                            class_name: language.pivot.class_name
                        });
                    }
                });
                
                this.setState({
                    languages: languages,
                    component: component
                });
            });
        }).catch((err) => {
            Swal.fire({
                title: 'Error Occurred',
                text: 'Something wrong with service',
                type: 'error'
            });
        });
    }

    onClassNameChange = (newValue: any, idx: any) => {
        let languages = this.state.languages;
        languages[idx].class_name = newValue;

        this.setState({
            languages: languages
        });
    }

    saveMap = () => {
        let componentId = this.props.match.params.id;

        let data: any = {
            gui_component_id: componentId,
            languages: []
        }

        this.state.languages.map((v: any) => {
            data.languages.push({
                language_id: v.id,
                class_name: v.class_name
            });
            return v;
        });

        instance.post('/gui-component/map-to-languages', data).then(({data}) => {
            Swal.fire({
                title: 'Success',
                text: 'Component mapped succesfully',
                type: 'success'
            }).then(() => {
                this.props.history.goBack();
            });
        }).catch((err) => {
            const {response} = err;
            const {data} = response;

            Swal.fire({
                title: response.status === 400 ? 'Failed' : 'Error Occurred',
                text: response.status === 400 ? data.message : 'Something wrong with service',
                type: 'error'
            });
        });
    } 

    render = () => {
        const {languages, component} = this.state;
        return (
            <>
                <div>
                    <IconButton edge="start" color="inherit" onClick={() => this.props.history.goBack()}>
                        <ArrowBackIcon />
                    </IconButton>
                </div>

                <Divider className={this.props.classes.divider} />

                <Typography variant="h6">{component.name}'s Mapping</Typography>

                <Divider className={this.props.classes.divider} />

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Language Name</TableCell>
                            <TableCell>Component Class Name</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {languages.map((v: any, i: any) => (
                            <TableRow key={i}>
                                <TableCell>{v.name}</TableCell>
                                <TableCell>
                                    <div>
                                        <TextField label="Component Class Name" 
                                        value={languages[i].class_name} 
                                        onChange={(e) => this.onClassNameChange(e.target.value, i)}
                                        margin="normal"
                                        className={this.props.classes.textField} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                
                <div className={this.props.classes.buttonContainer}>
                    <Button variant="contained" color="primary" onClick={() => this.saveMap()}>
                        <SaveIcon />
                        Save
                    </Button>
                </div>
            </>
        );
    }
}

export default withStyles(styles)(ProgrammingComponentContainer);