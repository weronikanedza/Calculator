import React, {Component} from 'react';
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";
import "../App.css"
import {ReadComponent} from "./ReadComponent";

export class NetworkForm extends Component {

    state = {
        hostValue: [''],
        ipAddress: '',
        mask: '',
        maskNet: [''],
        maskRead: [''], maskBinaryRead: [''],
        netRead: [''], netBinaryRead: [''],
        broadRead: [''], broadBinaryRead: [''],
        firstHostRead: [''], firstHostBinaryRead: [''],
        lastHostRead: [''], lastHostBinaryRead: [''],
        hostNumber: [''],
        hostMask: [''],
        result: false
    };

    renderHostInput = (id) => {
        return (
            <div key={id}>
                <TextField
                    label={"Ilość hostów"}
                    name={'' + id}
                    value={this.state.hostValue[id]}
                    onChange={this.handleChange(id)}
                    type={"text"}
                />


                <Button variant="contained" disabled={id === 0} color="secondary" onClick={() => this.removeHost(id)}>
                    X
                </Button>

                {id === this.state.hostValue.length - 1 &&
                <div>
                    <Button variant="contained" onClick={this.addHost.bind(this)}>
                        Dodaj sieć
                    </Button>
                </div>}
            </div>)

    };

    addHost = () => {
        this.setState({
            hostValue: [...this.state.hostValue, '']
        })
    };

    removeHost = (id) => {
        let arr = this.state.hostValue;
        arr.splice(id, 1);
        this.setState({
            hostValue: arr
        })
    };

    handleSubmit = (e) => {
        e.preventDefault();
        if(this.checkNetwork())
        {
            this.setState({hostValue: this.state.hostValue.sort(this.compareNum)}); //sort host
            let hostMask = this.calculateHostMasks();

            this.calculateReadData(hostMask);
            this.setState({
                result: true
            })
        } else
        {
            alert("Podana została za duża liczba hostów")
        }
    };

    checkNetwork = () => {
        const avaibleHostNum = Math.pow(2, 32 - this.state.mask) - 2;
        const givenHostNumber = this.state.hostValue.reduce((prev, curr) => parseInt(prev) + parseInt(curr));
        return avaibleHostNum >= givenHostNumber ;
    };


    compareNum = (a, b) => {
        return b - a;
    };

    handleChange = name => event => {
        if (typeof name == "number") {
            let arr = this.state.hostValue;
            arr[name] = event.target.value;
            this.setState({
                hostValue: arr
            });
        } else {
            this.setState({[name]: event.target.value})
        }

    };

    calculateHostMasks = () => {
        let hostMask = this.state.hostValue.map((el) => {
            let temp = 1;
            for (let j = 0; j < 32; j++) {
                temp *= 2;
                if (temp >= parseInt(el)) {
                    return 32 - (j + 1);
                }
            }
        });
        this.setState({hostMask: hostMask});
        return hostMask;
    };

    calculateReadData = (hostMask) => {
        hostMask.map((el, idx) => {
            this.calculate(el, idx);
        })
    };

    renderReadComponent = (idx) => {
        return (
            <div>
                <ReadComponent
                    ipRead={null}
                    ipBinaryRead={null}
                    maskRead={this.state.maskRead[idx]}
                    maskBinaryRead={this.state.maskBinaryRead[idx]}
                    netRead={this.state.netRead[idx]}
                    netBinaryRead={this.state.netBinaryRead[idx]}
                    broadRead={this.state.broadRead[idx]}
                    broadBinaryRead={this.state.broadBinaryRead[idx]}
                    firstHostRead={this.state.firstHostRead[idx]}
                    firstHostBinaryRead={this.state.firstHostBinaryRead[idx]}
                    lastHostRead={this.state.lastHostRead[idx]}
                    lastHostBinaryRead={this.state.lastHostBinaryRead[idx]}
                    hostNumber={this.state.hostNumber[idx]}
                    isDisabled={true}/>
            </div>
        )
    };

    render() {

        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div className={"ip_address"}>
                        <div>
                            <TextField
                                label={"Adres IP"}
                                name={"ipAddress"}
                                value={this.state.ipAddress}
                                onChange={this.handleChange("ipAddress")}
                                type={"text"}
                            />
                        </div>
                    </div>
                    <div className={"mask_field"}>
                        <TextField
                            label={"Maska"}
                            name={"mask"}
                            value={this.state.mask}
                            onChange={this.handleChange("mask")}
                            type={"text"}
                        />
                    </div>
                    {this.state.hostValue.map((el, i) => this.renderHostInput(i, el))}
                    <div>
                        <Button variant="outlined" type={"submit"}>
                            Oblicz podsieci
                        </Button>
                    </div>
                </form>
                {this.state.result && this.state.hostValue.map((el, idx) => {
                    return this.renderReadComponent(idx)
                })
                }
            </div>

        )
    }


    parseDecToBin = arr => {
        return arr.map(el => {
            let binary = (el >>> 0).toString(2);
            binary = "0".repeat(8 - binary.length) + binary;
            return binary;
        }).join('.');
    };
    calculateNetBinaryAddr = (netDec, idx) => {
        let netBinaryArr = this.parseDecToBin(netDec);
        let arr = this.state.netBinaryRead;
        arr[idx] = netBinaryArr;
        this.setState({netBinaryRead: arr});
    };

    calculateBroadBinaryAddr = (broadDec, idx) => {
        let broadNetArr = this.parseDecToBin(broadDec);
        let arr = this.state.broadBinaryRead;
        arr[idx] = broadNetArr;
        this.setState({broadBinaryRead: arr});
    };


    calculateBroadAddr = (maskBinaryArr, netDec, idx) => {
        let maskBinarryArrFrag = maskBinaryArr.map(el => el.split(''));
        maskBinarryArrFrag = maskBinarryArrFrag.map(function (row) {
            return row.map(function (cell) {
                let el = parseInt(cell);
                el ^= 1;
                return el;
            });
        });

        maskBinarryArrFrag = maskBinarryArrFrag.map(el => el.join('')).map(el => parseInt(el, 2));
        let broadNet = maskBinarryArrFrag.map((el, idx) => parseInt(el) + parseInt(netDec[idx]));

        let arr = this.state.broadRead;
        arr[idx] = broadNet.join('.');
        this.setState({broadRead: arr});
        this.calculateLastHost(broadNet, idx);
        return broadNet;
    };

    calculateIpBinaryAddr = (idx) => {
        let ipArr = this.state.ip.split('.');
        let arr = this.state.ipBinaryRead;
        arr[idx] = this.parseDecToBin(ipArr);
        this.setState({ipBinaryRead: arr});
    };

    calculateAddress(maskBinaryArr, idx) {

        let netDec = this.calculateNetworkAddr(maskBinaryArr, idx);
        this.calculateNetBinaryAddr(netDec, idx);

        let broadDec = this.calculateBroadAddr(maskBinaryArr, netDec, idx);
        this.calculateBroadBinaryAddr(broadDec, idx);
    };

    calculateNetworkAddr = (maskBinaryArr, idx) => {
        let netDec = this.state.netRead[idx].split('.');
        this.calculateFirstHost(netDec, idx);
        return netDec;
    };

    calculateMask(mask, idx) {
        let bitNum = 32;
        let maskBinaryArr;
        let maskDec;

        if (typeof mask == "number") {
            let maskBinary = "1".repeat(mask) + "0".repeat(bitNum - mask);
            maskBinaryArr = maskBinary.match(/.{1,8}/g);
            maskDec = maskBinaryArr.map(el => parseInt(el, 2)).join('.');

        } else {
            maskBinaryArr = this.parseDecToBin(mask.split('.')).split('.');
            maskDec = mask;
        }

        let arr = this.state.maskRead;
        arr[idx] = maskDec;
        this.setState({maskRead: arr});
        arr = this.state.maskBinaryRead;
        arr[idx] = maskBinaryArr.join('.');
        this.setState({maskBinaryRead: arr});
        return maskBinaryArr;
    };

    calculateFirstHost = (netDec, idx) => {
        let netAddr = [...netDec];
        netAddr[3] = parseInt(netAddr[3]) + 1;
        let arr = this.state.firstHostRead;

        arr[idx] = netAddr.join('.');
        this.setState({firstHostRead: arr});

        arr = this.state.firstHostBinaryRead;
        arr[idx] = this.parseDecToBin(netAddr);
        this.setState({firstHostBinaryRead: arr});
    };

    calculateLastHost = (broadDec, idx) => {
        let broadAddr = [...broadDec];
        broadAddr[3] = parseInt(broadAddr[3]) - 1;

        let arr = this.state.lastHostRead;
        arr[idx] = broadAddr.join('.');
        this.setState({lastHostRead: arr});

        arr = this.state.lastHostBinaryRead;
        arr[idx] = this.parseDecToBin(broadAddr);
        this.setState({lastHostBinaryRead: arr});
    };

    calculateHostNumber(el, idx) {
        let mask = el;
        if (typeof el != "number") {
            mask = this.parseDecToBin(mask.split('.'));
            mask = mask.split('1').length - 1;
        }
        let hostNumber = Math.pow(2, 32 - parseInt(mask)) - 2;

        let arr = this.state.hostNumber;
        arr[idx] = hostNumber;
        this.setState({hostNumber: arr})
    };

    calculate(el, idx) {
        if (idx == 0) {
            let arr = this.state.netRead;
            arr[idx] = this.state.ipAddress;
            this.setState({netRead: arr})
        } else {
            let lastBroadAddr = this.state.broadRead[idx-1].split('.');

            let i = this.addVal(lastBroadAddr,1);
            lastBroadAddr[i] = (parseInt(lastBroadAddr[i])+1).toString();
            lastBroadAddr = this.makeArrZero(lastBroadAddr,i);

            let arr = this.state.netRead;
            arr[idx] = lastBroadAddr.join('.');
            this.setState({netRead: arr})
        }
        let maskBinaryArr = this.calculateMask(el, idx);
        this.calculateAddress(maskBinaryArr, idx);
         this.calculateHostNumber(el,idx);
    };

    addVal(arr,val){
        for(let i=arr.length-1;i>=0;i--){
            let temp = parseInt(arr[i])+val;
            if(temp<255){
               return i;
            }
        }
    }

    makeArrZero(arr,idx){
        let temp = arr;
        for(let i=idx+1;i<arr.length;i++){
            temp[i]='0';
        }
        return temp;
    }
}
