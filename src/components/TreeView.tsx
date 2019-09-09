import React from 'react';
import Icon from '@material-ui/core/Icon';

interface ITreeView{
    data: any[]
}

interface ITreeViewItem {
    name: any,
    childrens: any[]
}

class TreeViewItem extends React.Component<ITreeViewItem, any> {
    constructor(props: ITreeViewItem){
        super(props);
        this.state = {
            show : true
        };
    }

    toggle = () => {
        const reverseToggle = !this.state.show;
        this.setState({
            show : reverseToggle
        });
    };

    showToggle(childrens : any[], show: boolean){
        if(childrens.length <= 0) return null;

        if(show) return <Icon>keyboard_arrow_down</Icon>;
        else return <Icon>keyboard_arrow_up</Icon>;
    }

    render() : React.ReactElement {
        return (
            <div style={{ marginLeft : '10px'}}>
                <div style={{ display: "flex", alignItems: "center", cursor: "pointer"}} onClick={this.toggle}>{ this.props.name } { this.showToggle(this.props.childrens, this.state.show) }</div>
                {
                    this.props.childrens.length > 0  && this.state.show && <TreeView data={this.props.childrens} />
                }
            </div>
        )
    }
}

export default class TreeView extends React.Component<ITreeView, any>{
    constructor(props: ITreeView){
        super(props);
        this.state = {
            show : false
        };
    }


    render(): React.ReactElement {
        return (
            <div>
                { this.props.data.length > 0 && this.props.data.map((item: any, index: number) => (
                    <TreeViewItem {...item} key={index} />
                ))
                }
            </div>
        )
    }
}