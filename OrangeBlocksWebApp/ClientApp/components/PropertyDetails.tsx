import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import * as PropertiesState from '../store/Properties';
import { Property } from '../store/Properties';
import Properties from '../components/Properties';
import EditBox from './EditBox';
import DatapointDescriptor from '../store/DataPointDescriptor';
import DatapointDefinitions from '../store/DataPointDefinitions';
import ControlGenerator from './ControlGenerator';

// At runtime, Redux will merge together...
type PropertyDetailProps =
    PropertiesState.PropertyState        // ... state we've requested from the Redux store
    & typeof PropertiesState.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{property: Property}>; // ... plus incoming routing parameters, the case we want to show


class PropertyDetails extends React.Component<PropertyDetailProps, {}> {
    constructor(props: any) {
        super(props);
        this.addDataControl = this.addDataControl.bind(this);
        this.dataControls = [];
    }
    componentWillMount() {
        // This method runs when the component is first added to the page
        this.doneButtonClicked = this.doneButtonClicked.bind(this); 
    }

    componentWillReceiveProps(nextProps: PropertyDetailProps) {
        // This method runs when incoming props (e.g., route params) change
        //let startDateIndex = parseInt(nextProps.match.params.startDateIndex) || 0;
    }

    public render() {
        let pc = this.props.location.state.property;
        console.log(this.props.location.state.property);
        if (!pc)
            return <div>No property selected</div>;
        let buttonDivStyle = { float: 'right' };

        return <div>
            <h1>Property Ref: {pc.getPropertyStringValue("CN")}</h1>
            {this.renderPatientCaseDetailData(pc) }
            <div style={buttonDivStyle}><button onClick={this.doneButtonClicked}>DONE</button> </div>
        </div>;
    }

    private doneButtonClicked() {
        if (this.detailsForm) {
            if (!this.detailsForm.checkValidity()) {
                return;
            }
        }
        let valuesToUpate = this.dataControls.reduce((previousValue: PropertiesState.PropertyDataPoints[] | null, currentValue: EditBox) => {
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
            this.props.location.state.property.containerDataPoints =
                this.props.location.state.property.containerDataPoints.concat(valuesToUpate);

        this.props.updateProperty(this.props.location.state.property);
        this.props.history.replace('/properties');
    }

    dataControls: any[]; 
    detailsForm: HTMLFormElement|null;

    private addDataControl(control: EditBox) : any {
        this.dataControls.push(control);
    }
    private renderControlforProperty(pc: DatapointDescriptor, property: Property): JSX.Element {
        return ControlGenerator.CreateControl(pc, property, this.addDataControl);
    } 
    private renderPatientCaseDetailData(property : Property) {
        var properties = [DatapointDefinitions.CONTAINERNAME, DatapointDefinitions.PROPERTYADDRESS1, DatapointDefinitions.PROPERTYADDRESS2, DatapointDefinitions.PROPERTYPOSTCODE, DatapointDefinitions.PROPERTYREGISTEREDON,
        DatapointDefinitions.PROPERTYNUMBERBEDROOMS, DatapointDefinitions.PROPERTYOFFERPRICE];

        return <form ref={(e) => { this.detailsForm = e; }}> <table className='table'>
            <thead>
                <tr>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {properties.map(pc =>
                    <tr key={pc.dataPointName}><td>{pc.fallbackDescription}</td>
                        <td>{this.renderControlforProperty(pc,property)}</td>
                    </tr>)}
            </tbody>
        </table> </form>;
    }

}

export default connect(
    (state: ApplicationState) => state.properties, // Selects which state properties are merged into the component's props
    PropertiesState.actionCreators                 // Selects which action creators are merged into the component's props
)(PropertyDetails) as typeof PropertyDetails;
