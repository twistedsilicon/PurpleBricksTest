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
    
    constructor(dpn: string, descriptionTag: string, fallbackDescription: string, storeEncoding: EncodingTypes = EncodingTypes.String) {
        this.dataPointName = dpn;
        this.descriptionTag = descriptionTag;
        this.fallbackDescription = fallbackDescription;
        this.storeEncoding = storeEncoding;
    }
    dataPointName: string; // the key for this item.
    descriptionTag: string; // a key for a localised description of this datapoint
    fallbackDescription: string; // until I get the localisation stuff in place.
    storeEncoding: EncodingTypes; // the format the data is persisted in.
}