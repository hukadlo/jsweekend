//
// @flow
//

import FlightList from './FlightList';
import React from 'react';
import SelectBox from './SelectBox';
import moment from 'moment';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import type { Element } from 'react';

type TProps = {
    cities: Object[],
};

type TState = {
    from: string,
    to: string,
    date: string,
    submitted: boolean,
}

class App extends React.Component<TProps, TState> {
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
            submitted: false,
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    };

    /**
     * @param  {event} event
     * @returns void
     */
    handleChange(event: {id: string, value: string, target: {value: string, id: string}}) {
        let newState: Object;
        const inputId: string = event.id || event.target.id;

        switch (inputId) {
            case 'from': newState = { from: event.value }; break;
            case 'to': newState = { to: event.value }; break;
            case 'date': newState = { date: event.target.value }; break;
        }
        this.setState( {...newState, submitted: false} );
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
                allFlights={[]}
            />
        );
    }

    /**
     * Method renders form with 3 inputs and results of search after submit
     * @returns Flight
     */
    render(): Element<'div'> {
        return (
            // FIXME: style should not be here (styledComponent)
            <div style={{ 'margin': '200px' }}>
                <form onSubmit={this.handleSubmit}>
                <label>
                    <SelectBox
                        onChange={this.handleChange}
                        cities={this.props.cities}
                        id='from'
                        placeholder='type from'/>
                    <SelectBox
                        onChange={this.handleChange}
                        cities={this.props.cities}
                        id='to'
                        placeholder='type destination'/>
                    {/* TODO: use datepicker */}
                    Date:
                    <input type='text' id='date' value={this.state.date} onChange={this.handleChange} />
                </label>
                <input type='submit' value='SEARCH FLIGHTS' />
                </form>

                <div>
                { this.state.submitted && this.renderFlights() }
                </div>
            </div>
        );
    }
}
// FIXME: it's quite heavy to fetch allLocations at once but this happens only once at the start
export default graphql(gql`
    query  allLocations {
        allLocations {
            edges {
                node {
                    locationId
                    name
                }
            }
        }
    }
    `,{
        props: ({ ownProps: TProps, data: { error, allLocations } }) => {
            return {
                cities: allLocations && allLocations.edges,
            };
    },
})(App);
