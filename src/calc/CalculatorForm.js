import React, {Component} from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import '../styles/calcForm.css';
import {renderReadTextField} from "./calcFuncrtions";
import {ReadComponent} from "./ReadComponent";

export class CalculatorForm extends Component {
    state = {
        bitNum: 32,
        bitNumEl: 8,
        ip: '',
        mask: '',
        ipRead: '', ipBinaryRead: '',
        maskRead: '', maskBinaryRead: '',
        netRead: '', netBinaryRead: '',
        broadRead: '', broadBinaryRead: '',
        firstHostRead: '', firstHostBinaryRead: '',
        lastHostRead: '', lastHostBinaryRead: '',
        hostNumber: ''
    };

    parseDecToBin = arr => {
        return arr.map(el => {
            let binary = (el >>> 0).toString(2);
            binary = "0".repeat(this.state.bitNumEl - binary.length) + binary;
            return binary;
        }).join('.');
    };
    calculateNetBinaryAddr = netDec => {
        let netBinaryArr = this.parseDecToBin(netDec);
        this.setState({netBinaryRead: netBinaryArr});
    };

    calculateBroadBinaryAddr = broadDec => {
        let broadNetArr = this.parseDecToBin(broadDec);
        this.setState({broadBinaryRead: broadNetArr});
    };

    calculateNetworkAddr = maskBinaryArr => {
        let ipDecArr = this.state.ip.split('.');
        let netDec = ipDecArr.map((mask, i) =>
            mask & parseInt(maskBinaryArr[i], 2)
        );
        this.setState({netRead: netDec.join('.')});
        this.calculateFirstHost(netDec);
        return netDec;
    };

    calculateBroadAddr = (maskBinaryArr, netDec) => {
        let maskBinarryArrFrag = maskBinaryArr.map(el => el.split(''));
        maskBinarryArrFrag = maskBinarryArrFrag.map(function (row) {
            return row.map(function (cell) {
                let el = parseInt(cell);
                el ^= 1;
                return el;
            });
        });

        maskBinarryArrFrag = maskBinarryArrFrag.map(el => el.join('')).map(el => parseInt(el, 2));
        let broadNet = maskBinarryArrFrag.map((el, idx) => el + netDec[idx]);
        this.setState({broadRead: broadNet.join('.')});
        this.calculateLastHost(broadNet);
        return broadNet;
    };

    calculateIpBinaryAddr = () => {
        let ipArr = this.state.ip.split('.');
        this.setState({ipBinaryRead: this.parseDecToBin(ipArr)});
    };

    calculateAddress(maskBinaryArr) {
        this.calculateIpBinaryAddr();
        let netDec = this.calculateNetworkAddr(maskBinaryArr);
        this.calculateNetBinaryAddr(netDec);
        let broadDec = this.calculateBroadAddr(maskBinaryArr, netDec);
        this.calculateBroadBinaryAddr(broadDec);
    };

    calculateMask() {
        const {mask, bitNum} = this.state;
        let maskBinaryArr;
        let maskDec;
        if (mask.length < 3) {
            let maskNumber = parseInt(mask);
            let maskBinary = "1".repeat(maskNumber) + "0".repeat(bitNum - maskNumber);
            maskBinaryArr = maskBinary.match(/.{1,8}/g);
            maskDec = maskBinaryArr.map(el => parseInt(el, 2)).join('.');

        } else {
            maskBinaryArr = this.parseDecToBin(mask.split('.')).split('.');
            maskDec = mask;
        }
        this.setState({maskRead: maskDec});
        this.setState({maskBinaryRead: maskBinaryArr.join('.')});
        return maskBinaryArr;
    };

    calculateFirstHost = netDec => {
        let netAddr = [...netDec];
        netAddr[3] = parseInt(netAddr[3]) + 1;
        this.setState({firstHostRead: netAddr.join('.')});
        this.setState({firstHostBinaryRead: this.parseDecToBin(netAddr)});
    };

    calculateLastHost = broadDec => {
        let broadAddr = [...broadDec];
        broadAddr[3] = parseInt(broadAddr[3]) - 1;
        this.setState({lastHostRead: broadAddr.join('.')});
        this.setState({lastHostBinaryRead: this.parseDecToBin(broadAddr)});
    };

    calculateHostNumber() {
        let mask  = this.state.mask;
        if(this.state.mask.length>3){
            mask = this.parseDecToBin(mask.split('.'));
            mask=mask.split('1').length-1;
        }
        let hostNumber = Math.pow(2, this.state.bitNum - parseInt(mask)) - 2;
        this.setState({hostNumber: hostNumber})
    };

    calculate() {
        let maskBinaryArr = this.calculateMask();
        this.calculateAddress(maskBinaryArr);
        this.calculateHostNumber();
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.calculate();
        this.setState({ipRead: this.state.ip});
    };

    handleChange = name => event => {
       let error;
        this.setState({[name]: event.target.value});
    };

    renderWriteTextField = (type, name, label) => {
        return (
            <TextField
                required
                id={name}
                type={type}
                value={this.state[name]}
                onChange={this.handleChange(name)}
                label={label}
            />
        )
    };


    render() {

        return (

            <div className={'calc-form-component'}>
                <div className={'calc-form'}>
                    <form onSubmit={this.handleSubmit}>
                        <div>
                            {this.renderWriteTextField('text', 'ip', 'Adres IP')}
                            {this.renderWriteTextField('text', 'mask', 'Maska')}
                        </div>
                        <Button variant="outlined" type={"submit"}>
                            Zapisz
                        </Button>
                    </form>
                <ReadComponent
                    ipRead ={this.state.ipRead}
                    ipBinaryRead ={this.state.ipBinaryRead}
                    maskRead ={this.state.maskRead}
                    maskBinaryRead = {this.state.maskBinaryRead}
                    netRead ={this.state.netRead}
                    netBinaryRead ={this.state.netBinaryRead}
                    broadRead = {this.state.broadRead}
                    broadBinaryRead = {this.state.broadBinaryRead}
                    firstHostRead = {this.state.firstHostRead}
                    firstHostBinaryRead={this.state.firstHostBinaryRead}
                    lastHostRead={this.state.lastHostRead}
                    lastHostBinaryRead={this.state.lastHostBinaryRead}
                    hostNumber={this.state.hostNumber}
                    isDisabled={false}/>
                </div>
            </div>
        )
    }
}
