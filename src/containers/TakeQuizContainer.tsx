import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/styles';
import {
    Grid, 
    Typography, 
    Fab,
    Radio,
    RadioGroup,
    FormControlLabel,
    Paper,
    TextField
} from '@material-ui/core';

import IconButton from '@material-ui/core/IconButton';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    wrapperQuiz : {
        backgroundColor: '#283048',
        width: '100vw', 
        height: '100vh', 
        boxSizing: 'border-box',
    },
    centerXY : {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    question : {
        padding: '20px 32px', 
        borderRadius: '20px !important'
    },
    rounded : {
        borderRadius: '50%'
    },
    textCenter: {
        textAlign: 'center'
    },
    moduleName : {
        margin: '12px 0'
    }
}));

interface WelcomeProp {
    isStarting: boolean;
    onStart: () => any;  
};

const Welcome = (props: WelcomeProp) => {
    const classes = useStyles();

    return (
        <Grid item xs={10} md={10} sm={10} className={ classes.centerXY }>
            <div className={ classes.centerXY } style={{ color: 'white', flexDirection: 'column' }}>
                <Typography variant="h2" color="inherit" style={{ marginBottom: '2em' }}>Basic Component GUI</Typography>
                { 
                !props.isStarting &&
                <Fab variant="extended" style={{ marginLeft: '8px' }} onClick={ props.onStart }>
                    START NOW <ArrowRightAltIcon style={{ marginLeft: '8px' }}/> 
                </Fab> 
                }
            </div>
        </Grid>
    )
} 

function QuestionEssay (props: any) {
    
    const question = () => {
        return (
            <React.Fragment>
                <span>Please make variable with name age and value is 10</span>
                <br />
                <span>var </span>
                <TextField />
                <span> = </span>
                <TextField />
            </React.Fragment>
        );
    }
    
    return (
        <div>
            <Typography variant="subtitle1">
                { question() }
            </Typography>
            
        </div>
    );
}

function QuestionMultipleChoice (props: any) {
    return (
        <div>
            <Typography variant="subtitle1">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima repudiandae facilis earum fugit? Et ullam odit minus quos. Laboriosam hic deserunt inventore ipsum quo. Quas deserunt iusto quis neque error!
            </Typography>
            <RadioGroup aria-label="answer-question" name={`answers-q${ props.number }`} value={12} >
                <FormControlLabel value={12} control={<Radio />} label={ 'AAAAA' } />
                <FormControlLabel value={121} control={<Radio />} label={ 'AAAAA' } />
                <FormControlLabel value={1211} control={<Radio />} label={ 'AAAAA' } />
            </RadioGroup>
        </div>
    );
}
 
export function TakeQuizContainer (props: any) {
    const classes = useStyles();
    
    const [quiz, setQuiz] = useState({});
    const [questions, setQuestions] = useState([]);
    const [isStart, setStart] = useState(true);

    const startQuiz = () => {
        setStart(true);
    }
 
    return (
        <div className={ classes.wrapperQuiz }>
            <Grid container justify="center" alignItems="center"  style={{ height: '100vh', alignItems: 'inherit' }}>
                { 
                !isStart && 
                <Grid item xs={10} md={10} sm={10} className={ classes.centerXY } style={{ color: 'white', flexDirection: 'column' }}>
                    <Typography variant="h2" color="inherit" style={{ marginBottom: '2em' }}>Basic Component GUI</Typography>
                    <Fab variant="extended" style={{ marginLeft: '8px' }} onClick={ startQuiz }>
                        START NOW <ArrowRightAltIcon style={{ marginLeft: '8px' }}/> 
                    </Fab> 
                </Grid>
                }
                {
                isStart &&
                <Grid item xs={10} sm={10} md={10} style={{ color: 'white', display: 'flex' }} direction="column" justify="center">
                    <Paper elevation={0} className={ classes.question }>
                        <Typography variant="h5" style={ { margin: '1.2em 0', textAlign: 'center' } }>
                            Basic Component GUI
                        </Typography>
                        { (false) ?  <QuestionMultipleChoice /> : <QuestionEssay /> }
                        <Grid container justify="flex-end">
                            <Fab variant="extended" style={{ marginLeft: '8px' }} color="primary">
                                NEXT <ArrowRightAltIcon style={{ marginLeft: '8px' }}/> 
                            </Fab>
                            <Fab variant="extended" color="secondary" style={{ marginLeft: '10px' }}>
                                FINISH
                            </Fab> 
                        </Grid>
                    </Paper>
                </Grid>
                }
            </Grid>
        </div>
    );

}

export default TakeQuizContainer;