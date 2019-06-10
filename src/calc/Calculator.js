import React, {Component} from 'react';

import AppBar from '@material-ui/core/AppBar';

import {CalculatorForm} from "./CalculatorForm";
import Tabs from "@material-ui/core/Tabs/Tabs";
import Tab from "@material-ui/core/Tab/Tab";
import {Redirect, Route} from "react-router";
import {BrowserRouter} from "react-router-dom";
import {withRouter} from 'react-router-dom';
import {NetworkForm} from "./NetworkForm";
import Typography from "@material-ui/core/Typography/Typography";
import * as PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

function TabContainer(props) {
    return (
        <Typography component="div" style={{padding: 8 * 3}}>
            {props.children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
})

export class Calculator extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: 'Kalkulator',
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (event, value) => {
        this.setState({ value });
    };


    render() {
        return (
                <div>
                    <AppBar position={"static"} color={"default"}>
                        <Tabs value={this.state.value} onChange={this.handleChange}>
                            <Tab label="Kalkulator" value={"Kalkulator"}/>
                            <Tab label="Podział na podsieci" value={"Sieci"}/>
                        </Tabs>
                    </AppBar>
                    {this.state.value === "Kalkulator" && <TabContainer><CalculatorForm/></TabContainer>}
                    {this.state.value === "Sieci" && <TabContainer><NetworkForm/></TabContainer>}
                </div>
        )
    }
}

Calculator.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Calculator);
