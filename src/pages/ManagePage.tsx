import React from 'react';
import clsx from 'clsx';
import { Route, BrowserRouter as Router, Link, Redirect } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
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

import ProgrammingLanguageContainer from '../containers/ProgrammingLanguageContainer';
import ProgrammingModuleContainer from '../containers/ProgrammingModuleContainer';
import ModuleNavigationContainer from '../containers/ModuleNavigationContainer';
import DashboardContainer from '../containers/DashboardContainer';

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
        }
    })
);

const manageRoutes = [
    {
        name: 'Dashboard',
        route:  '/dashboard',
        icon: <DashboardSharpIcon />,
        component: DashboardContainer
    },
    {
        name: 'Programming Language',
        route: '/programming-language',
        icon: <CodeSharpIcon />,
        component: ProgrammingLanguageContainer
    },
    {
        name: 'Programming Module',
        route: '/programming-module',
        icon: <MenuBookSharpIcon />,
        component: ProgrammingModuleContainer
    },
    {
        name: 'Module Navigation',
        route: '/module-navigation',
        icon: <BookmarksSharpIcon />,
        component: ModuleNavigationContainer
    }
];

let ManagePage = (props: any) => {
    const { match } = props;
    const classes = useStyles();
    const [isOpen, setOpen] = React.useState(false);

    const toggleDrawer = () => {
        setOpen(!isOpen);
    }

    // const menuClicked = (menu: string) => {
    //     if(activeMenu !== menu){
    //         setActiveMenu(menu);
    //         setOpen(false);
    //     }
    // }

    // let path = location.pathname.substr(location.pathname.lastIndexOf('/'));
    // let activeRoute = manageRoutes.filter((v) => {
    //     return v.route === path;
    // });
    // if(activeRoute.length > 0) menuClicked(activeRoute[0].name);
    
    return (
        <div>
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
                            <Link to={match.url + v.route} key={v.name} className={classes.link} onClick={() => setOpen(false)}>
                                <ListItem button>
                                    <ListItemIcon>
                                        {v.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={v.name} />
                                </ListItem>
                            </Link>
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
        </div>
    );
}

export default ManagePage;