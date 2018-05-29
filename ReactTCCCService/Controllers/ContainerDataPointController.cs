using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.OData;
using Microsoft.Azure.Mobile.Server;
using ReactFrameworkService.DataObjects;
using ReactFrameworkService.Models;

namespace ReactFrameworkService.Controllers
{
    public class ContainerDataPointController : TableController<ContainerDataPoint>
    {
        protected override void Initialize(HttpControllerContext controllerContext)
        {
            base.Initialize(controllerContext);
            ReactFrameworkDBContext context = new ReactFrameworkDBContext();
            DomainManager = new EntityDomainManager<ContainerDataPoint>(context, Request);
        }

        // GET tables/ContainerDataPoint
        public IQueryable<ContainerDataPoint> GetAllContainerDataPoint()
        {
            var rv = Query().ToList();
            return Query();
        }

        // GET tables/ContainerDataPoint/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public SingleResult<ContainerDataPoint> GetContainerDataPoint(string id)
        {
            return Lookup(id);
        }

        // PATCH tables/ContainerDataPoint/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public Task<ContainerDataPoint> PatchContainerDataPoint(string id, Delta<ContainerDataPoint> patch)
        {
            return UpdateAsync(id, patch);
        }

        // POST tables/ContainerDataPoint
        public async Task<IHttpActionResult> PostContainerDataPoint(ContainerDataPoint item)
        {
            ContainerDataPoint current = await InsertAsync(item);
            return CreatedAtRoute("Tables", new { id = current.Id }, current);
        }

        // DELETE tables/ContainerDataPoint/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public Task DeleteContainerDataPoint(string id)
        {
            return DeleteAsync(id);
        }
    }
}
