import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import * as PropertiesState from '../store/Properties';
import { Route } from 'react-router';

// At runtime, Redux will merge together...
type PropertyProps =
    PropertiesState.PropertyState        // ... state we've requested from the Redux store
    & typeof PropertiesState.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{lastUpdatedAt:number, syncWithServer:boolean}>; // ... plus incoming routing parameters, lastupdatedAt is our concurrencyToken, syncWithServer explains itself

class FetchPropertyData extends React.Component<PropertyProps, {isLoading:boolean}> {
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
        return <div>
            <h1>Active Properties</h1>
            <div style={buttonRightDivStyle}><button onClick={() => { this.props.requestProperties((this.props.lastUpdatedAt || 0)+1,true) }}>Sync</button> </div>
            <div style={buttonLeftDivStyle}><button onClick={() => { this.props.history.replace('/propertyDetails', { property: this.props.createNewProperty() }); }}>Create New Property</button> </div>
            { this.renderPropertyDetail() }
        </div>;
    }

    private renderPropertyDetail() {
        let body = [<tr key="0"><td colSpan={5}><span>Loading... please wait</span></td></tr>];

        if (!this.state.isLoading) {
            body = this.props.containerDataPoints.map(pc =>
                <tr key={pc.getPropertyStringValue('CN')} onClick={() => { this.props.history.replace('/propertyDetails', { property: pc }) }} >
                    <td>{pc.getPropertyStringValue('CN')}</td>
                    <td>{pc.getPropertyStringValue('PADDR1')}</td>
                    <td>{pc.getPropertyStringValue('PPCODE')}</td>
                    <td>{pc.getPropertyStringValue('POFFER')}</td>
                    <td>{pc.getPropertyStringValue('createdAt')}</td>
                </tr>
            );
        }

        return <table className='table'>
            <thead>
                <tr>
                    <th>Property Ref</th>
                    <th>Address Line 1</th>
                    <th>PostCode</th>
                    <th>Offer Price(&pound;)</th>
                    <th>Created at</th>
                </tr>
            </thead>
            <tbody>
                {body}
            </tbody>
        </table>;
    }

}

export default connect(
    (state: ApplicationState) => state.properties, // Selects which state properties are merged into the component's props
    PropertiesState.actionCreators                 // Selects which action creators are merged into the component's props
)(FetchPropertyData) as typeof FetchPropertyData;
