import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

import {withStyles} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';

import red from '@material-ui/core/colors/red';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SaveIcon from '@material-ui/icons/Save';

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
});

interface ILanguage {
    id: number;
    name: string;
    snippet: string;
}

interface IProperty {
    id: number;
    name: string;
    languages: ILanguage[];
}

class ProgrammingPropertyContainer extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            property: {
                languages: []
            }
        };
    }

    componentDidMount = () => {
        this.getProperty();
    }

    getProperty = () => {
        instance.get(`/gui-property/${this.props.match.params.id}`).then(({data}) => {
            let property = data;
            instance.get('/programming-language').then(({data}) => {
                let languages: ILanguage[] = [];
                data.map((v: any) => {
                    let language = property.languages.find((l: any) => {
                        return l.id === v.id;
                    });

                    if(typeof(language) !== 'undefined') {
                        languages.push({
                            id: language.id,
                            name: language.name,
                            snippet: language.pivot.snippet_code
                        });
                    }
                    else {
                        languages.push({
                            id: v.id,
                            name: v.name,
                            snippet: ''
                        });
                    }

                    return v;
                });

                property.languages = languages;
                this.setState({
                    property: property as IProperty
                });
            });
        }).catch(({response}) => {
            const {data} = response;
            Swal.fire({
                title: response.status === 500 ? 'Error Occurred' : 'Failed',
                text: response.status === 500 ? 'Something wrong with service' : data.message,
                type: 'error'
            }).then(() => {
                if(response.status !== 500) {
                    this.props.history.goBack();
                }
            });
        });
    }

    onSnippetChange = (newValue: any, idx: any) => {
        let {property} = this.state;
        property.languages[idx].snippet = newValue;

        this.setState({
            property: property
        });
    }

    saveSnippet = () => {
        const {property} = this.state;
        let data = {
            property_id: property.id,
            languages: property.languages
        };

        console.log(data);

        instance.post('/gui-property/map-to-languages', data).then(({data}) => {
            Swal.fire({
                title: 'Success',
                text: 'Property mapped successfully',
                type: 'success'
            }).then(() => {
                this.props.history.goBack();
            })
        }).catch(({response}) => {
            const {data} = response;
            Swal.fire({
                title: response.status === 400 ? 'Failed' : 'Error Occurred',
                text: response.status === 400 ? data.message : 'Something wrong with service',
                type: 'error'
            });
        });
    }

    render = () => {
        const {property} = this.state;

        return (
            <>
                <IconButton onClick={() => this.props.history.goBack()}>
                    <ArrowBackIcon />
                </IconButton>

                <Divider className={this.props.classes.divider} />

                <Typography variant="h6">{property.name}'s Mapping</Typography>

                <Divider className={this.props.classes.divider} />

                {property.languages.length > 0 ?
                    <>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Language Name</TableCell>
                                    <TableCell>Property Snippet Code</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {property.languages.map((v: ILanguage, i: any) => (
                                    <TableRow key={i}>
                                        <TableCell>{v.name}</TableCell>
                                        <TableCell>
                                            <div>
                                                <TextField label="Property Snippet Code"
                                                            value={v.snippet}
                                                            onChange={(e) => this.onSnippetChange(e.target.value, i)}
                                                            className={this.props.classes.textField} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <FormHelperText>{`Please add "<% ${property.name} %>" for the value`}</FormHelperText>

                        <div className={this.props.classes.buttonContainer}>
                            <Button variant="contained" color="primary" onClick={() => this.saveSnippet()}>
                                <SaveIcon />
                                Save
                            </Button>
                        </div>
                    </>
                :
                    <div className={this.props.classes.messageBox}>
                        <Typography variant="h6">No Language Available</Typography>
                    </div>
                }
            </>
        );
    }
}

export default withStyles(styles)(ProgrammingPropertyContainer);