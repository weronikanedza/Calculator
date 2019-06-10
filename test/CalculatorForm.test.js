import React from 'react';
import {shallow} from 'enzyme';

import {CalculatorForm} from "../src/calc/CalculatorForm";

describe('MyComponent', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        wrapper = shallow(<CalculatorForm debug/>);
        instance = wrapper.instance();
    });

    it('should render correctly in "debug" mode', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('calculate mask correctly', () => {
        //given
        let state = {
            bitNum: 32,
            mask: 24
        };
        wrapper.setState({...state});

        //when
        wrapper.instance().calculateHostNumber();

        //then
        expect(wrapper.state().hostNumber).toBe(254);
    });

    it('calculate first host', () => {
        //when
        wrapper.instance().calculateFirstHost(["123", "23", "12", "0"]);

        //then
        expect(wrapper.state().firstHostRead).toBe("123.23.12.1");
    });

    it('calculate mask', () => {
        //given
        let state = {
            bitNum: 32,
            mask: 24
        };
        wrapper.setState({...state});

        //when
        wrapper.instance().calculateMask();

        //then
        expect(wrapper.state().maskRead).toBe("255.255.255.0");
        expect(wrapper.state().maskBinaryRead).toBe("11111111.11111111.11111111.00000000");
    });

    it('calculate binary ip address',()=>{
        //given
        let state = {
            ip: "123.23.12.32",
        };
        wrapper.setState({...state});

        //when
        wrapper.instance().calculateIpBinaryAddr();

        //then
        expect(wrapper.state().ipBinaryRead).toBe('01111011.00010111.00001100.00100000');
    })

});
