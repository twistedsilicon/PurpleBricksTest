import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import * as PatientCasesState from '../store/PatientCases';
import { PatientCase } from '../store/PatientCases';
import PatientCases from '../components/PatientCases';
import EditBox from './EditBox';
import DatapointDescriptor from '../store/DataPointDescriptor';
import DatapointDefinitions from '../store/DataPointDefinitions';
import ControlGenerator from './ControlGenerator';

// At runtime, Redux will merge together...
type PatientCaseDetailsProps =
    PatientCasesState.PatientCaseState        // ... state we've requested from the Redux store
    & typeof PatientCasesState.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{patientCase: PatientCase}>; // ... plus incoming routing parameters, the case we want to show

type PatientCaseDetailsState = { patientCase: PatientCase }

class PatientCaseDetails extends React.Component<PatientCaseDetailsProps, {}> {
    constructor(props: any) {
        super(props);
        this.addDataControl = this.addDataControl.bind(this);
        this.dataControls = [];
    }
    componentWillMount() {
        // This method runs when the component is first added to the page
        this.doneButtonClicked = this.doneButtonClicked.bind(this); 
    }

    componentWillReceiveProps(nextProps: PatientCaseDetailsProps) {
        // This method runs when incoming props (e.g., route params) change
        //let startDateIndex = parseInt(nextProps.match.params.startDateIndex) || 0;
    }

    public render() {
        let pc = this.props.location.state.patientCase;
        console.log(this.props.location.state);
        if (!pc)
            return <div>No patient case selected</div>;
        let buttonDivStyle = { float: 'right' };

        return <div>
            <h1>Patient Case {pc.getPropertyStringValue("CN")}</h1>
            {this.renderPatientCaseDetailData(pc) }
            <div style={buttonDivStyle}><button onClick={this.doneButtonClicked}>DONE</button> </div>
        </div>;
    }

    private doneButtonClicked() {
        let valuesToUpate = this.dataControls.reduce((previousValue: PatientCasesState.PatientCaseDataPoint[] | null, currentValue: EditBox) => {
            let changedValue = currentValue.getChangedValue();
            if (changedValue) {
                if (!previousValue) {
                    previousValue = [];
                }
                previousValue.push(changedValue);
            }
            return previousValue;
        },[]);
        if (valuesToUpate.length)
            this.props.location.state.patientCase.containerDataPoints =
                this.props.location.state.patientCase.containerDataPoints.concat(valuesToUpate);

        this.props.updatePatientCase(this.props.location.state.patientCase);
        this.props.history.replace('/patientCases');
    }

    dataControls: any[]; 

    private addDataControl(control: EditBox) : any {
        this.dataControls.push(control);
    }
    private renderControlforProperty(pc: DatapointDescriptor, patientCase: PatientCase): JSX.Element {
        return ControlGenerator.CreateControl(pc, patientCase, this.addDataControl);
        /*if (pc == DatapointDefinitions.CONTAINERNAME) {
            return <label>{patientCase.getPropertyStringValue(pc.dataPointName)}</label>;
        } else {
            return <EditBox ref={this.addDataControl} descriptor={pc} datapoint={patientCase.getCurrentDataPoint(pc.dataPointName)|| patientCase.createNewDataPoint(pc.dataPointName)} />;
        } */
    } 
    private renderPatientCaseDetailData(patientCase : PatientCase) {
        var properties = [DatapointDefinitions.CONTAINERNAME, DatapointDefinitions.PATIENTFORENAME, DatapointDefinitions.PATIENTSURNAME, DatapointDefinitions.PATIENTDATEOFBIRTH];

        return <table className='table'>
            <thead>
                <tr>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {properties.map(pc =>
                    <tr key={pc.dataPointName}><td>{pc.fallbackDescription}</td>
                        <td>{this.renderControlforProperty(pc,patientCase)}</td>
                    </tr>)}
            </tbody>
        </table>;
    }

}

export default connect(
    (state: ApplicationState) => state.patientCases, // Selects which state properties are merged into the component's props
    PatientCasesState.actionCreators                 // Selects which action creators are merged into the component's props
)(PatientCaseDetails) as typeof PatientCaseDetails;
