import React from 'react';
import RangeRefiner from '../range-refiner/RangeRefiner';

let data = [
    { value: 2.99, count: 8 },
    { value: 1, count: 26 },
    { value: 1.99, count: 15 },
    { value: 4.99, count: 20 },
    { value: 5.99, count: 18 },
    { value: 2.75, count: 32 },
    { value: 9.75, count: 32 },
];
export default class App extends React.PureComponent<AppProps, {}> {
    state = {
       values: { min: 2, max: 8 }
    }
    onRangeChange = (values) => this.setState({ values })
    render() {
        return (
            <div>
                <h2>Range Refiner Demo App</h2>
                <RangeRefiner refinerValues={data} values={this.state.values} onChange={this.onRangeChange} />
                <div>
                    <h3>Parent Range Value</h3>
                    <span>{this.state.values.min}</span>
                    <span> to </span>
                    <span>{this.state.values.max}</span>
                </div>
            </div>
        );
    }
}

export interface AppProps {
    //props
}