using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(ReactTCCCService.Startup))]

namespace ReactTCCCService
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureMobileApp(app);
        }
    }
}