import React from 'react';
import axios from 'axios';
import clsx from 'clsx';
import Swal from 'sweetalert2';
import AceEditor from 'react-ace';

import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import SaveIcon from '@material-ui/icons/Save';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import 'brace/mode/csharp';
import 'brace/snippets/csharp';
import 'brace/mode/java';
import 'brace/snippets/java';
import 'brace/mode/python';
import 'brace/snippets/python';
import 'brace/theme/monokai';
import 'brace/theme/github';
import "brace/ext/language_tools";

const styles = {
    spaceAbove: {
        marginTop: '10px'
    },
    textArea: {
        width: '100% !important',
        border: '1px solid black'
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        margin: '10px 0',
        marginRight: '20px'
    },
    textField: {
        width: '100%'
    }
};

const instance = axios.create({
    baseURL: 'http://localhost:8000/api'
});

const modes: any = {
    'C#': 'csharp',
    'Java': 'java',
    'Python': 'python'
}

class ProgrammingSnippetContainer extends React.Component<any, any> {
    constructor(props: any){
        super(props);
        this.state = {
            language: null,
            snippet: '',
            syntax: ''
        };
    }

    componentDidMount = () => {
        const id = this.props.match.params.id
        instance.get(`/programming-language/${id}`).then(({ data }) => {
            this.setState({
                language: data,
                snippet: data.snippet_code,
                syntax: data.add_component_syntax
            });
        });
    }

    saveSnippet = () => {
        let data = {
            'language_id': this.state.language.id,
            'snippet': this.state.snippet,
            'add_component_syntax': this.state.syntax
        };

        instance.post('/programming-language/save-snippet', data).then(({data}) => {
            Swal.fire({
                title: 'Success',
                text: 'Snippet saved successfully',
                type: 'success'
            }).then(() => {
                this.props.history.goBack();
            });
        }).catch((err) => {
            let { response } = err;
            let { data } = response;
            
            Swal.fire({
                title: (response.status === 400 ? 'Failed' : 'Error Occurred'),
                text: (response.status === 400 ? data.message : 'Something wrong with service'),
                type: 'error' 
            });
        });
    }

    render = () => {
        const { language, snippet, syntax } = this.state;

        return (
            <>
                { language != null &&
                    <>
                        <div>
                            <IconButton edge="start" color="inherit" onClick={() => this.props.history.goBack()}>
                                <ArrowBackIcon />
                            </IconButton>
                        </div>
                        <Divider className={clsx(this.props.classes.spaceAbove)} />
                        <Typography variant="h6" className={clsx(this.props.classes.spaceAbove)}>{language.name}'s Snippet</Typography>
                        <Divider className={clsx(this.props.classes.spaceAbove)} />
                        <div>
                            <AceEditor mode={modes[language.name]}
                                        theme="github"
                                        onChange={(value) => this.setState({snippet: value})}
                                        fontSize={16}
                                        showPrintMargin={true}
                                        showGutter={true}
                                        highlightActiveLine={true}
                                        value={snippet}
                                        setOptions={{
                                            enableBasicAutocompletion: true,
                                            enableLiveAutocompletion: true,
                                            enableSnippets: true,
                                            showLineNumbers: true,
                                            tabSize: 4
                                        }}
                                        editorProps={{
                                            $blockScrolling: true //Remove warning
                                        }}
                                        className={clsx(this.props.classes.textArea, this.props.classes.spaceAbove)}
                                        focus={true} />
                            <FormHelperText>{'Please add "<frame_code>", "<control_code>" and "<library>"(optional) where code will be generated'}</FormHelperText>
                        </div>
                        <div>
                            <TextField label="Add Component Syntax" 
                                        value={syntax}
                                        onChange={(e) => this.setState({syntax: e.target.value})}
                                        className={clsx(this.props.classes.textField, this.props.classes.spaceAbove)} />
                            <FormHelperText>{'Please add "<% Variable %>" for component variable'}</FormHelperText>
                        </div>
                        <div className={clsx(this.props.classes.buttonContainer)}>
                            <Button variant="contained" color="primary" onClick={() => this.saveSnippet()}>
                                <SaveIcon />
                                Save
                            </Button>
                        </div>
                    </>
                }
            </>
        )
    }
}

export default withStyles(styles)(ProgrammingSnippetContainer);