import {Component} from "react";
import {renderReadTextField} from "./calcFuncrtions";
import React from "react";

export class ReadComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            ipRead,
            ipBinaryRead,
            maskRead,
            maskBinaryRead,
            netRead,
            netBinaryRead,
            broadRead,
            broadBinaryRead,
            firstHostRead,
            firstHostBinaryRead,
            lastHostRead,
            lastHostBinaryRead,
            hostNumber,
            isDisabled
        } = this.props;

        return (
            <div>
                <div style={{display : isDisabled ? 'none' : 'block'}}>
                    <div className={"element"}>
                        Adres IP
                    </div>
                    {renderReadTextField(this.props.ipRead, 'Adres IP')}
                    {renderReadTextField(ipBinaryRead, ' ')}
                </div>
                <div>
                    <div className={"element"}>
                        Maska
                    </div>
                    {renderReadTextField(maskRead, 'Maska')}
                    {renderReadTextField(maskBinaryRead, ' ')}
                </div>

                <div>
                    <div className={"element"}>
                        Adres sieci
                    </div>
                    {renderReadTextField(netRead, 'Adres sieci')}
                    {renderReadTextField(netBinaryRead, ' ')}
                </div>
                <div>
                    <div className={"element"}>
                        Adres rozgłoszeniowy
                    </div>
                    {renderReadTextField(broadRead, 'Adres rozgłoszeniowy')}
                    {renderReadTextField(broadBinaryRead, ' ')}
                </div>
                <div>
                    <div className={"element"}>
                        Adres pierwszego hosta
                    </div>
                    {renderReadTextField(firstHostRead, 'Adres pierwszego hosta')}
                    {renderReadTextField(firstHostBinaryRead, ' ')}
                </div>
                <div>
                    <div className={"element"}>
                        Adres ostatniego hosta
                    </div>
                    {renderReadTextField(lastHostRead, 'Adres ostatniego hosta')}
                    {renderReadTextField(lastHostBinaryRead, ' ')}
                </div>
                <div>
                    <div className={"element"}>
                        Liczba hostów
                    </div>
                    {renderReadTextField(hostNumber, 'Liczba hostów')}
                </div>
            </div>
        )
    }
}
