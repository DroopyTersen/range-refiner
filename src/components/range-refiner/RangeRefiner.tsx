import * as React from 'react';
import { RefinerValue, RangeSlice, getSlices, getMinMaxValues, setSliceHeights } from './rangeUtils';
import 'rheostat/initialize';
import "rheostat/css/rheostat.css";
import Rheostat from 'rheostat';
import "./rangeRefiner.scss";

const NUM_SLICES = 16
export default class RangeRefiner extends React.PureComponent<RangeRefinerProps, {}> {
    state = {
        values: this.props.values
    }
    onUpdate = (props) => {
        let values = { min: props.values[0], max: props.values[1]};
        this.setState({ values });
    }
    onChange = (props) => {
        let values = { min: props.values[0], max: props.values[1]};
        this.setState({ values });
        this.props.onChange(values);
    }
    onInputChange = (e, key) => {
        try {
            let val = Number(e.currentTarget.value);
            let values = { ...this.state.values, ...{ [key]: val }}
            this.setState({ values });
            this.props.onChange(values);
            
        } catch(err) {
            console.log("Invalid number")
        }
    }
    onMinInputChange = (e) => this.onInputChange(e, "min");
    onMaxInputChange = (e) => this.onInputChange(e, "max");
    render() {
        let { refinerValues } = this.props;
        let values = this.state.values;
        let minMax = getMinMaxValues(refinerValues);
        let slices = getSlices(refinerValues, NUM_SLICES);
        setSliceHeights(slices, 100, 4);
        let pitPoints = slices.map(slice => slice.min);
        return (
            <div className="rangeRefiner">
                <Rheostat 
                    min={minMax.min}
                    max={minMax.max}
                    values={[values.min, values.max]}
                    onChange={this.onChange}
                    onValuesUpdated={this.onUpdate}
                    pitComponent={function(props) {
                        let pitPoint = props.children;
                        let slice = slices.find(slice => slice.min === pitPoint)
                        console.log("SLICE", slice);
                        return (
                            <div
                              style={{
                                ...props.style,
                                background: '#ddd',
                                width: (100/NUM_SLICES) + "%",
                                border: "1px solid #fff",
                                height: slice.height,
                                bottom: 19,
                                borderRadius: "3px 3px 0 0",
                                boxSizing: "border-box"
                              }}
                            />
                        )
                    }}
                    pitPoints={pitPoints}
                />
                <div className="inputs">
                    <div>
                        <input type='number' value={values.min} onChange={this.onMinInputChange} />
                    </div>
                    <span> to </span>
                    <div>
                        <input type='number' value={values.max} onChange={this.onMaxInputChange}/>
                    </div>
                </div>
            </div>
        );
    }
}

export interface RangeRefinerProps {
    refinerValues: RefinerValue[],
    values: { min:number, max: number },
    onChange: ({min,max}) => void,
}