import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
    Paper
} from '@material-ui/core';
import TakeQuizContainer from '../containers/TakeQuizContainer';


export default function QuizPage(props: any) {

    return (
        <div>
            <TakeQuizContainer { ...props }/>
        </div>
    );
}