using Newtonsoft.Json;
using System;

namespace ReactTCCCLogic.DataObjects
{
    public class PatientCaseDataPoint
    {

        public PatientCaseDataPoint()
        {
            DeviceCreatedAt = DateTimeOffset.UtcNow;
            Id = Guid.NewGuid().ToString();
        }
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }
        [JsonProperty(PropertyName = "version")]
        public string Version { get; set; }

        [JsonProperty(PropertyName = "parentId")]
        public string ParentId { get; set; }

        /// <summary>
        /// A short non-human readable string identifying the kind of data it is (forename, bp reading etc)
        /// </summary>
        [JsonProperty(PropertyName = "dataPointName")]
        public string DataPointName { get; set; }
        /// <summary>
        /// How the data is encoded (as string, a binary blob, or a class name can go here)
        /// </summary>
        [JsonProperty(PropertyName = "encoding")]
        public string Encoding { get; set; }

        [JsonProperty(PropertyName = "archivedAt")]
        public DateTimeOffset? ArchivedAt { get; set; }

        // the actual data, we could lazy load this.
        [JsonProperty(PropertyName = "stringValue")]
        public string StringValue { get; set; }

        /* Can't really use these on device, they have a special meaning when transmitted to the server */
        [JsonProperty(PropertyName = "createdAt")]
        public DateTimeOffset CreatedAt { get; set; }

        /* Can't really use these on device, they have a special meaning when transmitted to the server */
        [JsonProperty(PropertyName = "updatedAt")]
        public DateTimeOffset UpdatedAt { get; set; }

        [JsonProperty(PropertyName = "queuedAt")]
        public DateTimeOffset QueuedAt { get; set; }

        [JsonProperty(PropertyName = "deviceCreatedAt")]
        public DateTimeOffset DeviceCreatedAt { get; set; }
    }
}
