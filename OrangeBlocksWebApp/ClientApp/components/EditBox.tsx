import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import { ChangeTargetHTMLProps, ChangeEvent } from 'react';
import DatapointDescriptor from '../store/DataPointDescriptor';
import { PropertyDataPoints } from 'ClientApp/store/Properties';

// At runtime, Redux will merge together...
type EditBoxProps =
    //PatientCasesState.PatientCaseState        // ... state we've requested from the Redux store
    //& typeof PatientCasesState.actionCreators      // ... plus action creators we've requested
    //& RouteComponentProps<{  }> //  no routing parameters 
    React.Ref<HTMLInputElement> & 
    Readonly<{ datapoint: PropertyDataPoints,descriptor:DatapointDescriptor, type:string, }>;


export default class EditBox extends React.Component<EditBoxProps, {currentText:string}> {
    constructor(props: any) {
        super(props);
        this.setTextBoxRef = this.setTextBoxRef.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
        this.checkValidity = this.checkValidity.bind(this);
    }
    componentWillMount() {
        this.setState({ currentText: '' });
    }
    componentDidMount() {
        if (this.props.datapoint) {
            this.setState({ currentText: this.props.datapoint.stringValue });
        }
    }
    componentWillUnmount() {
        if (this.textBoxRef) {
            this.textBoxRef.removeEventListener("input", this.checkValidity);
        }
    }

    checkValidity(ev: Event) {
        if (this.textBoxRef) {
            if (this.textBoxRef.validity.patternMismatch) {
                this.textBoxRef.setCustomValidity(this.props.descriptor.validationMessage || 'Please specify a valid value');
            } else if (this.textBoxRef.validity.valueMissing) {
                this.textBoxRef.setCustomValidity(this.props.descriptor.requiredMessage || 'This value is required');
            } else {
                this.textBoxRef.setCustomValidity('');
            }
        }
    }
    setTextBoxRef = (instance: HTMLInputElement|null): any => {
        this.textBoxRef = instance;
        if (instance) {
            instance.addEventListener('input', this.checkValidity);
        }
    };
    textBoxRef: HTMLInputElement|null;
    componentWillReceiveProps(nextProps: EditBoxProps) {
        // This method runs when incoming props (e.g., route params) change
        if (nextProps.datapoint) {
            this.setState({ currentText: nextProps.datapoint.stringValue });
        }
    }

    public getChangedValue(): PropertyDataPoints|undefined {
        let rv: PropertyDataPoints | undefined = undefined;
        let dp = this.props.datapoint;
        if (this.textBoxRef) {
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
        }

        return rv;
    }
    onTextChange(e: ChangeEvent<HTMLInputElement>) {
        if (e.target)
            this.setState({ currentText: e.target.value });
    }
    public render(): JSX.Element {
        let d = this.props.descriptor;
        return <input type={this.props.type} pattern={d.pattern} required={d.required} ref={this.setTextBoxRef} value={this.state.currentText} max={d.max} min={d.min} onChange={this.onTextChange} />;
    }
}
