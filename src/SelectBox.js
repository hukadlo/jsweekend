//
// @flow
//

import React, { Component } from 'react';
import _ from 'lodash';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import type { Element } from 'react';

type TProps = {
    search: String,
};


class Select extends React.Component<TProps> {
    props: TProps;

    shouldComponentUpdate(nextProps: TProps) {
        return true;
    }

    handleChange(event: Object) {
        this.setState( { search: event.target.value } );
    }


    render(): Element<'select'> {
        return (
            <select onChange={this.handleChange}>
                { this.props.cities && this.props.cities.map(
                    (city) => {
                        return <option name={city.name}>{city.name}</option>;
                })}
            </select>
        );
    }
}

export default graphql(gql`
    query  allLocations($search: String) {
        allLocations(search: $search, first:10) {
            edges {
                node {
                    locationId
                    name
                }
            }
        }
    }
    `, {
        skip: (ownProps: TProps) => {
            return !ownProps.search;
        },
        // load parameters for request
        options: (ownProps: TProps) => {
            return {
                variables: {
                    search: ownProps.search,
                },
            };
        },
        props: ({ ownProps: TProps, data: { error, allLocations } }) => {
        return {
            cities: _.get(allLocations, 'edges'),
        };
    },
})(Select);
