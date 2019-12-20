import React from 'react';
import { ProgrammingModuleApi } from '../apis';
import IQuestion from '../shared/models/IQuestion';
import { QuestionType } from '../shared/enums';

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
    Fab,
    Button,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

const styles = {
    titleTextHeader : {
        margin: "10px 0"
    },
    formControl : {
        margin: "8px 0",
        width: "100%"
    }
};

class QuizDetailContainer extends React.Component <any, any>{
    api: any;

    constructor(props: any){
        super(props);
        this.api = new ProgrammingModuleApi();
        this.state = {
            module_id : props.match.params.module_id,
            module : null,
            form : {
                questions : {},
                selectedType : 'default',
            }
        };
    }

    async componentDidMount(){
        this.api.get(this.state.module_id).then((response : any) => {
            this.setState({ module : response.data});
        });
    }

    insertQuestion = () => {
        const question = this.makeQuestion();
        const questions = this.state.form.questions;
        questions[`q-${Date.now()}`] = question;
        this.setState({ form : { questions }});
    }

    makeQuestion() : IQuestion {
        return {
            text : '',
            programming_module_id : this.state.module_id
        };
    }

    typeChanged = (type: string) => {
        const form = { ...this.state.form,  selectedType : type  };
        this.setState({ form });
    }

    render() {
        
        return (
            <Grid container direction="row">
                { 
                    this.state.module != null && 
                    <>
                        <Grid item xs={12}>
                            <Typography variant="h5">
                                { this.state.module.name }
                            </Typography>
                            <Divider className={ this.props.classes.titleTextHeader }/>
                        </Grid>
                        <Grid item xs={12}>
                            { 
                                typeof this.state.form.questions !== 'undefined' && Object.keys(this.state.form.questions).map(( key : string, idx : number) => (
                                    <Grid item xs={12} { ...key } >
                                        <Grid item xs={1}><h6> { (idx + 1) } </h6></Grid>
                                        <Grid item xs={10}><h6> { key } </h6></Grid>
                                    </Grid>
                                )) 
                            }
                        </Grid>
                         <Grid item xs={12}>
                            <Grid container spacing={1} alignItems="center">
                                <Grid item xs={2}>
                                    <FormControl className = { this.props.classes.formControl }>
                                        <InputLabel htmlFor="question-type">Question Type</InputLabel>
                                        <Select value={ this.state.form.selectedType } onChange={(e) => this.typeChanged(e.target.value + '') }>
                                            <MenuItem value={'-'} key="default" selected disabled><em>Choose Type</em></MenuItem>
                                            {
                                                Object.values(QuestionType).map( (type, idx) => (
                                                    <MenuItem value={type} key={idx}>
                                                        { type.replace('_', ' ')}
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={1}>
                                    <Fab color="primary" aria-label="add" size="small" onClick={ this.insertQuestion }>
                                        <AddIcon />
                                    </Fab>
                                </Grid>
                            </Grid>
                        </Grid>
                    </>
                }
            </Grid>
        )
    }
}

export default withStyles(styles)(QuizDetailContainer);