import React from 'react';
import clsx from 'clsx';
import { Route, BrowserRouter as Router, Link, Redirect } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme, createMuiTheme } from '@material-ui/core/styles';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import CodeSharpIcon from '@material-ui/icons/CodeSharp';
import MenuBookSharpIcon from '@material-ui/icons/MenuBookSharp';
import BookmarksSharpIcon from '@material-ui/icons/BookmarksSharp';
import DashboardSharpIcon from '@material-ui/icons/DashboardSharp';
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';
import BuildIcon from '@material-ui/icons/Build';

import ProgrammingLanguageContainer from '../containers/ProgrammingLanguageContainer';
import ProgrammingModuleContainer from '../containers/ProgrammingModuleContainer';
import ModuleNavigationContainer from '../containers/ModuleNavigationContainer';
import DashboardContainer from '../containers/DashboardContainer';
import ProgrammingSnippetContainer from '../containers/ProgrammingSnippetContainer';
import GuiComponentContainer from '../containers/GuiComponentContainer';
import ProgrammingComponentContainer from '../containers/ProgrammingComponentContainer';
import GuiPropertyContainer from '../containers/GuiPropertyContainer';
import ProgrammingPropertyContainer from '../containers/ProgrammingPropertyContainer';

const drawerWidth = 300;

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        menuBtn: {
            marginRight: theme.spacing(2)
        },
        appBar: {
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen
            })
        },
        appBarShift: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen
            })
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0
        },
        drawerPaper: {
            width: drawerWidth
        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 3),
            ...theme.mixins.toolbar,
            justifyContent: 'flex-start',
        },
        main: {
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: 0,
        },
        mainShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: drawerWidth,
        },
        link: {
            color: 'inherit',
            textDecoration: 'none'
        },
        divider: {
            margin: '10px 0'
        }
    })
);

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#1a237e'
        },
        secondary: {
            main: '#b71c1c'
        }
    }
});

const manageRoutes = [
    {
        name: 'Dashboard',
        route:  '/dashboard',
        icon: <DashboardSharpIcon />,
        component: DashboardContainer,
        isShow: true,
        showDividerAfter: true
    },
    {
        name: 'Programming Language',
        route: '/programming-language',
        icon: <CodeSharpIcon />,
        component: ProgrammingLanguageContainer,
        isShow: true,
        showDividerAfter: false
    },
    {
        name: 'Programming Module',
        route: '/programming-module',
        icon: <MenuBookSharpIcon />,
        component: ProgrammingModuleContainer,
        isShow: true,
        showDividerAfter: false
    },
    {
        name: 'Module Navigation',
        route: '/module-navigation',
        icon: <BookmarksSharpIcon />,
        component: ModuleNavigationContainer,
        isShow: true,
        showDividerAfter: true
    },
    {
        name: 'Programming Snippet',
        route: '/programming-language/:id/snippet',
        component: ProgrammingSnippetContainer,
        isShow: false,
        showDividerAfter: false
    },
    {
        name: 'GUI Component',
        route: '/gui-component',
        icon: <DeveloperBoardIcon />,
        component: GuiComponentContainer,
        isShow: true,
        showDividerAfter: false
    },
    {
        name: 'Programming Component',
        route: '/gui-component/:id/mapping',
        component: ProgrammingComponentContainer,
        isShow: false,
        showDividerAfter: false
    },
    {
        name: 'GUI Property',
        route: '/gui-property',
        icon: <BuildIcon />,
        component: GuiPropertyContainer,
        isShow: true,
        showDividerAfter: false
    },
    {
        name: 'Programming Property',
        route: '/gui-property/:id/mapping',
        component: ProgrammingPropertyContainer,
        isShow: false,
        showDividerAfter: false
    }
];

let ManagePage = (props: any) => {
    const { match } = props;
    const classes = useStyles();
    const [isOpen, setOpen] = React.useState(false);

    const toggleDrawer = () => {
        setOpen(!isOpen);
    }
    
    return (
        <div>
            <ThemeProvider theme={theme}>
                <Router>
                    <AppBar position="absolute" className={clsx(classes.appBar, {
                        [classes.appBarShift]: isOpen
                    })}>
                        <Toolbar>
                            {!isOpen && <IconButton edge="start" color="inherit" className={classes.menuBtn} onClick={() => toggleDrawer()}>
                                <MenuIcon />
                            </IconButton>}
                        </Toolbar>
                    </AppBar>
                    <Drawer variant="persistent" anchor="left" open={isOpen} className={classes.drawer} classes={{paper: classes.drawerPaper}}>
                        <div className={classes.drawerHeader}>
                            {isOpen && <IconButton edge="start" onClick={() => toggleDrawer()}>
                                <CloseIcon />
                            </IconButton>}
                        </div>
                        <Divider />
                        <List>
                            {manageRoutes.map((v) => (
                                v.isShow && 
                                    <div key={v.name}>
                                        <Link to={match.url + v.route} className={classes.link} onClick={() => setOpen(false)}>
                                            <ListItem button>
                                                {typeof(v.icon) !== 'undefined' && 
                                                    <ListItemIcon>
                                                        {v.icon}
                                                    </ListItemIcon>
                                                }
                                                <ListItemText primary={v.name} />
                                            </ListItem>
                                        </Link>
                                        {v.showDividerAfter &&
                                            <>
                                                <Divider className={classes.divider} />
                                            </>
                                        }
                                    </div>
                            ))}
                        </List>
                    </Drawer>
                    <main className={clsx(classes.main, {
                        [classes.mainShift]: isOpen
                    })} onClick={() => setOpen(false)}>
                        <div className={classes.drawerHeader}></div>
                        {manageRoutes.map((v) => (
                            <Route exact key={v.name} path={match.path + v.route} component={v.component} />
                        ))}
                        <Route exact path={match.path} component={() => <Redirect to={match.path + manageRoutes[0].route} />} />
                    </main>
                </Router>
            </ThemeProvider>
        </div>
    );
}

export default ManagePage;