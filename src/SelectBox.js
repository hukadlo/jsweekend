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

    /**
     * @constructor
     * @param  {TProps} props
     */
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

    /**
     * This method is called everytime when some change on
     * inpu is made and set value of local state to new value.
     * If callback has been set in props, will call it also.
     * @param  {event} input event
     * @returns void
     */
    onChange = (event: any, { newValue }: string) => {
        // TODO: do it some other way...
        this.setState({
            value: event.target.value || event.target.innerText,
        });

        this.props.onChange && this.props.onChange({value: this.state.value, id: this.props.id});
    };

    /**
     * Filtres all suggestions
     * @param  {string} value to filter
     * @returns {Aray<Object>} Array of cities which match value
     */
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

    /**
     * Autosuggest will call this function every time you need to update suggestions.
     * @param  {string} value to filter
     * @returns void
     */
    onSuggestionsFetchRequested = ({ value }: {value: string}): void => {
        this.setState({
            suggestions: this.getSuggestions(value),
        });
    };

    /**
     *  Autosuggest will call this function every time you need to clear suggestions.
     * @returns void
     */
    onSuggestionsClearRequested = (): void => {
        this.setState({
            suggestions: [],
        });
    };

    /**
     *  Renders suggestion
     * @returns div element with name of suggestion
     */
    renderSuggestion(suggestion: Object):Element<'div'> {
        return (<div>
            {suggestion.node.name}
        </div>);
    };

    /**
     *  Renders autosuggest input field
     * @returns Autosuggest component wrapped with div
     */
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
                    getSuggestionValue={(suggestion: Object) => suggestion.node.name}
                    renderSuggestion={this.renderSuggestion}
                    inputProps={inputProps}
                />
            </div>
        );
    }
}
