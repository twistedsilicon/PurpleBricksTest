import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import * as PatientCasesState from '../store/PatientCases';
import { Route } from 'react-router';

// At runtime, Redux will merge together...
type PatientCasesProps =
    PatientCasesState.PatientCaseState        // ... state we've requested from the Redux store
    & typeof PatientCasesState.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{lastUpdatedAt:number, syncWithServer:boolean}>; // ... plus incoming routing parameters, lastupdatedAt is our concurrencyToken, syncWithServer explains itself

class FetchPatientCaseData extends React.Component<PatientCasesProps, {}> {
    componentWillMount() {
        // This method runs when the component is first added to the page
        let lastUpdatedAt = this.props.match.params.lastUpdatedAt || 0;
        this.props.requestPatientCases(lastUpdatedAt, true); // initial mount, we try and sync
    }

    componentWillReceiveProps(nextProps: PatientCasesProps) {
        // This method runs when incoming props (e.g., route params) change
        //let startDateIndex = parseInt(nextProps.match.params.startDateIndex) || 0;
        let lastUpdatedAt = nextProps.match.params.lastUpdatedAt || 0;
        let syncwithServer = nextProps.match.params.syncWithServer || false;

        this.props.requestPatientCases(lastUpdatedAt,syncwithServer);
    }

    public render() {
        let buttonRightDivStyle = { float: 'right' };
        let buttonLeftDivStyle = { float: 'left' };
        return <div>
            <h1>Active Patient Cases</h1>
            <p>Currently active cases</p>
            <div style={buttonRightDivStyle}><button onClick={() => { this.props.requestPatientCases((this.props.lastUpdatedAt || 0)+1,true) }}>Sync</button> </div>
            <div style={buttonLeftDivStyle}><button onClick={() => { this.props.history.replace('/patientCaseDetail/', { patientCase: this.props.createNewPatientCase() }); }}>Create New Case</button> </div>
            { this.renderPatientCasesData() }
        </div>;
    }

    private renderPatientCasesData() {
        return <table className='table'>
            <thead>
                <tr>
                    <th>Case Name</th>
                    <th>Surname</th>
                    <th>Forename</th>
                    <th>Created at</th>
                </tr>
            </thead>
            <tbody>
                {this.props.containerDataPoints.map(pc =>
                    <tr key={pc.getPropertyStringValue('CN')} onClick={() => { this.props.history.replace('/patientCaseDetail/', {patientCase:pc} )  }} >
                        <td>{pc.getPropertyStringValue('CN') }</td>
                        <td>{pc.getPropertyStringValue('PSN') }</td>
                        <td>{pc.getPropertyStringValue('PFN') }</td>
                        <td>{pc.getPropertyStringValue('createdAt') }</td>
                </tr>
            )}
            </tbody>
        </table>;
    }

}

export default connect(
    (state: ApplicationState) => state.patientCases, // Selects which state properties are merged into the component's props
    PatientCasesState.actionCreators                 // Selects which action creators are merged into the component's props
)(FetchPatientCaseData) as typeof FetchPatientCaseData;
