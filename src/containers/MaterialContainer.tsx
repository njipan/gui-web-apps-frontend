import React from 'react';
import axios from './../shared/modules/axios';
import Swal from 'sweetalert2';

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import {withStyles} from "@material-ui/core";

import AddIcon from '@material-ui/icons/Add';

import PdfViewer from '../components/PdfViewer';

const styles = {
    content: {
        height: "100vh",
        borderRadius: 0,
        position : "relative" as "relative",
        backgroundColor: '#bdc3c7'
    },
    message: {
        margin: 0,
        padding: '20px 10px'
    },
    navigationWrapper: {
        borderBottom: '2px solid #bdc3c7',
        display: 'flex',
        paddingLeft: '20px',
        flexDirection: "column" as "column",
        cursor: 'pointer' as 'pointer',
        backgroundColor: 'white'
    },
    navigationText: {
        margin: '10px 0 5px 0'
    },
    form: {
        display: 'flex',
        flexWrap: 'wrap' as 'wrap',
        margin: '10px 0',
        padding: '0 10px'
    },
    formControl: {
        width: '100%',
        margin: '5px 0'
    },
    gridContainer: {
        borderTop: '1px solid #ccc'
    },
    navigationContainer: {
        maxHeight: '100%',
        overflowY: 'auto' as 'auto'
    },
    spacingv5px: {
        marginTop: '5px',
        marginBottom: '5px'
    }
};

interface ILanguage {
    id: number;
    name: string;
}

interface IModule{
    id: number;
    name: string;
    filePath: string;
}

interface INavigation {
    id: number;
    name: string;
    physical_page: number;
    logical_page: number;
}

const instance = axios;

class MaterialContainer extends React.Component<any, any> {
    constructor(props: any){
        super(props);
        this.state = {
            programmingLanguages: [],
            navigations: [],
            activeLanguage: '',
            modules: [],
            activeModule: '',
            jumpPage: 1,
            filePath: ''
        };
    }

    componentDidMount = () => {
        instance.get('/programming-language').then(({data}) => {
            this.setState({
                programmingLanguages: data as ILanguage
            });
        }).finally(() => {
            Swal.close();
        });
    }

    onLanguageChange = (languageId: any) => {
        instance.get(`/programming-module/get-by-programming-id/${languageId}`).then(({data}) => {
            this.setState({
                activeLanguage: languageId,
                modules: data as IModule,
                activeModule: ''
            });
        });
    }

    onModuleChange = (moduleId: any) => {
        instance.get(`/module-navigation/get-by-module-id/${moduleId}`).then(({data}) => {
            this.setState({
                navigations: data as INavigation
            }, () => {
                instance.get(`/programming-module/${moduleId}`).then(({data}) => {
                    this.setState({
                        activeModule: moduleId,
                        filePath: data.file_path as string
                    });
                });
            });
        });
    }

    onClickNavigation = (page: number) => {
        this.setState({
            jumpPage: page
        }, () => {
            this.setState({
                jumpPage: -1
            });
        });
    }

    render = () => {
        const { filePath } = this.state;
        return (
            <>
                <form className={this.props.classes.form}>
                    <FormControl className={this.props.classes.formControl}>
                        <InputLabel htmlFor="select-programming-language">Programming Language</InputLabel>
                        <Select value={this.state.activeLanguage} onChange={(e) => this.onLanguageChange(e.target.value)} inputProps={{
                            id: 'select-programming-language'
                        }}>
                            <MenuItem value="" disabled selected>-- Select Programming Language --</MenuItem>
                            {this.state.programmingLanguages.map((v: ILanguage) => (
                                <MenuItem value={v.id} key={v.id}>{v.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {this.state.activeLanguage !== '' && 
                    <FormControl className={this.props.classes.formControl}>
                        <InputLabel htmlFor="select-module">Module</InputLabel>
                        <Select value={this.state.activeModule} onChange={(e) => this.onModuleChange(e.target.value)} inputProps={{
                            id: 'select-module'
                        }}>
                            <MenuItem value="" disabled selected>-- Select Module --</MenuItem>
                            {this.state.modules.map((v: IModule) => (
                                <MenuItem value={v.id} key={v.id}>{v.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>}
                </form>
                {this.state.activeModule !== '' && 
                <>
                    <Divider />

                    <Grid container justify="flex-end">
                        <Chip className={this.props.classes.spacingv5px} 
                            color="primary" 
                            variant="outlined"
                            icon={<AddIcon />} 
                            label="Take Quiz"
                            clickable={true}
                            onClick={() => console.log('asu')}
                        />
                    </Grid>

                    <Divider />
                    <Grid container spacing={0} className={this.props.classes.gridContainer}>
                        <Grid item xs={3} className={this.props.classes.navigationContainer}>
                            <Paper className={this.props.classes.content}>
                                {this.state.navigations.length < 1 && 
                                    <div>
                                        <h3 className={this.props.classes.message}>No navigation available</h3>
                                    </div>
                                }
                                {this.state.navigations.length > 0 &&
                                    this.state.navigations.map((v: INavigation, i: any) => 
                                        <div key={i} className={this.props.classes.navigationWrapper} onClick={() => this.onClickNavigation(v.physical_page)}>
                                            <h5 className={this.props.classes.navigationText}>{v.name}</h5>
                                            <small className={this.props.classes.navigationText}>Page {v.physical_page} (Page {v.logical_page} in PDF)</small>
                                        </div>
                                    )
                                }
                            </Paper>
                        </Grid>
                        <Grid item xs={9}>
                            <Paper className={this.props.classes.content}>
                                <PdfViewer file={filePath} page={this.state.jumpPage} />
                            </Paper>
                        </Grid>
                    </Grid>
                </>
                }
            </>
        );
    }
}

export default withStyles(styles)(MaterialContainer);