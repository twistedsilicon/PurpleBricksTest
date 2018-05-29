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

        public static Dictionary<string, DataPointDescriptor> DATAPOINTDEFINITIONS = (new KeyValuePair<string, DataPointDescriptor>[]
        {
            new KeyValuePair<string, DataPointDescriptor>(PATIENT_SURNAME.DataPointName,PATIENT_SURNAME),
            new KeyValuePair<string, DataPointDescriptor>(PATIENT_FORENAME.DataPointName, PATIENT_FORENAME),
            new KeyValuePair<string, DataPointDescriptor>(CASE_NAME.DataPointName, CASE_NAME)

        }).ToDictionary(k => k.Key, v => v.Value);
    }
}
