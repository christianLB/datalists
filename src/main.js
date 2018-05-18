import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import './styles/styles.less';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            header: [],
            rows: [],
            collapsed: this.props.collapsed,
        };
        this.data = {};
    }

    componentDidMount() {
        this.getData();
    }
    getData() {
        this.startLoading();
        this.data = fetch(this.props.url).then(response => {
            response.json().then(json => {
                json = json.results;
                this.setState({
                    data: json,
                    header: this.getHeader(json),
                    rows: this.getRows(json),
                    rowCount: json.length,
                    fieldCount: Object.keys(json[0]).length,
                    loading: false,
                    collapsed: false,
                });
                clearInterval(this.interval);
            });
        });
    }
    getRows(json) {
        return json.map((row, i) => {
            return (
                <tr key={`row${i}`}>
                    {Object.keys(row).map((field, i) => {
                            return <td key={`field${i}`}>{row[field]}</td>;
                        }
                    )}
                </tr>
            );
        });
    }
    getHeader(json) {
        return <tr>
                {
                    Object.keys(json[0]).map((key, i) => {
                        return (
                            <th key={`head${i}`}>
                                {key}
                            </th>
                        );
                    })
                }
                </tr>;
    }
    toggle() {
        if (this.state.loading) {
            return false;
        }
        this.setState({ collapsed: this.state.collapsed ? false : true });
    }
    startLoading() {
        this.setState({
            loading: true,
            loadingText: this.props.loadingText,
        });
        this.interval = setInterval(() => {
            this.setState({ loadingText: `${this.state.loadingText}.` });
        }, 500);
    }
    render() {
        return (
            <React.Fragment>
                <table>
                    <thead>
                        <tr>
                            <th className={'title'}
                                colSpan={this.state.fieldCount||1}
                            >
                                <a
                                    hidden={this.state.loading}
                                    href={void(0)}
                                    onClick={this.toggle.bind(this)}
                                    className={
                                        `collapse
                                        ${this.state.collapsed?
                                        'collapsed':'expanded'}`
                                    }
                                ></a>
                                {this.props.tableTitle}
                            </th>
                        </tr>
                        {!(this.state.loading)
                          &&(this.state.header)
                          &&!this.state.collapsed
                          &&<React.Fragment>{this.state.header}</React.Fragment>
                        }
                    </thead>
                    <tbody>
                        {!this.state.collapsed && !this.state.loading &&
                            <React.Fragment>{this.state.rows}</React.Fragment>
                        }
                        {!(this.state.loading) &&
                            <tr>
                                <td colSpan={this.state.fieldCount||1}>
                                    <a href="#"
                                       onClick={this.getData.bind(this)}
                                       className="reload"
                                    >Reload</a>
                                    {`rowCount: ${this.state.rowCount||'--'}
                                     fieldCount: ${this.state.fieldCount||'--'}`
                                    }
                                </td>
                            </tr>
                        }
                        {this.state.loading &&
                            <tr>
                                <td colSpan={this.state.fieldCount||1}>
                                    {this.state.loadingText}
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            </React.Fragment>
        );
    }
}

Main.defaultProps = {
    // url: './src/data/data.json',
    url: 'https://randomuser.me/api/?results=15&inc=gender,email,registered,phone&noinfo',
    tableTitle: 'React Dynamic Table',
    collapsed: false,
    loadingText: 'Loading.',
};

ReactDOM.render(<Main />, document.getElementById('app1'));
