import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as PropertiesState from '../store/Properties';
import { Property } from '../store/Properties';
import Properties from '../components/Properties';
import EditBox from './EditBox';
import DatapointDescriptor from '../store/DataPointDescriptor';
import DatapointDefinitions from '../store/DataPointDefinitions';
import ControlGenerator from './ControlGenerator';
import { Search } from 'history';

export function SearchHOC<Props,State> (WrappedComponent: new()=> React.Component<Props,State>) {
    return class SearchHOC extends React.Component<Props, State & { filterText?: string }> {
        constructor() {
            super();
            this.onSearchChange = this.onSearchChange.bind(this);
        }
        componentWillMount() {
            this.setState({ filterText: undefined });
        }
        onSearchChange(e: React.FormEvent<HTMLInputElement>) {
            //console.log('onSearchChange', e.currentTarget.value); 
            if (e.currentTarget) {
                let cur = e.currentTarget as HTMLInputElement;
                window.setTimeout((t:HTMLInputElement) => {
                    this.setState({ filterText: t.value });
                }, 100,cur);
            }
        }
        render() {
            
            return <div className='container-flex'>
                <div className='row'>
                    <div className='col-12'>
                        <h2>search: <input type="text" style={{ width: '100%' }} placeholder="search criteria across Property Ref, Address, Postcode and Offer Price" onInput={this.onSearchChange} onMouseUp={this.onSearchChange} /> </h2>
                        <WrappedComponent {...this.props} {...this.state} />
                        </div>
                </div>
            </div>;
        }
    }
}

