//
// @flow
//

import _ from 'lodash';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import React from 'react';
import moment from 'moment';
import type { Element } from 'react';

type TProps = {
    allFlights?: Object[],
    date?: string,
    flights?: Object[],
    from: string,
    hasNextPage?: Boolean,
    loadMoreItems?: Function,
    loading?: Boolean,
    to: string,
};

type TItem = {
    node: {
        id: string,
        price: {
            amount: number,
            currency: string,
        }
    }
}

class FlightList extends React.Component<TProps> {
    props: TProps;
    _style: Object;

    constructor(props: TProps) {
        super(props);

        // for styling will be better to use css or styledComponent this is only WiP for
        // jsweekend
        this._style = {
            flightDescription: {
                float: 'left',
            },
            date: {
                width: '250px',
                float: 'left',
            },
            price: {
                float: 'right',
            },
            container: {
                marginTop: '10px',
                marginBottom: '10px',
                borderBottom: '1px solid grey',
                height: '40px',
                clear: 'both',
            }
        };
    }

    shouldComponentUpdate(nextProps: TProps) {
        return true;
    }
    renderFlights(): Element<'div'>[] {
        let items: Element<'div'>[] = [];

        if (this.props.flights) {
            items = this.props.flights.map((item: TItem): Element<'div'> => {

                return <div key={item.node.id} style={this._style.container}>
                        <div>
                            <div style={this._style.date}>Departure: {moment(item.node.departure.time).format('MM-DD-YYYY HH:m')}</div>
                            <div style={this._style.flightDescription}> - {item.node.departure.airport.name}</div>
                        </div>
                        <br />
                        <div>
                            <div style={this._style.date}>Arrival: {moment(item.node.arrival.time).format('MM-DD-YYYY HH:m')}</div>
                            <div style={this._style.flightDescription}> - {item.node.arrival.airport.name}</div>
                        </div>
                        <div key={item.node.id} style={this._style.price}>{`${item.node.price.amount} ${item.node.price.currency}`}</div>
                    </div>
            })
        }

        return items;
    }

    render(): Element<'div'> {
        if (!this.props.flights && this.props.submitted && !this.props.loading) {
            return (<div>No flights available</div>)
        }

        return (
            <div>
                { this.renderFlights() }
                { this.props.loading && <div>Loading...</div>}
                { this.props.hasNextPage && <button onClick={this.props.loadMoreItems}>Load more</button> }
            </div>
        );
    }
}

export default graphql(gql`
    query  allFlights($from: [LocationInput!]!, $to: [LocationInput!]!, $date: DateInput!,$after: String) {
        allFlights(search: {from: $from, to: $to, date: $date}, first:10, after: $after, options: { currency: EUR }) {
        pageInfo {
            hasNextPage
            endCursor
        }
        edges {
            node {
            id
            price {
                amount
                currency
            }
            arrival {
                airport {
                    locationId
                    name
                  }
                time
                localTime
            }
            departure {
                airport {
                locationId
                name
              }
                time
                localTime
            }
            }
        }
        }
    }
    `, {
        skip: (ownProps: TProps) => {
            return !(ownProps.from && ownProps.to && ownProps.date && ownProps.submitted);
        },
        // load parameters for request
        options: (ownProps: TProps) => {
            return {
                variables: {
                    from: { location: ownProps.from },
                    to: { location: ownProps.to },
                    date: { exact: ownProps.date },
                },
                // Thanks to this option props.data.loading is set to true
                // when fetchMore is called.
                notifyOnNetworkStatusChange: true,
            };
        },
        props: ({ ownProps: TProps, data: { error, allFlights, fetchMore, loading, variables } }) => {
        const hasNextPage:Boolean = _.get(allFlights, 'pageInfo.hasNextPage');
        return {
            flights: _.get(allFlights, 'edges'),
            hasNextPage,
            loading,
            loadMoreItems: () => {
                if (loading || !hasNextPage) {
                    return null;
                }

                return fetchMore({
                    variables: {
                        after: allFlights.pageInfo.endCursor,
                        notifyOnNetworkStatusChange: true,
                    },
                    updateQuery: (previousResult, { fetchMoreResult }): Object => {
                        if (!fetchMoreResult || !fetchMoreResult.allFlights.edges) { return previousResult; }
                        return Object.assign({}, previousResult, {
                            allFlights: {
                                edges: [
                                    ...previousResult.allFlights.edges,
                                    ...fetchMoreResult.allFlights.edges,
                                ],
                                pageInfo: fetchMoreResult.allFlights.pageInfo,
                            },
                        });
                    },
                });
            },
        };
    },
})(FlightList);
