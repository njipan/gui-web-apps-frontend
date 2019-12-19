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

class QuizDetailContainer extends React.Component <any, any>{
    api: any;

    constructor(props: any){
        super(props);
        this.api = new ProgrammingLanguageApi();
        this.state = {
            module_id : props.match.params.module_id,
            questions : [],
            form : {
                selectedLanguage : {}
            }
        };
    }

    render() {
        
        return (
            <div>
                
            </div>
        )
    }
}

export default withStyles(styles)(QuizDetailContainer);