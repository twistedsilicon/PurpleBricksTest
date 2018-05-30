using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ReactTCCCLogic.DataPoints;

namespace ReactTCCCLogic.DataObjects
{
    public class PatientCase
    {
        public PatientCase()
        {
            PatientCaseDataPoints = new List<PatientCaseDataPoint>();
        }

        public async Task Init()
        {
            var caseNameDesriptor = DataPointDefinitions.CASE_NAME;
            string caseName = await Utilities.CookNewCaseNameAsync();
            PatientCaseDataPoints.Add(new PatientCaseDataPoint() { DataPointName = caseNameDesriptor.DataPointName, ParentId = null, Encoding = caseNameDesriptor.StoreEncoding, StringValue = caseName });
        }

        public string Id
        {
            get
            {
                return PatientCaseDataPoints.First(pcdp => pcdp.DataPointName == DataPointDefinitions.CASE_NAME.DataPointName).Id.ToString();
            }
        }

        public bool HasCaseId
        {
            get
            {
                return PatientCaseDataPoints.Any(pcdp => pcdp.DataPointName == DataPointDefinitions.CASE_NAME.DataPointName && !string.IsNullOrEmpty(pcdp.Id));
            }
        }


        public virtual ICollection<PatientCaseDataPoint> PatientCaseDataPoints { get; set; }
        public bool CaseIsNew
        {
            get
            {
                // only new if we haven't got any datapoints, or the case name datapoint doesn't have an id.
                return !HasCaseId;
            }
        }

        public void MergeDataPoints(ICollection<PatientCaseDataPoint> patientCaseDataPoints)
        {
            List<PatientCaseDataPoint> itemsToAdd = new List<PatientCaseDataPoint>(patientCaseDataPoints.Count);
            foreach(var pcdp in patientCaseDataPoints.Where(dp=>dp.DataPointName != DataPointDefinitions.CASE_NAME.DataPointName))
            {
                if (pcdp.DataPointName != DataPointDefinitions.CASE_NAME.DataPointName)
                {
                    // we fix this one up
                    pcdp.Id = string.IsNullOrEmpty(pcdp.Id) ? Guid.NewGuid().ToString() : pcdp.Id;
                    pcdp.ParentId = this.Id; // fixup the parent
                    itemsToAdd.Add(pcdp);
                }
            }
            var newDataPoints = this.PatientCaseDataPoints.ToList();
            newDataPoints.AddRange(itemsToAdd);
            this.PatientCaseDataPoints = newDataPoints;
        }
    }
}
