export enum EncodingTypes {
    String = "s",
    Integer = "i",
    Boolean = "b",
    Float = "f",
    Decimal = "d",
    Date = "dt",
    DateTime="dtt",
    Image = "img",
    Geolocation = "gl",

}
export default class DatapointDescriptor {
    
    constructor(opts:{ dpn: string, descriptionTag: string, fallbackDescription: string, storeEncoding?: EncodingTypes,
        pattern?: string, required?: boolean, min?: string, max?: string, validationMessage?: string, requiredMessage?: string}) {
        this.dataPointName = opts.dpn;
        this.descriptionTag = opts.descriptionTag;
        this.fallbackDescription = opts.fallbackDescription;
        this.storeEncoding = opts.storeEncoding || EncodingTypes.String;
        this.pattern = opts.pattern;
        this.required = opts.required || false;
        this.validationMessage = opts.validationMessage;
        this.requiredMessage = opts.requiredMessage;
        this.max = opts.max;
        this.min = opts.min;
    }
    dataPointName: string; // the key for this item.
    descriptionTag: string; // a key for a localised description of this datapoint
    fallbackDescription: string; // until I get the localisation stuff in place.
    storeEncoding: EncodingTypes; // the format the data is persisted in.
    pattern: string | undefined;
    required: boolean;
    validationMessage: string | undefined; 
    requiredMessage: string | undefined;
    max: string | undefined;
    min: string | undefined;
}