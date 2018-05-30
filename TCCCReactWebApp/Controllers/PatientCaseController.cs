using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyModel;
using ReactTCCCLogic.DataObjects;
using ReactTCCCLogic.Interfaces;

namespace TCCCReactWebApp.Controllers
{
    [Produces("application/json")]
    [Route("api/PatientCase")]
    public class PatientCaseController : Controller
    {
        private IPatientCaseManager _patientCaseManager;
        public PatientCaseController(IPatientCaseManager patientCaseManager)
        {
            _patientCaseManager = patientCaseManager;
        }
        // GET: api/PatientCase
        [HttpGet]
        public async Task<IEnumerable<PatientCase>> Get()
        {
            return await _patientCaseManager.GetPatientCasesAsync(true);
        }

        // GET: api/PatientCase/5
        [HttpGet("{id}", Name = "Get")]
        public async Task<PatientCase> Get(string id)
        {
            return await _patientCaseManager.GetPatientCaseAsync(id);
        }
        
        // POST: api/PatientCase
        [HttpPost]
        public async Task<PatientCase> Post([FromBody]PatientCase value)
        {
            PatientCase caseToPost = value;
            if (value.CaseIsNew)
            {
                caseToPost = await _patientCaseManager.CreateNewCase();
            }
            caseToPost.MergeDataPoints(value.PatientCaseDataPoints);
            return await _patientCaseManager.SavePatientCaseAsync(caseToPost);
        }
        
        // PUT: api/PatientCase/5
        [HttpPut("{id}")]
        public void Put(string id, [FromBody]PatientCase value)
        {
        }
        
        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(string id)
        {
        }
    }
}
