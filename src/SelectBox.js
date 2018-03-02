//
// @flow
//

import _ from 'lodash';
import Autosuggest from 'react-autosuggest';
import React from 'react';

import type { Element } from 'react';

type TProps = {
    cities: Object[],
    id: string,
    onChange: Function,
    placeholder: string,
}

type TState = {
    value: string,
    suggestions?: Array<Object>,
    cities?: Object[],
}
export default class SelectBox extends React.Component<TProps, TState> {
    constructor(props: TProps) {
        super(props);

        // Autosuggest is a controlled component.
        // This means that you need to provide an input value
        // and an onChange handler that updates this value.
        // Suggestions also need to be provided to the Autosuggest
        this.state = {
            value: '',
            suggestions: [],
        };
    }

    componentWillReceiveProps(nextProps: TProps) {
        this.setState({ cities: nextProps.cities });
    }

    onChange = (event: any, { newValue }: string) => {
        // FIXME: not really nice to do it like this
        this.setState({
            value: event.target.value || event.target.innerText,
        });

        // FIXME: better propagate data to upper component
        this.props.onChange && this.props.onChange({value: this.state.value, id: this.props.id});
    };

    getSuggestions = (value: string): Object[] => {
        const inputValue: string = value.trim().toLowerCase();
        const inputLength: number = inputValue.length;
        const cities: Object[] = _.get(this, 'props.cities') || [];

        return inputLength === 0
            ? []
            : cities.filter((suggestion) => {
                return suggestion.node.name.toLowerCase().slice(0, inputLength) === inputValue;
            }
        );
    };

    // Autosuggest will call this function every time you need to update suggestions.
    onSuggestionsFetchRequested = ({ value }: {value: string}): void => {
        this.setState({
            suggestions: this.getSuggestions(value),
        });
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested = (): void => {
        this.setState({
            suggestions: [],
        });
    };

    renderSuggestion(suggestion: Object):Element<'div'> {
        return (<div>
            {suggestion.node.name}
        </div>);
    };

    getSuggestionValue(suggestion: Object) {
        return suggestion.node.name;
    };

    render() {
        const { value, suggestions } = this.state;

        // Autosuggest will pass through all these props to the input.
        const inputProps = {
            placeholder: this.props.placeholder,
            value,
            onChange: this.onChange
        };

        return (
            // FIXME: styling should not be here
            <div style={{ float: 'left', width: '150px', overflow: 'visible'}}>
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={this.renderSuggestion}
                    inputProps={inputProps}
                />
            </div>
        );
    }
}
