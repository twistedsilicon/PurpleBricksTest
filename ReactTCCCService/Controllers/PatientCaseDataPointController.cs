using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.OData;
using Microsoft.Azure.Mobile.Server;
using ReactTCCCService.DataObjects;
using ReactTCCCService.Models;

namespace TCCCXamarinService.Controllers
{
    public class PatientCaseDataPointController : TableController<PatientCaseDataPoint>
    {
        protected override void Initialize(HttpControllerContext controllerContext)
        {
            base.Initialize(controllerContext);
            ReactTCCCContext context = new ReactTCCCContext();
            DomainManager = new EntityDomainManager<PatientCaseDataPoint>(context, Request);
        }

        // GET tables/PatientCaseDataPoint
        public IQueryable<PatientCaseDataPoint> GetAllPatientCaseDataPoint()
        {
            var rv = Query().ToList();
            return Query();
        }

        // GET tables/PatientCaseDataPoint/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public SingleResult<PatientCaseDataPoint> GetPatientCaseDataPoint(string id)
        {
            return Lookup(id);
        }

        // PATCH tables/PatientCaseDataPoint/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public Task<PatientCaseDataPoint> PatchPatientCaseDataPoint(string id, Delta<PatientCaseDataPoint> patch)
        {
            return UpdateAsync(id, patch);
        }

        // POST tables/PatientCaseDataPoint
        public async Task<IHttpActionResult> PostPatientCaseDataPoint(PatientCaseDataPoint item)
        {
            PatientCaseDataPoint current = await InsertAsync(item);
            return CreatedAtRoute("Tables", new { id = current.Id }, current);
        }

        // DELETE tables/PatientCaseDataPoint/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public Task DeletePatientCaseDataPoint(string id)
        {
            return DeleteAsync(id);
        }
    }
}
