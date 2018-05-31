import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import * as PropertiesState from '../store/Properties';
import { Route } from 'react-router';
import { SearchHOC } from './SearchHOC';
import DatapointDefinitions from '../store/DataPointDefinitions';

// At runtime, Redux will merge together...
type PropertyProps =
    PropertiesState.PropertyState        // ... state we've requested from the Redux store
    & typeof PropertiesState.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{ lastUpdatedAt: number, syncWithServer: boolean }> // ... plus incoming routing parameters, lastupdatedAt is our concurrencyToken, syncWithServer explains itself
    & { filterText?: string };

type PropertyState = { isLoading: boolean };

class FetchPropertyData extends React.Component<PropertyProps, PropertyState> {
    componentWillMount() {
        // This method runs when the component is first added to the page
        let lastUpdatedAt = this.props.lastUpdatedAt || 0;
        this.setState({ isLoading: false });
        this.props.requestProperties(lastUpdatedAt, true); // initial mount, we try and sync
    }

    componentWillReceiveProps(nextProps: PropertyProps) {
        // This method runs when incoming props (e.g., route params) change
        //let startDateIndex = parseInt(nextProps.match.params.startDateIndex) || 0;
        let lastUpdatedAt = nextProps.lastUpdatedAt || 0;
        let syncwithServer = nextProps.match.params.syncWithServer || false;
        this.setState({isLoading: this.props.lastUpdatedAt != nextProps.lastUpdatedAt});
        this.props.requestProperties(lastUpdatedAt,syncwithServer);
    }

    public render() {
        let buttonRightDivStyle = { float: 'right' };
        let buttonLeftDivStyle = { float: 'left' };
        //console.log("Properties.render - filterText", this.props.filterText);
        let filtered = this.props.filterText ? <span className="label label-info">Filtered</span> : [];
        return <div>
            <h1>Active Properties {filtered}</h1>
            <div style={buttonRightDivStyle}><button onClick={() => { this.props.requestProperties((this.props.lastUpdatedAt || 0)+1,true) }}>Sync</button> </div>
            <div style={buttonLeftDivStyle}><button onClick={() => { this.props.history.replace('/propertyDetails', { property: this.props.createNewProperty() }); }}>Create New Property</button> </div>
            { this.renderPropertyDetail(this.props.filterText) }
        </div>;
    }

    private highlightSearchTerm(value: string, searchTerm?: string): JSX.Element[] {
        let rv: JSX.Element[] = [<span key={0}>{value}</span>];
        if (searchTerm && value) {
            let lvalue = value.toLowerCase();
            let lsearchTerm = searchTerm.toLowerCase();
            let position = 0;
            let nextPosition = 0;
            let arr: JSX.Element[] = [];
            let k = 0;
            nextPosition = lvalue.indexOf(lsearchTerm, position);
            while (nextPosition != -1) {
                arr.push(
                            <span key={k++}>{value.slice(position, nextPosition)}</span>,
                            <span key={k++} className='searchHighlight'>{value.slice(nextPosition, nextPosition + searchTerm.length)}</span>
                        );
                nextPosition += searchTerm.length;
                position = nextPosition;
                nextPosition = lvalue.indexOf(lsearchTerm, position);
            }
            if (k) {
                arr.push(
                    <span key={k++}>{value.slice(position)}</span>
                );
            }
            if (arr.length) {
                rv = arr;
            }
        }
        return rv;
    }

    private isRowVisible(searchTerm?: string, values?:string[]): boolean {
        let rv: boolean = true;
        if (searchTerm && values) {
            rv = false;
            searchTerm = searchTerm.toLowerCase();
            for (let i = 0; i < values.length; i++) {
                let lv = values[i].toLowerCase();
                let found = lv.toLowerCase().indexOf(searchTerm);
                if (found != -1) {
                    rv = true;
                    break;
                }
            }
        }
        return rv;
    }

    private renderPropertyDetail(filtertext?:string) {
        let body = [<tr key="0"><td colSpan={5}><span>Loading... please wait</span></td></tr>];
        let cn = DatapointDefinitions.CONTAINERNAME;
        let paddr1 = DatapointDefinitions.PROPERTYADDRESS1;
        let paddr2 = DatapointDefinitions.PROPERTYADDRESS2;
        let pcode = DatapointDefinitions.PROPERTYPOSTCODE;
        let poffer = DatapointDefinitions.PROPERTYOFFERPRICE;
        let filter = this.props.filterText;
        let pfn = this.highlightSearchTerm;
        let rowVisibleFn = this.isRowVisible;
        if (!this.state.isLoading) {
            body = this.props.containerDataPoints.map(pc => {
                let cnv = pc.getPropertyStringValue(cn.dataPointName);
                let paddr1v = pc.getPropertyStringValue(paddr1.dataPointName);
                let paddr2v = pc.getPropertyStringValue(paddr2.dataPointName);
                let pcodev = pc.getPropertyStringValue(pcode.dataPointName);
                let offerv = pc.getPropertyStringValue(poffer.dataPointName);
                let rowVisible = rowVisibleFn(filter, [cnv, paddr1v, paddr2v, pcodev, offerv]);

                return <tr key={cnv} className={rowVisible?'filter-in':'filter-out'} onClick={() => { this.props.history.replace('/propertyDetails', { property: pc }) }} >
                    <td>{pfn(cnv, filtertext)}</td>
                    <td>{pfn(paddr1v, filtertext)}</td>
                    <td>{pfn(paddr2v, filtertext)}</td>
                    <td>{pfn(pcodev, filtertext)}</td>
                    <td>{pfn(offerv, filtertext)}</td>
                </tr>
            });
        }

        return <table className='table'>
            <thead>
                <tr>
                    <th>Property Ref</th>
                    <th>Address Line 1</th>
                    <th>Address Line 2</th>
                    <th>PostCode</th>
                    <th>Offer Price(&pound;)</th>
                </tr>
            </thead>
            <tbody>
                {body}
            </tbody>
        </table>
    }

}

export default connect(
    (state: ApplicationState) => state.properties, // Selects which state properties are merged into the component's props
    PropertiesState.actionCreators                 // Selects which action creators are merged into the component's props
)(SearchHOC<PropertyProps, PropertyState>(FetchPropertyData)) as typeof FetchPropertyData;
