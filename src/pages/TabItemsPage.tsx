import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Route, BrowserRouter as Router, Link, Redirect } from 'react-router-dom';
import TakeQuizContainer from "../containers/TakeQuizContainer";
import GuiContainer from "../containers/GuiContainer";
import MaterialContainer from '../containers/MaterialContainer';
import GuiPreviewContainer from '../containers/GuiPreviewContainer';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 0,
        },
        paper: {
            borderBottomLeftRadius : 0,
            borderBottomRightRadius : 0,
            padding: theme.spacing(1),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
        content: {
            height: '100vh',
            borderRadius: 0
        },
        link: {
            textDecoration: 'none'
        },
        tabs: {
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
        }
    }),
);

let EmptyPath = () => {
    return (
        <Redirect to="/gui" />
    );
}

export default function TabItemsPage() {
    const classes = useStyles();

    return (
        <div>
            <Router>
                <Grid container spacing={0} className={classes.tabs}>
                    <Grid item xs={1}>
                        <Link to="/gui" className={classes.link}>
                            <Paper className={classes.paper}>GUI</Paper>
                        </Link>
                    </Grid>
                    <Grid item xs={1}>
                        <Link to="/material" className={classes.link}>
                            <Paper className={classes.paper}>Material</Paper>
                        </Link>
                    </Grid>
                </Grid>

                <Route path="/preview" component={GuiPreviewContainer} />
                <Route exact path="/gui" component={GuiContainer} />
                <Route exact path="/material" component={ MaterialContainer } />
                <Route exact path="/" component={ EmptyPath } />
            </Router>
        </div>
    );
}