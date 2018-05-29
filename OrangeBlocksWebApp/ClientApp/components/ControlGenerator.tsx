import * as React from 'react';
import Properties from '../components/Properties';
import EditBox from './EditBox';
import DatapointDescriptor, { EncodingTypes } from '../store/DataPointDescriptor';
import DatapointDefinitions from '../store/DataPointDefinitions';
import { Property } from '../store/Properties';

export default class ControlGenerator {
    public static CreateControl(descriptor: DatapointDescriptor, patientCase: Property, addDataControl:(control:any)=>any): JSX.Element {
        let rv:JSX.Element|undefined;
        if (descriptor == DatapointDefinitions.CONTAINERNAME) {
            rv= <label>{patientCase.getPropertyStringValue(descriptor.dataPointName)}</label>;
        } else {
            let inputType: { type: string } = ControlGenerator.getInputTypeFromDescriptor(descriptor);
            rv = <EditBox type={inputType.type}
                ref={addDataControl}
                descriptor={descriptor} datapoint={patientCase.getCurrentDataPoint(descriptor.dataPointName) || patientCase.createNewDataPoint(descriptor.dataPointName)} />;
        }
        return rv;
    }
    private static getInputTypeFromDescriptor(descriptor: DatapointDescriptor): { type: string} {
        let rv = { type: 'text' };
        switch (descriptor.storeEncoding) {
            case EncodingTypes.Date:
                rv.type = 'date';
                break;
            case EncodingTypes.Integer:
                rv.type = 'number'; // with a pattern
                break;
            case EncodingTypes.Decimal:
                rv.type = 'number'; // with a pattern
                //rv.pattern = descriptor.pattern; //'^[0-9]*[.][0-9][0-9]$';
                break;
            case EncodingTypes.Float:
                rv.type = 'number'; // with a pattern
                //rv.pattern = descriptor.pattern; //'^[0-9]*[.][0-9]+$';
                break;
        }
        return rv;
    }

}