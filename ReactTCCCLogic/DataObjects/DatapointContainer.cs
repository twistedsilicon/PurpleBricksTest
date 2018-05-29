using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ReactFrameworkLogic.DataPoints;

namespace ReactFrameworkLogic.DataObjects
{
    public class DatapointContainer
    {
        public DatapointContainer()
        {
            ContainerDataPoints = new List<ContainerDataPoint>();
        }

        public async Task Init()
        {
            var caseNameDesriptor = DataPointDefinitions.CASE_NAME;
            string caseName = await Utilities.CookNewCaseNameAsync();
            ContainerDataPoints.Add(new ContainerDataPoint() { DataPointName = caseNameDesriptor.DataPointName, ParentId = null, Encoding = caseNameDesriptor.StoreEncoding, StringValue = caseName });
        }

        public string Id
        {
            get
            {
                var dp = ContainerDataPoints.FirstOrDefault(pcdp => pcdp.DataPointName == DataPointDefinitions.CASE_NAME.DataPointName);
                return dp?.Id.ToString();
            }
        }

        public bool HasCaseId
        {
            get
            {
                return ContainerDataPoints.Any(pcdp => pcdp.DataPointName == DataPointDefinitions.CASE_NAME.DataPointName && !string.IsNullOrEmpty(pcdp.Id));
            }
        }

        [JsonProperty(propertyName:"containerDataPoints")]
        public virtual ICollection<ContainerDataPoint> ContainerDataPoints { get; set; }
        public bool CaseIsNew
        {
            get
            {
                // only new if we haven't got any datapoints, or the case name datapoint doesn't have an id.
                return !HasCaseId;
            }
        }

        public void MergeDataPoints(ICollection<ContainerDataPoint> containerDataPoints)
        {
            List<ContainerDataPoint> itemsToAdd = new List<ContainerDataPoint>(containerDataPoints.Count);
            foreach(var pcdp in containerDataPoints.Where(dp=>dp.DataPointName != DataPointDefinitions.CASE_NAME.DataPointName))
            {
                if (pcdp.DataPointName != DataPointDefinitions.CASE_NAME.DataPointName)
                {
                    // we fix this one up
                    pcdp.Id = string.IsNullOrEmpty(pcdp.Id) ? Guid.NewGuid().ToString() : pcdp.Id;
                    pcdp.ParentId = this.Id; // fixup the parent
                    itemsToAdd.Add(pcdp);
                }
            }
            var newDataPoints = this.ContainerDataPoints.ToList();
            newDataPoints.AddRange(itemsToAdd);
            this.ContainerDataPoints = newDataPoints;
        }
    }
}
