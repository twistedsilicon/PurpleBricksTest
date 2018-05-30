using System.Collections.ObjectModel;
using System.Threading.Tasks;
using ReactTCCCLogic.DataObjects;

namespace ReactTCCCLogic.Interfaces
{
    public interface IPatientCaseManager
    {
        Task<ObservableCollection<PatientCase>> GetPatientCasesAsync(bool syncItems = false);
        Task<PatientCase> GetPatientCaseAsync(string caseId); 
        Task<PatientCase> SavePatientCaseAsync(PatientCase item);
        Task SavePatientCaseDataPoints(PatientCase item);
        Task<PatientCase> CreateNewCase();
        Task SyncAsync();
    }
}