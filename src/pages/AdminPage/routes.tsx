import React from 'react';
import CodeSharpIcon from '@material-ui/icons/CodeSharp';
import MenuBookSharpIcon from '@material-ui/icons/MenuBookSharp';
import BookmarksSharpIcon from '@material-ui/icons/BookmarksSharp';
import DashboardSharpIcon from '@material-ui/icons/DashboardSharp';
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';
import BuildIcon from '@material-ui/icons/Build';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import ProgrammingLanguageContainer from '../../containers/ProgrammingLanguageContainer';
import ProgrammingModuleContainer from '../../containers/ProgrammingModuleContainer';
import ModuleNavigationContainer from '../../containers/ModuleNavigationContainer';
import DashboardContainer from '../../containers/DashboardContainer';
import ProgrammingSnippetContainer from '../../containers/ProgrammingSnippetContainer';
import GuiComponentContainer from '../../containers/GuiComponentContainer';
import ProgrammingComponentContainer from '../../containers/ProgrammingComponentContainer';
import GuiPropertyContainer from '../../containers/GuiPropertyContainer';
import ProgrammingPropertyContainer from '../../containers/ProgrammingPropertyContainer';
import GuiComponentPropertyContainer from '../../containers/GuiComponentPropertyContainer';
import QuizContainer from '../../containers/QuizContainer';
import NewQuizContainer from '../../containers/NewQuizContainer';
import QuizDetailContainer from '../../containers/QuizDetailContainer';
import LogoutContainer from '../../containers/LogoutContainer'; 

const routes = [
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
        showDividerAfter: false
    },
    {
        name: 'New Quiz',
        route: '/quizzes/create',
        icon: <BookmarksSharpIcon />,
        component: NewQuizContainer,
        isShow: false,
        showDividerAfter: true,
    },
    {
        name: 'Programming Snippet',
        route: '/quizzes/:module_id/update',
        component: QuizDetailContainer,
        isShow: false,
        showDividerAfter: false
    },
    {
        name: 'Manage Quiz',
        route: '/quizzes',
        icon: <QuestionAnswerIcon />,
        component: QuizContainer,
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
        route: '/gui-component/:id/mapping-class',
        component: ProgrammingComponentContainer,
        isShow: false,
        showDividerAfter: false
    },
    {
        name: 'GUI Component Property',
        route: '/gui-component/:id/mapping-property',
        component: GuiComponentPropertyContainer,
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
        showDividerAfter: true
    },
    {
        name: 'Logout',
        route: '/logout',
        icon: <ExitToAppIcon />,
        component: LogoutContainer,
        isShow: true,
        showDividerAfter: false,
    }
];

export default routes;