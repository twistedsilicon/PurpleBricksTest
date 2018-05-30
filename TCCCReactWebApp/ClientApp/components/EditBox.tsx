import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as PatientCasesState from '../store/PatientCases';
import { PatientCase, PatientCaseDataPoint } from '../store/PatientCases';
import PatientCases from 'ClientApp/components/PatientCases';
import { ChangeTargetHTMLProps, ChangeEvent } from 'react';
import DatapointDescriptor from 'ClientApp/store/DataPointDescriptor';

// At runtime, Redux will merge together...
type EditBoxProps =
    //PatientCasesState.PatientCaseState        // ... state we've requested from the Redux store
    //& typeof PatientCasesState.actionCreators      // ... plus action creators we've requested
    //& RouteComponentProps<{  }> //  no routing parameters 
    React.Ref<EditBox> & 
    Readonly<{ datapoint: PatientCaseDataPoint,descriptor:DatapointDescriptor, type:string, pattern:string  }>;

type PatientCaseDetailsState = { patientCase: PatientCase }

export default class EditBox extends React.Component<EditBoxProps, {currentText:string}> {
    constructor(props: any) {
        super(props);
        this.setTextBoxRef = this.setTextBoxRef.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
    }
    componentWillMount() {
        this.setState({ currentText: '' });
    }
    componentDidMount() {
        if (this.props.datapoint) {
            this.setState({ currentText: this.props.datapoint.stringValue });
        }
    }

    setTextBoxRef = (instance: any): any => { this.textBoxRef = instance; };
    textBoxRef: any;
    componentWillReceiveProps(nextProps: EditBoxProps) {
        // This method runs when incoming props (e.g., route params) change
        if (nextProps.datapoint) {
            this.setState({ currentText: nextProps.datapoint.stringValue });
        }
    }

    public getChangedValue(): PatientCaseDataPoint|undefined {
        let rv: PatientCaseDataPoint | undefined = undefined;
        let dp = this.props.datapoint;
        if (dp.stringValue !== this.textBoxRef.value) {
            console.log(`value has changed for datapoint ${dp.dataPointName} - old value ${dp.stringValue} - new value ${this.textBoxRef.value}`);
            rv = { ...dp };
            rv.id = ''; // reset the id, so we get a new one.
            rv.createdAt = new Date();
            rv.deviceCreatedAt = rv.createdAt;
            rv.updatedAt = undefined;
            rv.archivedAt = undefined;
            rv.queuedAt = new Date(0);

            rv.stringValue = this.textBoxRef.value;
        }

        return rv;
    }
    onTextChange(e: ChangeEvent<HTMLInputElement>) {
        if (e.target)
            this.setState({ currentText: e.target.value });
    }
    public render(): JSX.Element {
        let existingValue = '';
        
        return <input type={this.props.type} pattern={this.props.pattern} ref={this.setTextBoxRef} value={this.state.currentText}  onChange={this.onTextChange} />;
    }
}
