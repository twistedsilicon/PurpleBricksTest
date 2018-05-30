using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Web.Http;
using Microsoft.Azure.Mobile.Server;
using Microsoft.Azure.Mobile.Server.Authentication;
using Microsoft.Azure.Mobile.Server.Config;
using ReactTCCCService.DataObjects;
using ReactTCCCService.Models;
using ReactTCCCLogic.DataPoints;
using Owin;

namespace ReactTCCCService
{
    public partial class Startup
    {
        public static void ConfigureMobileApp(IAppBuilder app)
        {
            HttpConfiguration config = new HttpConfiguration();

            //For more information on Web API tracing, see http://go.microsoft.com/fwlink/?LinkId=620686 
            config.EnableSystemDiagnosticsTracing();

            new MobileAppConfiguration()
                .UseDefaultConfiguration()
                .ApplyTo(config);

            // Use Entity Framework Code First to create database tables based on your DbContext
            Database.SetInitializer(new ReactTCCCInitializer());

            // To prevent Entity Framework from modifying your database schema, use a null database initializer
            // Database.SetInitializer<ReactTCCCContext>(null);

            MobileAppSettingsDictionary settings = config.GetMobileAppSettingsProvider().GetMobileAppSettings();

            if (string.IsNullOrEmpty(settings.HostName))
            {
                // This middleware is intended to be used locally for debugging. By default, HostName will
                // only have a value when running in an App Service application.
                app.UseAppServiceAuthentication(new AppServiceAuthenticationOptions
                {
                    SigningKey = ConfigurationManager.AppSettings["SigningKey"],
                    ValidAudiences = new[] { ConfigurationManager.AppSettings["ValidAudience"] },
                    ValidIssuers = new[] { ConfigurationManager.AppSettings["ValidIssuer"] },
                    TokenHandler = config.GetAppServiceTokenHandler()
                });
            }
            app.UseWebApi(config);
        }
    }

    public class ReactTCCCInitializer : CreateDatabaseIfNotExists<ReactTCCCContext>
    {
        protected override void Seed(ReactTCCCContext context)
        {


            KeyValuePair<DataPointDescriptor, string>[] itemsToAdd = new KeyValuePair<DataPointDescriptor, string>[]
            {
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.CASE_NAME,Utilities.CookNewCaseName()),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PATIENT_FORENAME,"Terry"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PATIENT_SURNAME, "Woodruff"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.CASE_NAME, Utilities.CookNewCaseName()),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PATIENT_FORENAME,"Jenny"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PATIENT_SURNAME, "Woodruff")
            };

            List<PatientCaseDataPoint> pcdatapoints = new List<PatientCaseDataPoint>(itemsToAdd.Length);
            Guid? caseId = null;
            string parentId = null;
            foreach (var itemToAdd in itemsToAdd)
            {
                if (itemToAdd.Key == DataPointDefinitions.CASE_NAME)
                {
                    caseId = Guid.NewGuid();
                    parentId = null;
                }
                else
                {
                    parentId = caseId.ToString();
                }
                pcdatapoints.Add(new PatientCaseDataPoint { Id = (parentId == null ? caseId.Value : Guid.NewGuid()).ToString(), DeviceCreatedAt = DateTimeOffset.UtcNow, QueuedAt = DateTimeOffset.UtcNow, ParentId = parentId, DataPointName = itemToAdd.Key.DataPointName, Encoding = itemToAdd.Key.StoreEncoding, StringValue = itemToAdd.Value });
            };



            foreach (var c in pcdatapoints)
            {
                context.Set<PatientCaseDataPoint>().Add(c);
            }

            base.Seed(context);
        }
    }
}

