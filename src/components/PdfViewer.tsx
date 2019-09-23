import React from 'react';
import {withStyles} from "@material-ui/core";
import { Document, Page, pdfjs } from 'react-pdf';

const styles = {
    pdfContainer: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'center',
        height: '100%',
        overflowY: 'auto' as 'auto',
        backgroundColor: '#bdc3c7'
    },
    pdfDocument: {
        width: 'fit-content'
    },
    pdfPage: {
        width: 'fit-content',
        margin: '10px 0'
    }
};

class PdfViewer extends React.Component<any, any> {
    constructor(props: any){
        super(props);

        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
        this.state = {
            jumpPage: props.page,
            file: props.file,
            totalPage: 0,
            pageHeight: -1
        };
    }

	onPageLoadSuccess = () => {
        let page = document.getElementsByClassName('react-pdf__Page')[0];
        if(this.state.pageHeight < page.clientHeight){
            this.setState({
                pageHeight: page.clientHeight
            });
        }
	}

    onDocumentLoadSuccess = (doc: any) => {
        this.setState({
            totalPage: doc.numPages
        });
    }

    componentDidUpdate(prevProps: any){
        if(this.props.page !== prevProps.page){
            this.setState({
                jumpPage: this.props.page
            }, () => {
                this.jumpPage(this.state.jumpPage);
            });
        }

        if(this.props.file !== prevProps.file){
            this.setState({
                file: this.props.file
            });
        }
    }

    jumpPage = (page: any) => {
        let wrapper = document.getElementById('pdf-wrapper');
        if(wrapper){
            wrapper.scrollTo(0, (page- 1) * (this.state.pageHeight + 10));
        }
    }

    render = () => {
        let {file, totalPage} = this.state;
        let pages = [];
        for(let i=1;i<=totalPage;i++){
            pages.push(<Page className={this.props.classes.pdfPage} key={i} pageNumber={i} onLoadSuccess={this.onPageLoadSuccess} />)
        }

        return (
            <>
                <div className={this.props.classes.pdfContainer} id="pdf-wrapper">
                    <Document className={this.props.classes.pdfDocument} file={file} onLoadSuccess={this.onDocumentLoadSuccess}>
                        {pages}
                    </Document>
                </div>
            </>
        );
    }
}

export default withStyles(styles)(PdfViewer);