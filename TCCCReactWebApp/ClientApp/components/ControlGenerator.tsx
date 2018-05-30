import * as React from 'react';
import PatientCases from '../components/PatientCases';
import EditBox from './EditBox';
import DatapointDescriptor, { EncodingTypes } from '../store/DataPointDescriptor';
import DatapointDefinitions from '../store/DataPointDefinitions';
import { PatientCase } from 'ClientApp/store/PatientCases';

export default class ControlGenerator {
    public static CreateControl(descriptor: DatapointDescriptor, patientCase: PatientCase, addDataControl:(control:any)=>any): JSX.Element {
        let rv:JSX.Element|undefined;
        if (descriptor == DatapointDefinitions.CONTAINERNAME) {
            rv= <label>{patientCase.getPropertyStringValue(descriptor.dataPointName)}</label>;
        } else {
            let inputType: { type: string, pattern: string } = ControlGenerator.getInputTypeFromDescriptor(descriptor);
            rv = <EditBox type={inputType.type} pattern={inputType.pattern} ref={addDataControl} descriptor={descriptor} datapoint={patientCase.getCurrentDataPoint(descriptor.dataPointName) || patientCase.createNewDataPoint(descriptor.dataPointName)} />;
        }
        return rv;
    }
    private static getInputTypeFromDescriptor(descriptor: DatapointDescriptor): { type: string, pattern: string } {
        let rv = { type: 'text', pattern: '' };
        switch (descriptor.storeEncoding) {
            case EncodingTypes.Date:
                rv.type = 'date';
                break;
            case EncodingTypes.Integer:
                rv.type = 'text'; // with a pattern
                rv.pattern = '[0-9]+';
                break;
            case EncodingTypes.Decimal:
                rv.type = 'text'; // with a pattern
                rv.pattern = '^[0-9]*[.][0-9][0-9]$';
                break;
            case EncodingTypes.Float:
                rv.type = 'text'; // with a pattern
                rv.pattern = '^[0-9]*[.][0-9]+$';
                break;
        }
        return rv;
    }

}