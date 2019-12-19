import React from 'react';
import ProgrammingLanguageApi from '../apis/ProgrammingLanguangeApi';

import { 
    FormControl, 
    InputLabel, 
    Input, 
    Typography,
    Divider,
    withStyles,
    Select,
    MenuItem,
    Grid,
    Button,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow
} from '@material-ui/core';

const styles = {
    content: {
        height: "100vh",
        borderRadius: 0,
        position : "relative" as "relative",
        userSelect: 'none' as 'none'
    },
    center:{
        margin: "0 auto",
    },
    elementContent:{
        position: "absolute" as "absolute",
        top: 10,
        left: 10
    },
    titleTextHeader : {
        margin: "10px 0"
    },
    formControl : {
        margin: "8px 0",
        width: "100%"
    }
};

class QuizContainer extends React.Component <any, any>{
    api: any;

    constructor(props: any){
        super(props);
        this.api = new ProgrammingLanguageApi();
        this.state = {
            prog_languages : [],
            modules : [],
            form : {
                selectedLanguage : {}
            }
        };
    }

    async componentDidMount(){
        this.api.all().then((response: any) => {
            this.setState({ prog_languages : response.data })
        })
    }

    onLanguageChanged = (langId: any) => {
        const form = { ...this.state.form, selectedLanguage : langId };
        this.setState({ form });
    }

    searchModuleClicked = () => {
        this.api.getModules(this.state.form.selectedLanguage).then((response: any) => {
            this.setState({ modules : response.data })
        });
    }

    goToManageQuiz = ( id : any ) => {
        this.props.history.push(`/admin/quizzes/${id}`);
    }

    render() {
        
        return (
            <div>
                <div>
                    <Typography variant="h6" className={ this.props.classes.titleTextHeader }>Manage Quiz</Typography>
                    <Divider/>
                </div>
                <div>
                    <form>
                        <Grid container spacing={1} direction="column">
                            <Grid container spacing={2} direction="row" xs={8}>
                                <Grid item xs={4}>
                                    <FormControl className = { this.props.classes.formControl }>
                                        <InputLabel htmlFor="programming-language">Programming Language</InputLabel>

                                        <Select value={this.state.form.selectedLanguage} inputProps={{
                                            id: 'programming-language'
                                        }} onChange={ (e) => this.onLanguageChanged(e.target.value) }>
                                            <MenuItem value="-1" selected disabled>-- Select Programming Language --</MenuItem>
                                            {this.state.prog_languages.map((lang: any) => (
                                                    <MenuItem value={lang.id} key={lang.id}>
                                                        <em>{lang.name}</em>
                                                    </MenuItem>
                                                )
                                            )}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={1} justify="center" alignItems="center" container>
                                    <Button variant="contained" color="primary" onClick={this.searchModuleClicked}>Search</Button>
                                </Grid>
                            </Grid>
                            {
                                this.state.modules.length > 0 && 
                                <Grid container spacing={1} direction="row">
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Module Name</TableCell>
                                                <TableCell>File</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {this.state.modules.map(( module : any) => (
                                                <TableRow key={module.id}>
                                                    <TableCell>{module.name}</TableCell>
                                                    <TableCell>
                                                        <Button variant="contained" color="secondary">Download</Button>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button variant="contained" color="primary" onClick={ () => this.goToManageQuiz(module.id) }>Manage Quiz</Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Grid>
                            }
                        </Grid>
                    </form>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(QuizContainer);