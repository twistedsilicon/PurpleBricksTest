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
using ReactTCCCLogic.DataObjects;
using ReactTCCCLogic.DataPoints;
using ReactTCCCLogic.Interfaces;
#if OFFLINE_SYNC_ENABLED
using Microsoft.WindowsAzure.MobileServices.SQLiteStore;
using Microsoft.WindowsAzure.MobileServices.Sync;
#else
using ReactTCCLogic.DataObjects;
using ReactTCCLogic.DataPoints;
#endif


namespace ReactTCCCLogic.DataManagement
{
    public partial class PatientCaseManager : IPatientCaseManager
    {
        static PatientCaseManager defaultInstance = new PatientCaseManager();
        MobileServiceClient client;
        readonly DateTimeOffset JAVASCRIPTMINDATE = new DateTimeOffset(1970, 01, 01, 0, 0, 0,new TimeSpan(0));

#if OFFLINE_SYNC_ENABLED
        IMobileServiceSyncTable<PatientCaseDataPoint> patientCaseDataPointTable;
#else
        IMobileServiceTable<PatientCaseDataPoint> patientCaseDataPointTable;
#endif

        const string offlineDbPath = @"localstore.db";

        private PatientCaseManager()
        {
            try
            {
                client = new MobileServiceClient(Constants.ApplicationURL);

#if OFFLINE_SYNC_ENABLED
                var store = new MobileServiceSQLiteStore(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), offlineDbPath));
                store.DefineTable<PatientCaseDataPoint>();

                //Initializes the SyncContext using the default IMobileServiceSyncHandler.
                client.SyncContext.InitializeAsync(store);

                patientCaseDataPointTable = client.GetSyncTable<PatientCaseDataPoint>();

                //patientCaseDataPointTable.PurgeAsync();
#else
                patientCaseDataPointTable = client.GetTable<PatientCaseDataPoint>();
#endif
            }
            catch(Exception ex)
            {
                System.Diagnostics.Trace.TraceError($"PatientCaseManager.ctor() threw ex - {ex}");
                throw;
            }
        }

        public static PatientCaseManager DefaultManager
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
            get { return patientCaseDataPointTable is Microsoft.WindowsAzure.MobileServices.Sync.IMobileServiceSyncTable<PatientCaseDataPoint>; }
        }

        public async Task<PatientCase> GetPatientCaseAsync(string caseId)
        {
            PatientCase rv = new PatientCase();

            var datapoints = await patientCaseDataPointTable.Where(pcdp =>
                pcdp.ParentId == caseId || (pcdp.DataPointName == DataPointDefinitions.CASE_NAME.DataPointName &&
                                            pcdp.Id == caseId)).ToListAsync();
            rv.PatientCaseDataPoints = datapoints;
            return rv;
        }

        public async Task<ObservableCollection<PatientCase>> GetPatientCasesAsync(bool syncItems = false)
        {
            try
            {
#if OFFLINE_SYNC_ENABLED
                if (syncItems)
                {
                    await this.SyncAsync();
                }
#endif
                ICollection<PatientCaseDataPoint> items = await patientCaseDataPointTable
                    //.Where(pcdp => pcdp.ArchivedAt == null)
                    .ToCollectionAsync();
                var allDataPoints = items;
                // select all the case names
                var patientCaseElements = allDataPoints.Where(pcdp => pcdp.DataPointName == DataPointDefinitions.CASE_NAME.DataPointName);

                List<PatientCase> patientCases = new List<PatientCase>();
                foreach (var pce in patientCaseElements)
                {
                    PatientCase patientCase = new PatientCase();

                    patientCase.PatientCaseDataPoints = allDataPoints.Where((pcdp => pcdp.ParentId == pce.Id || pcdp == pce)).ToList();
                    patientCases.Add(patientCase);
                }

                return new ObservableCollection<PatientCase>(patientCases);
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

        public async Task<PatientCase> SavePatientCaseAsync(PatientCase item)
        {
            await SavePatientCaseDataPoints(item);
            return await GetPatientCaseAsync(item.Id);
        }

        public async Task SavePatientCaseDataPoints(PatientCase item)
        {
            foreach (var datapoint in item.PatientCaseDataPoints)
            {
                if (datapoint.QueuedAt <= JAVASCRIPTMINDATE)
                {
                    datapoint.QueuedAt = DateTimeOffset.UtcNow;
                    await patientCaseDataPointTable.InsertAsync(datapoint);

                }
                else
                {
                    // nope, we never update a datapoint, we only create new ones!
                    // means we have a track of all the changes made.
                    //await patientCaseDataPointTable.UpdateAsync(datapoint);
                }
            }
        }

        public async Task<PatientCase> CreateNewCase()
        {
            var rv = new PatientCase();
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

                await this.patientCaseDataPointTable.PullAsync(
                    //The first parameter is a query name that is used internally by the client SDK to implement incremental sync.
                    //Use a different query name for each unique query in your program
                    "allpatientCaseDataPointItems",
                    this.patientCaseDataPointTable.CreateQuery());

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
