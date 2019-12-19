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
    Button,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow
} from '@material-ui/core';

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
            questions : {},
            module : null,
            form : {
                questions : {},
                selectedType : null,
            }
        };
    }

    async componentDidMount(){
        this.api.get(this.state.module_id).then((response : any) => {
            this.setState({ module : response.data});
        });
    }

    insertQuestion = () => {
        const questions = this.state.form.questions;
        questions[Date.now()] = this.makeQuestion();
        this.setState({ form : { questions }});
    }

    makeQuestion() : IQuestion {
        return {
            text : '',
            programming_module_id : this.state.module_id,
        };
    }

    typeChanged = (type: string) => {
        this.setState({ form : { selectedType : type } });
    }

    render() {
        
        return (
            <Grid container direction="row">
                { 
                    this.state.module != null && 
                    <>
                        <Grid item xs={12} sm={12}>
                            <Typography variant="h5">
                                { this.state.module.name }
                            </Typography>
                            <Divider className={ this.props.classes.titleTextHeader }/>
                        </Grid>
                         <Grid item xs={12} sm={12}>
                            {/* { Object.keys(this.state.form.questions).length > 0 && 
                            <Grid container>
                                <Grid item xs={12} sm={12}>
                                    1. Question    
                                </Grid> 
                            </Grid>
                            } */}
                            <div>
                                <Grid item xs={4}>
                                <Select value={ this.state.selectedType } 
                                    onChange={(e) => this.typeChanged(e.target.value + '') }>
                                        <MenuItem value={'-'} key={-1} selected disabled>Choose Type</MenuItem>
                                    {
                                        Object.values(QuestionType).map( (type, idx) => (
                                            <MenuItem value={type} key={idx}>{type.replace('_', ' ')}</MenuItem>
                                        ))
                                    }
                                </Select>
                                </Grid>
                                <Grid item xs={3}>
                                    <Button variant="contained" color="primary" >Insert Question</Button>
                                </Grid>
                            </div>
                        </Grid>
                    </>
                }
            </Grid>
        )
    }
}

export default withStyles(styles)(QuizDetailContainer);