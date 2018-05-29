/*
 * To add Offline Sync Support:
 *  1) Add the NuGet package Microsoft.Azure.Mobile.Client.SQLiteStore (and dependencies) to all client projects
 *  2) Uncomment the #define OFFLINE_SYNC_ENABLED
 *
 * For more information, see: http://go.microsoft.com/fwlink/?LinkId=620342
 */
#define OFFLINE_SYNC_ENABLED

using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.MobileServices;
using ReactFrameworkLogic.DataObjects;
using ReactFrameworkLogic.DataPoints;
using ReactFrameworkLogic.Interfaces;
#if OFFLINE_SYNC_ENABLED
using Microsoft.WindowsAzure.MobileServices.SQLiteStore;
using Microsoft.WindowsAzure.MobileServices.Sync;
#else
using ReactFrameworkLogic.DataObjects;
using ReactFrameworkLogic.DataPoints;
#endif


namespace ReactFrameworkLogic.DataManagement
{
    public partial class DatapointContainerManager : IDatapointContainerManager
    {
        static DatapointContainerManager defaultInstance = new DatapointContainerManager();
        MobileServiceClient client;
        readonly DateTimeOffset JAVASCRIPTMINDATE = new DateTimeOffset(1970, 01, 01, 0, 0, 0,new TimeSpan(0));

#if OFFLINE_SYNC_ENABLED
        IMobileServiceSyncTable<ContainerDataPoint> containerDataPointTable;
#else
        IMobileServiceTable<ContainerDataPoint> containerDataPointTable;
#endif

        const string offlineDbPath = @"localstore.db";

        private DatapointContainerManager()
        {
            try
            {
                client = new MobileServiceClient(Constants.ApplicationURL);

#if OFFLINE_SYNC_ENABLED
                var store = new MobileServiceSQLiteStore(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), offlineDbPath));
                store.DefineTable<ContainerDataPoint>();

                //Initializes the SyncContext using the default IMobileServiceSyncHandler.
                client.SyncContext.InitializeAsync(store);

                containerDataPointTable = client.GetSyncTable<ContainerDataPoint>();

                //containerDataPointTable.PurgeAsync();
#else
                containerDataPointTable = client.GetTable<ContainerDataPoint>();
#endif
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.TraceError($"DatapointContainerManager.ctor() threw ex - {ex}");
                throw;
            }
        }

        public static DatapointContainerManager DefaultManager
        {
            get
            {
                return defaultInstance;
            }
            private set
            {
                defaultInstance = value;
            }
        }

        public MobileServiceClient CurrentClient
        {
            get { return client; }
        }

        public bool IsOfflineEnabled
        {
            get { return containerDataPointTable is Microsoft.WindowsAzure.MobileServices.Sync.IMobileServiceSyncTable<ContainerDataPoint>; }
        }

        public async Task<DatapointContainer> GetDatapointContainerAsync(string caseId)
        {
            DatapointContainer rv = new DatapointContainer();

            var datapoints = await containerDataPointTable.Where(pcdp =>
                pcdp.ParentId == caseId || (pcdp.DataPointName == DataPointDefinitions.CASE_NAME.DataPointName &&
                                            pcdp.Id == caseId)).ToListAsync();
            rv.ContainerDataPoints = datapoints;
            return rv;
        }

        public async Task<ObservableCollection<DatapointContainer>> GetDatapointContainersAsync(bool syncItems = false)
        {
            try
            {
#if OFFLINE_SYNC_ENABLED
                if (syncItems)
                {
                    await this.SyncAsync();
                }
#endif
                ICollection<ContainerDataPoint> items = await containerDataPointTable
                    //.Where(pcdp => pcdp.ArchivedAt == null)
                    .ToCollectionAsync();
                var allDataPoints = items;
                // select all the case names
                var containerElements = allDataPoints.Where(pcdp => pcdp.DataPointName == DataPointDefinitions.CASE_NAME.DataPointName);

                List<DatapointContainer> containers = new List<DatapointContainer>();
                foreach (var pce in containerElements)
                {
                    DatapointContainer container = new DatapointContainer();

                    container.ContainerDataPoints = allDataPoints.Where((pcdp => pcdp.ParentId == pce.Id || pcdp == pce)).ToList();
                    containers.Add(container);
                }

                return new ObservableCollection<DatapointContainer>(containers);
            }
            catch (MobileServiceInvalidOperationException msioe)
            {
                Debug.WriteLine(@"Invalid sync operation: {0}", msioe.Message);
            }
            catch (Exception e)
            {
                Debug.WriteLine(@"Sync error: {0}", e.Message);
            }
            return null;
        }

        public async Task<DatapointContainer> SaveDatapointContainerAsync(DatapointContainer item)
        {
            await SaveDatapointContainerDatapoints(item);
            return await GetDatapointContainerAsync(item.Id);
        }

        public async Task SaveDatapointContainerDatapoints(DatapointContainer item)
        {
            foreach (var datapoint in item.ContainerDataPoints)
            {
                if (datapoint.QueuedAt <= JAVASCRIPTMINDATE)
                {
                    datapoint.QueuedAt = DateTimeOffset.UtcNow;
                    await containerDataPointTable.InsertAsync(datapoint);

                }
                else
                {
                    // nope, we never update a datapoint, we only create new ones!
                    // means we have a track of all the changes made.
                    //await containerDataPointTable.UpdateAsync(datapoint);
                }
            }
        }

        public async Task<DatapointContainer> CreateNewDatapointContainer()
        {
            var rv = new DatapointContainer();
            await rv.Init();
            return rv;
        }

#if OFFLINE_SYNC_ENABLED
        public async Task SyncAsync()
        {
            ReadOnlyCollection<MobileServiceTableOperationError> syncErrors = null;

            try
            {
                await this.client.SyncContext.PushAsync();

                await this.containerDataPointTable.PullAsync(
                    //The first parameter is a query name that is used internally by the client SDK to implement incremental sync.
                    //Use a different query name for each unique query in your program
                    "allContainerDataPointItems",
                    this.containerDataPointTable.CreateQuery());

            }
            catch (MobileServicePushFailedException exc)
            {
                if (exc.PushResult != null)
                {
                    syncErrors = exc.PushResult.Errors;
                }
            }

            // Simple error/conflict handling. A real application would handle the various errors like network conditions,
            // server conflicts and others via the IMobileServiceSyncHandler.
            if (syncErrors != null)
            {
                foreach (var error in syncErrors)
                {
                    if (error.OperationKind == MobileServiceTableOperationKind.Update && error.Result != null)
                    {
                        //Update failed, reverting to server's copy.
                        await error.CancelAndUpdateItemAsync(error.Result);
                    }
                    else
                    {
                        // Discard local change.
                        await error.CancelAndDiscardItemAsync();
                    }

                    Debug.WriteLine(@"Error executing sync operation. Item: {0} ({1}). Operation discarded.", error.TableName, error.Item["id"]);
                }
            }
        }
#endif
    }
}
