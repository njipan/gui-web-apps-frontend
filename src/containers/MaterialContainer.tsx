import React from 'react';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {withStyles} from "@material-ui/core";
import PdfViewer from '../components/PdfViewer';

const styles = {
    content: {
        height: "100vh",
        borderRadius: 0,
        position : "relative" as "relative",
        backgroundColor: '#bdc3c7'
    },
    message: {
        margin: 0,
        padding: '20px 10px'
    },
    navigationWrapper: {
        borderBottom: '2px solid #bdc3c7',
        display: 'flex',
        paddingLeft: '20px',
        flexDirection: "column" as "column",
        cursor: 'pointer' as 'pointer',
        backgroundColor: 'white'
    },
    navigationText: {
        margin: '10px 0 5px 0'
    },
    form: {
        display: 'flex',
        flexWrap: 'wrap' as 'wrap',
        margin: '10px 0',
        padding: '0 10px'
    },
    formControl: {
        width: '100%',
        margin: '5px 0'
    },
    gridContainer: {
        borderTop: '1px solid #ccc'
    }
};

interface INavigation {
    name: string;
    page: number;
}

interface IModule{
    name: string;
    file: string;
}

class MaterialContainer extends React.Component<any, any> {
    constructor(props: any){
        super(props);
        this.state = {
            programmingLanguages: {},
            navigation: [],
            activeLanguage: '',
            activeModules: [],
            activeModule: -1,
            jumpPage: 1
        };
    }

    componentDidMount = () => {
        this.setState({
            navigation: [
                {
                    name: 'Halaman Sampul',
                    page: 1
                },
                {
                    name: 'Halaman Judul',
                    page: 2
                },
                {
                    name: 'Halaman Pernyataan Orisinalitas',
                    page: 3
                },
                {
                    name: 'Daftar Isi',
                    page: 5
                },
                {
                    name: 'BAB 1 - Pendahuluan',
                    page: 7
                },
                {
                    name: 'BAB 2 - Laporan Kegiatan',
                    page: 13
                },
                {
                    name: 'BAB 3 - Kesimpulan',
                    page: 23
                }
            ],
            programmingLanguages: {
                'C#': {
                    'modules': [
                        {
                            name: 'Introduction to C#',
                            file: 'sample.pdf'
                        },
                        {
                            name: 'Input Output',
                            file: 'sample1.pdf'
                        },
                        {
                            name: 'Selection',
                            file: 'sample2.pdf'
                        },
                        {
                            name: 'Iteration/Looping',
                            file: 'sample3.pdf'
                        }
                    ]
                }
            }
        })
    }

    onLanguageChange = (language: any) => {
        this.setState({
            activeLanguage: language,
            activeModules: this.state.programmingLanguages[language].modules
        });
    }

    onModuleChange = (moduleIdx: any) => {
        this.setState({
            activeModule: moduleIdx
        });
    }

    onClickNavigation = (page: number) => {
        this.setState({
            jumpPage: page
        });
    }

    render = () => {
        let languages: any[] = [];
        Object.keys(this.state.programmingLanguages).forEach((v, i) => {
            languages.push(<MenuItem value={v} key={i}>{v}</MenuItem>);
        });

        let modules: any[] = [];
        if(this.state.activeModules.length > 0){
            this.state.activeModules.forEach((v: IModule, i: any) => {
                modules.push(<MenuItem value={i} key={i}>{v.name}</MenuItem>);
            });
        }

        let activeFile: string = '';
        if(this.state.activeModule !== -1){
            activeFile = this.state.activeModules[this.state.activeModule].file;
        }

        return (
            <>
                <form className={this.props.classes.form}>
                    <FormControl className={this.props.classes.formControl}>
                        <InputLabel htmlFor="select-programming-language">Programming Language</InputLabel>
                        <Select value={this.state.activeLanguage} onChange={(e) => this.onLanguageChange(e.target.value)} inputProps={{
                            id: 'select-programming-language'
                        }}>
                            <MenuItem value="" disabled selected>-- Select Programming Language --</MenuItem>
                            {languages}
                        </Select>
                    </FormControl>
                    {this.state.activeLanguage !== '' && 
                    <FormControl className={this.props.classes.formControl}>
                        <InputLabel htmlFor="select-module">Module</InputLabel>
                        <Select value={this.state.activeModule} onChange={(e) => this.onModuleChange(e.target.value)} inputProps={{
                            id: 'select-module'
                        }}>
                            <MenuItem value="" disabled selected>-- Select Module --</MenuItem>
                            {modules}
                        </Select>
                    </FormControl>}
                </form>
                {this.state.activeModule !== -1 && 
                <Grid container spacing={0} className={this.props.classes.gridContainer}>
                    <Grid item xs={3}>
                        <Paper className={this.props.classes.content}>
                            {this.state.navigation.length < 1 && 
                                <div>
                                    <h3 className={this.props.classes.message}>No navigation available</h3>
                                </div>
                            }
                            {this.state.navigation.length > 0 &&
                                this.state.navigation.map((v: INavigation, i: any) => 
                                    <div key={i} className={this.props.classes.navigationWrapper} onClick={() => this.onClickNavigation(v.page)}>
                                        <h5 className={this.props.classes.navigationText}>{v.name}</h5>
                                        <small className={this.props.classes.navigationText}>Page {v.page}</small>
                                    </div>
                                )
                            }
                        </Paper>
                    </Grid>
                    <Grid item xs={9}>
                        <Paper className={this.props.classes.content}>
                            <PdfViewer file={`files/${activeFile}`} page={this.state.jumpPage} />
                        </Paper>
                    </Grid>
                </Grid>}
            </>
        );
    }
}

export default withStyles(styles)(MaterialContainer);