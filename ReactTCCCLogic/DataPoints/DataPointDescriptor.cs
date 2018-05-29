using System;
using System.Collections.Generic;
using System.Text;

namespace ReactFrameworkLogic.DataPoints
{
    public class DataPointDescriptor
    {
        public readonly string DataPointName;
        public readonly string DescriptionTag;
        public readonly string StoreEncoding; // how the data is stored, usually as a string, but can be otherwise.

        internal DataPointDescriptor(string datapointName, string descriptionTag, string storeEncoding)
        {
            DataPointName = datapointName;
            DescriptionTag = descriptionTag;
            StoreEncoding = storeEncoding;            
        }
    }
}
