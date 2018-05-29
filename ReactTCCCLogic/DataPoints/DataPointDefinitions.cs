using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace ReactFrameworkLogic.DataPoints
{
    public class DataPointDefinitions
    {
        public readonly static DataPointDescriptor CASE_NAME = new DataPointDescriptor("CN", "CN", Encodings.String);
        public readonly static DataPointDescriptor PATIENT_SURNAME = new DataPointDescriptor("PSN", "PSN", Encodings.String);
        public readonly static DataPointDescriptor PATIENT_FORENAME = new DataPointDescriptor("PFN", "PFN", Encodings.String);

        public static readonly DataPointDescriptor PROPERTYADDRESS1 = new DataPointDescriptor("PADDR1", "PADDR1",Encodings.String);
    public static readonly DataPointDescriptor PROPERTYADDRESS2 = new DataPointDescriptor("PADDR2","PADDR2",Encodings.String);
    public static readonly DataPointDescriptor PROPERTYPOSTCODE = new DataPointDescriptor("PPCODE","PPCODE",Encodings.String);
    public static readonly DataPointDescriptor PROPERTYREGISTEREDON = new DataPointDescriptor("PRON", "PRON",Encodings.Date);
    public static readonly DataPointDescriptor PROPERTYNUMBERBEDROOMS = new DataPointDescriptor("PBEDS","PBEDS",Encodings.Integer);
    public static readonly DataPointDescriptor PROPERTYOFFERPRICE = new DataPointDescriptor("POFFER", "POFFER",Encodings.Decimal);


        public static Dictionary<string, DataPointDescriptor> DATAPOINTDEFINITIONS = (new KeyValuePair<string, DataPointDescriptor>[]
        {
            new KeyValuePair<string, DataPointDescriptor>(PATIENT_SURNAME.DataPointName,PATIENT_SURNAME),
            new KeyValuePair<string, DataPointDescriptor>(PATIENT_FORENAME.DataPointName, PATIENT_FORENAME),
            new KeyValuePair<string, DataPointDescriptor>(PROPERTYADDRESS1.DataPointName, PROPERTYADDRESS1),
            new KeyValuePair<string, DataPointDescriptor>(PROPERTYADDRESS2.DataPointName, PROPERTYADDRESS2),
            new KeyValuePair<string, DataPointDescriptor>(PROPERTYPOSTCODE.DataPointName, PROPERTYPOSTCODE),
            new KeyValuePair<string, DataPointDescriptor>(PROPERTYREGISTEREDON.DataPointName, PROPERTYREGISTEREDON),
            new KeyValuePair<string, DataPointDescriptor>(PROPERTYNUMBERBEDROOMS.DataPointName, PROPERTYNUMBERBEDROOMS),
            new KeyValuePair<string, DataPointDescriptor>(PROPERTYOFFERPRICE.DataPointName, PROPERTYOFFERPRICE)

        }).ToDictionary(k => k.Key, v => v.Value);
    }
}
