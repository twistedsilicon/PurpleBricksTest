import DatapointDescriptor, { EncodingTypes } from "./DataPointDescriptor";

export default class DatapointDefinitions {
    // this is the only one we should have in EVERY implementation.
    public static readonly CONTAINERNAME = new DatapointDescriptor({ dpn: "CN", descriptionTag: "CN", fallbackDescription: "Property Ref."});

    // Orange Blox
    public static readonly PROPERTYADDRESS1 = new DatapointDescriptor({dpn: "PADDR1", descriptionTag: "PADDR1", fallbackDescription: "Property Address Line 1", required: true, requiredMessage: 'Please specify at least the first line of the address'});
    public static readonly PROPERTYADDRESS2 = new DatapointDescriptor({ dpn: "PADDR2", descriptionTag: "PADDR2", fallbackDescription: "Property Address Line 2" });
    public static readonly PROPERTYPOSTCODE = new DatapointDescriptor({ dpn: "PPCODE", descriptionTag: "PPCODE", fallbackDescription: "PostCode", required:true, requiredMessage:'Please Specify a postcode' });
    public static readonly PROPERTYREGISTEREDON = new DatapointDescriptor({ dpn: "PRON", descriptionTag: "PRON", fallbackDescription: "Registered On", storeEncoding: EncodingTypes.Date, required: true });
    public static readonly PROPERTYNUMBERBEDROOMS = new DatapointDescriptor({ dpn: "PBEDS", descriptionTag: "PBEDS", fallbackDescription: "No. of Bedrooms", storeEncoding: EncodingTypes.Integer, required: true, max:'10', min:'1', validationMessage:'Please specify a number between 1 and 10', pattern:'^[0-9]+$' });
    public static readonly PROPERTYOFFERPRICE = new DatapointDescriptor({ dpn: "POFFER", descriptionTag: "POFFER", fallbackDescription: "Offer Price", storeEncoding: EncodingTypes.Decimal, required: true, pattern:'^[0-9]+$'});

    // provide a lookup function for our datapoints
    public static Lookup: { [key: string]: DatapointDescriptor } = [
        DatapointDefinitions.CONTAINERNAME,
        DatapointDefinitions.PROPERTYADDRESS1, DatapointDefinitions.PROPERTYADDRESS2, DatapointDefinitions.PROPERTYPOSTCODE, DatapointDefinitions.PROPERTYREGISTEREDON,
        DatapointDefinitions.PROPERTYNUMBERBEDROOMS, DatapointDefinitions.PROPERTYOFFERPRICE
        ]
        .reduce((p: { [key: string]: DatapointDescriptor }, c: DatapointDescriptor) => { p[c.dataPointName] = c; return p; }, {});
}