import React from 'react';
import ProgrammingLanguageApi from '../apis/ProgrammingLanguageApi';

import { 
    Card,
    FormControl, 
    InputLabel, 
    Input, 
    IconButton,
    Typography,
    Divider,
    withStyles,
    Select,
    MenuItem,
    Grid,
    Button,
    Table,
    TextField,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    Box,
    Paper,
    Badge,
    Chip
} from '@material-ui/core';

import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import CodeIcon from '@material-ui/icons/Code';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddBoxIcon from '@material-ui/icons/AddBox';
import SearchIcon from '@material-ui/icons/Search';
import DeveloperModeIcon from '@material-ui/icons/DeveloperMode';
import AddIcon from '@material-ui/icons/Add';


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
    },
    btnCreate: {
        marginLeft : '16px'
    },
    searchWrapper: {
        margin: '16px 0'
    },
    quizItemWrapper : {
        margin: '16px 0'
    },
    quizItem : {
        padding: '16px',
    },
    quizChip : {
        marginRight: '8px',
    },
    quizIcon : {
        fontSize : 16,
        marginLeft : '12px'
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

    goToNewQuizPage = () => {
        this.props.history.push(`/admin/quizzes/create`);
    }

    goToManageQuiz = ( id : any ) => {
        this.props.history.push(`/admin/quizzes/${id}`);
    }

    render() {

        return (
            <div>
                <Grid container spacing={1} alignItems="center" justify="space-between" direction="row">
                    <Typography variant="h6" className={ this.props.classes.titleTextHeader }>
                        Manage Quiz
                    </Typography>
                </Grid>
                <Divider />
                <form style={{ margin: '16px 0' }}>
                    <Grid container spacing={1} justify="space-between" alignItems="center">
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                            <Chip 
                                label="Create" 
                                color="primary" 
                                icon={ <AddBoxIcon className={ this.props.classes.quizIcon} /> } 
                                className={ this.props.classes.quizChip }
                                variant="outlined"
                                onClick={ this.goToNewQuizPage }
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                            <Grid container spacing={1} justify="flex-end">
                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <TextField
                                            style={ this.props.classes.filterWrapper }
                                            placeholder="Search"
                                            fullWidth
                                            margin="normal"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={4}>
                                    <FormControl fullWidth>
                                        <InputLabel>Language</InputLabel>
                                        <Select>
                                            <MenuItem value={20}>C</MenuItem>
                                            <MenuItem value={30}>C++</MenuItem>
                                            <MenuItem value={10}>JAVA</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={2} alignItems="center" style={{ display: 'flex'}}>
                                    <Chip 
                                        label="Filter" 
                                        color="default" 
                                        icon={ <SearchIcon className={ this.props.classes.quizIcon} /> } 
                                        className={ this.props.classes.quizChip }
                                        variant="outlined"
                                        onClick={ () => { console.log('X'); }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                        
                    
                </form>
                <div>
                    {
                        [0].map((item) => (
                            <Card className={ this.props.classes.quizItemWrapper }>
                            <Grid container spacing={2} direction="column" className={this.props.classes.quizItem}>
                                <Grid item xs={12} sm>
                                    <Typography variant="h6" gutterBottom>
                                        Basic Component GUI
                                    </Typography>
                                </Grid>
                                <Grid container direction="row">
                                    <Grid item xs sm={6} md={6}>
                                        <Grid container direction="row">
                                            <Chip 
                                                label="10 Jan 2019" 
                                                color="default" 
                                                icon={ <CalendarTodayIcon className={ this.props.classes.quizIcon} /> } 
                                                className={ this.props.classes.quizChip }
                                            />
                                            <Chip 
                                                label="JAVA" 
                                                color="primary" 
                                                icon={ <CodeIcon className={ this.props.classes.quizIcon} />  } 
                                                className={ this.props.classes.quizChip }
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item xs sm={6} md={6}>
                                        <Grid container direction="row" justify="flex-end">
                                            <Chip 
                                                label="Edit" 
                                                color="primary" 
                                                icon={ <EditIcon className={ this.props.classes.quizIcon} />  } 
                                                className={ this.props.classes.quizChip }
                                                variant="outlined"
                                                onClick={ () => { console.log('X'); }}
                                            />
                                            <Chip 
                                                label="Remove"
                                                color="secondary" 
                                                icon={ <DeleteIcon className={ this.props.classes.quizIcon} /> } 
                                                className={ this.props.classes.quizChip }
                                                variant="outlined"
                                                onClick={ () => { console.log('X'); }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Card>
                        ))
                    }
                </div>
                
                {/* {
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
                } */}
            </div>
        )
    }
}

export default withStyles(styles)(QuizContainer);