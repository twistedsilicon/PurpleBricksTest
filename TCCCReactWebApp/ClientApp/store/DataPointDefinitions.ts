import DatapointDescriptor, { EncodingTypes } from "./DataPointDescriptor";

export default class DatapointDefinitions {
    // this is the only one we should have in EVERY implementation.
    public static readonly CONTAINERNAME = new DatapointDescriptor("CN", "CN", "Case Name");

    // TCCC
    public static readonly PATIENTFORENAME = new DatapointDescriptor("PFN", "PFN", "Forename");
    public static readonly PATIENTSURNAME = new DatapointDescriptor("PSN", "PSN", "Surname");
    public static readonly PATIENTDATEOFBIRTH = new DatapointDescriptor("PDOB", "PDOB", "Date of Birth", EncodingTypes.Date);

    // provide a lookup function for our datapoints
    public static Lookup: { [key: string]: DatapointDescriptor } = [
        DatapointDefinitions.CONTAINERNAME,
        DatapointDefinitions.PATIENTFORENAME, DatapointDefinitions.PATIENTSURNAME, DatapointDefinitions.PATIENTDATEOFBIRTH
        ]
        .reduce((p: { [key: string]: DatapointDescriptor }, c: DatapointDescriptor) => { p[c.dataPointName] = c; return p; }, {});
}