using Microsoft.Azure.Mobile.Server;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ReactTCCCService.DataObjects
{
    public class PatientCaseDataPoint : EntityData
    {
        /// <summary>
        /// A short non-human readable string identifying the kind of data it is (forename, bp reading etc)
        /// </summary>
        public string DataPointName { get; set; }
        /// <summary>
        /// How the data is encoded (as string, a binary blob, or a class name can go here)
        /// </summary>
        public string Encoding { get; set; }

        public DateTimeOffset? ArchivedAt { get; set; }

        // the actual data, we could lazy load this.
        // most things are transmitted as strings, and we should try and keep them that so we don't have to maniuplate them much
        public string StringValue { get; set; }

        // the owning patientcase
        public string ParentId { get; set; }

        // the utc time on the device
        public DateTimeOffset? DeviceCreatedAt { get; set; }

        public DateTimeOffset? QueuedAt { get; set; }


    }
}