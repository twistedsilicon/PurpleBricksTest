using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Web.Http;
using Microsoft.Azure.Mobile.Server;
using Microsoft.Azure.Mobile.Server.Authentication;
using Microsoft.Azure.Mobile.Server.Config;
using ReactFrameworkService.DataObjects;
using ReactFrameworkService.Models;
using Owin;
using ReactFrameworkLogic.DataPoints;

namespace ReactFrameworkService
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

    public class ReactTCCCInitializer : CreateDatabaseIfNotExists<ReactFrameworkDBContext>
    {
        protected override void Seed(ReactFrameworkDBContext context)
        {
            KeyValuePair<DataPointDescriptor, string>[] itemsToAdd = new KeyValuePair<DataPointDescriptor, string>[]
            {
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.CASE_NAME,Utilities.CookNewCaseName()),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYADDRESS1,"99 Winterbourne Road"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYADDRESS2,"Solihull"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYPOSTCODE,"B91 1LU"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYNUMBERBEDROOMS,"4"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYOFFERPRICE,"350000"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYREGISTEREDON,"2018-05-29"),

                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.CASE_NAME,Utilities.CookNewCaseName()),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYADDRESS1,"11A Prospect Lane"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYADDRESS2,"Solihull"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYPOSTCODE,"B91 1RT"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYNUMBERBEDROOMS,"5"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYOFFERPRICE,"451000"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYREGISTEREDON,"2018-05-29"),

                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.CASE_NAME, Utilities.CookNewCaseName()),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYADDRESS1,"122B Baker Street"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYADDRESS2,"London"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYPOSTCODE,"NW1 6XE"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYNUMBERBEDROOMS,"2"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYOFFERPRICE,"670000"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYREGISTEREDON,"2018-05-25"),

                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.CASE_NAME, Utilities.CookNewCaseName()),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYADDRESS1,"10 Downing Street"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYADDRESS2,"London"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYPOSTCODE,"SW1A 2AA"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYNUMBERBEDROOMS,"4"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYOFFERPRICE,"1650000"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYREGISTEREDON,"2018-05-23"),

                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.CASE_NAME, Utilities.CookNewCaseName()),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYADDRESS1,"999 Letsby Avenue"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYADDRESS2,"London"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYPOSTCODE,"W4 4EL"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYNUMBERBEDROOMS,"2"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYOFFERPRICE,"540000"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYREGISTEREDON,"2018-05-21"),

                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.CASE_NAME, Utilities.CookNewCaseName()),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYADDRESS1,"120 Plum Corner"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYADDRESS2,"Coventry"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYPOSTCODE,"CV1 1RR"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYNUMBERBEDROOMS,"4"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYOFFERPRICE,"325000"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYREGISTEREDON,"2018-05-23"),

                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.CASE_NAME, Utilities.CookNewCaseName()),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYADDRESS1,"1456 Coventry Road"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYADDRESS2,"Coventry"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYPOSTCODE,"CV4 1QE"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYNUMBERBEDROOMS,"3"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYOFFERPRICE,"775000"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYREGISTEREDON,"2018-05-23"),


                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.CASE_NAME, Utilities.CookNewCaseName()),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYADDRESS1,"1201 St. Johns Road"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYADDRESS2,"Wolverhampton"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYPOSTCODE,"WV3 4EE"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYNUMBERBEDROOMS,"5"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYOFFERPRICE,"241000"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYREGISTEREDON,"2018-05-25"),

                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.CASE_NAME, Utilities.CookNewCaseName()),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYADDRESS1,"Apt 104 Crieff St"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYADDRESS2,"Wolverhampton"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYPOSTCODE,"WV8 7JT"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYNUMBERBEDROOMS,"2"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYOFFERPRICE,"142000"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYREGISTEREDON,"2018-05-25"),


                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.CASE_NAME, Utilities.CookNewCaseName()),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYADDRESS1,"630 The Royal Mile"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYADDRESS2,"Edinburgh"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYPOSTCODE,"ED1 9RX"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYNUMBERBEDROOMS,"6"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYOFFERPRICE,"1270000"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYREGISTEREDON,"2018-05-25"),

                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.CASE_NAME, Utilities.CookNewCaseName()),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYADDRESS1,"56 McCawber St"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYADDRESS2,"Edinburgh"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYPOSTCODE,"ED3 6RD"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYNUMBERBEDROOMS,"1"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYOFFERPRICE,"70000"),
                new KeyValuePair<DataPointDescriptor, string>(DataPointDefinitions.PROPERTYREGISTEREDON,"2018-05-25"),

            };

            List<ContainerDataPoint> pcdatapoints = new List<ContainerDataPoint>(itemsToAdd.Length);
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
                pcdatapoints.Add(new ContainerDataPoint { Id = (parentId == null ? caseId.Value : Guid.NewGuid()).ToString(), DeviceCreatedAt = DateTimeOffset.UtcNow, QueuedAt = DateTimeOffset.UtcNow, ParentId = parentId, DataPointName = itemToAdd.Key.DataPointName, Encoding = itemToAdd.Key.StoreEncoding, StringValue = itemToAdd.Value });
            };



            foreach (var c in pcdatapoints)
            {
                context.Set<ContainerDataPoint>().Add(c);
            }

            base.Seed(context);
        }
    }
}

