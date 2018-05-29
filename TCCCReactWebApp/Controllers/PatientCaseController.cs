using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyModel;
using ReactFrameworkLogic.DataObjects;
using ReactFrameworkLogic.Interfaces;

namespace TCCCReactWebApp.Controllers
{
    [Produces("application/json")]
    [Route("api/DatapointContainer")]
    public class DatapointContainerController : Controller
    {
        private IDatapointContainerManager _datapointContainerManager;
        public DatapointContainerController(IDatapointContainerManager datapointContainerManager)
        {
            _datapointContainerManager = datapointContainerManager;
        }
        // GET: api/DatapointContainer
        [HttpGet]
        public async Task<IEnumerable<DatapointContainer>> Get()
        {
            return await _datapointContainerManager.GetDatapointContainersAsync(true);
        }

        // GET: api/DatapointContainer/5
        [HttpGet("{id}", Name = "Get")]
        public async Task<DatapointContainer> Get(string id)
        {
            return await _datapointContainerManager.GetDatapointContainerAsync(id);
        }

        // POST: api/DatapointContainer
        [HttpPost]
        public async Task<DatapointContainer> Post([FromBody]DatapointContainer value)
        {
            DatapointContainer caseToPost = value;
            if (value.CaseIsNew)
            {
                caseToPost = await _datapointContainerManager.CreateNewDatapointContainer();
            }
            caseToPost.MergeDataPoints(value.ContainerDataPoints);
            return await _datapointContainerManager.SaveDatapointContainerAsync(caseToPost);
        }

        // PUT: api/DatapointContainer/5
        [HttpPut("{id}")]
        public void Put(string id, [FromBody]DatapointContainer value)
        {
        }
        
        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(string id)
        {
        }
    }
}
