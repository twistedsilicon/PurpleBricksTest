using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(ReactFrameworkService.Startup))]

namespace ReactFrameworkService
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureMobileApp(app);
        }
    }
}