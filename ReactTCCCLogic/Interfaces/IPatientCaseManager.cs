using System.Collections.ObjectModel;
using System.Threading.Tasks;
using ReactFrameworkLogic.DataObjects;

namespace ReactFrameworkLogic.Interfaces
{
    public interface IDatapointContainerManager
    {
        Task<ObservableCollection<DatapointContainer>> GetDatapointContainersAsync(bool syncItems = false);
        Task<DatapointContainer> GetDatapointContainerAsync(string caseId); 
        Task<DatapointContainer> SaveDatapointContainerAsync(DatapointContainer item);
        Task SaveDatapointContainerDatapoints(DatapointContainer item);
        Task<DatapointContainer> CreateNewDatapointContainer();
        Task SyncAsync();
    }
}