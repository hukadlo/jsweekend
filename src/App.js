//
// @flow
//

import _ from 'lodash';
import FlightList from './FlightList';
import React from 'react';
import SelectBox from './SelectBox';
import moment from 'moment';

type TProps = {};

type TState = {
    from: string;
    to: string;
    date: string;
    submitted: boolean,
}

export default class App extends React.Component<TProps, TState> {
    handleChange: Function;
    handleSubmit: Function;

    /**
     * @constructor
     * @param  {TProps} props
     */
    constructor(props: TProps) {
        super(props);
        this.state = {
            from: '',
            to: '',
            date: moment().format('YYYY-MM-DD'),
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    };

    componentWillReceiveProps(nextProps: TProps, nextState: TState) {
        return;
    }

    /**
     * @param  {event} event
     * @returns void
     */
    handleChange(event: Object) {
        let newState: Object;

        switch (event.target.id) {
            case "from": newState = { from: event.target.value }; break;
            case "to": newState = { to: event.target.value }; break;
            case "date": newState = { date: event.target.value }; break;
        }
        this.setState( {...newState, submitted: false } );
    }

    /**
     * @param  {event} event
     * @returns void
     */
    handleSubmit(event: Object) {

        this.setState({ submitted: true });
        event.preventDefault();
    }

    /**
     * Method
     * @returns Flight
     */
    renderFlights() {
        return (
            <FlightList
                from={this.state.from}
                to={this.state.to}
                date={this.state.date}
                submitted={this.state.submitted}
            />
        );
    }

    render() {
        return (
        <div style={{ "margin": "200px" }}>
            <form onSubmit={this.handleSubmit}>
            <label>
                From:
                <input type='text' id="from" value={this.state.from} onChange={this.handleChange} />
                To:
                <input type='text' id="to" value={this.state.to} onChange={this.handleChange} />
                Date:
                <input type='text' id="date" value={this.state.date} onChange={this.handleChange} />
            </label>
            <input type='submit' value='Submit' />
            </form>
            <div>
            { this.renderFlights() }
            </div>
        </div>
        );
    }
}
