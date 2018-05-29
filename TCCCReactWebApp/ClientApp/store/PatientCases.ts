import { fetch, addTask  } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import DatapointDefinitions from './DataPointDefinitions';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface PatientCaseState {
    isLoading: boolean;
    lastUpdatedAt?: number;
    containerDataPoints: PatientCase[];
}

export interface PatientCaseDataPoint {
    id?: string,
    version?: string,
    parentId?: string,
    dataPointName: string,
    encoding: string,
    archivedAt?: Date,
    stringValue: string,
    createdAt: Date,
    updatedAt?: Date,
    queuedAt?: Date,
    deviceCreatedAt?:Date,
}

// has to match what we have in ReactTCCCLogic.DataObject.PatientCases
export interface PatientCase {
    containerDataPoints: PatientCaseDataPoint[];
    getPropertyStringValue(propName: string): string;
    getCurrentDataPoint(propName: string): PatientCaseDataPoint | undefined;
    createNewDataPoint(propName: string): PatientCaseDataPoint;
}

class PatientCaseImplementation implements PatientCase {   
    constructor(copy?: PatientCase) {
        if (copy != null)
            this.containerDataPoints = copy.containerDataPoints;
        else {
            this.containerDataPoints = [];
        }
    }
    containerDataPoints: PatientCaseDataPoint[];

    getCurrentDataPoint(propName: string): PatientCaseDataPoint | undefined {
        let foundProp: PatientCaseDataPoint | undefined;
        let latestPropCreatedAtTime: Date = new Date(0);
        if (propName) {
            foundProp = this.containerDataPoints.reduce((previousValue:PatientCaseDataPoint|undefined, currentValue: PatientCaseDataPoint) => {
                if (currentValue.dataPointName.toUpperCase() == propName.toUpperCase() && (previousValue == null || currentValue.createdAt > latestPropCreatedAtTime) ) {
                    latestPropCreatedAtTime = currentValue.createdAt;
                    previousValue = currentValue;
                }
                return previousValue;
            }, foundProp); 
            //foundProp = this.patientCaseDataPoints.find((value: PatientCaseDataPoint) => { return value.dataPointName.toUpperCase() == propName.toUpperCase(); });
            if (!foundProp) {
                //one of our special names
                if (propName == 'createdAt') {
                    // created at, find the date time that the CN datapoint was created.                   
                    foundProp = this.containerDataPoints.find((value: PatientCaseDataPoint) => { return value.dataPointName.toUpperCase() == 'CN' });
                }
            }
        }
        return foundProp;
    }

    getPropertyStringValue(propName: string): string {
        let rv = '';
        let datapoint = this.getCurrentDataPoint(propName);
        if (datapoint) {
            if (propName !== 'createdAt') {
                rv = datapoint.stringValue;
            } else {
                rv = datapoint.createdAt.toString();
            }
        }
        return rv;
    }
    static createNew() : PatientCase {
        let rv = new PatientCaseImplementation();
        // and Id of empty string indicates this is a new case.
        let cndpd = DatapointDefinitions.CONTAINERNAME;
        rv.containerDataPoints = [{ id: '', dataPointName: cndpd.dataPointName, stringValue: 'New Case', encoding: cndpd.storeEncoding, createdAt:new Date() }];
        return rv;       
    }

    getCaseId(): string | undefined {
        let dpd = DatapointDefinitions.CONTAINERNAME;
        let cn = this.getCurrentDataPoint(dpd.dataPointName);
        let rv = undefined;
        if (cn) {
            rv = cn.id;
        }
        return rv;
    }
    createNewDataPoint(datapointname: string): PatientCaseDataPoint {
        let dpd = DatapointDefinitions.Lookup[datapointname];
        let encoding = 's';
        if (!dpd) {
            console.error(`new data point with name ${datapointname} - but not defined in DatapointDefinitions `);
        } else {
            encoding = dpd.storeEncoding
        }
        let rv = { id: '', dataPointName: datapointname, stringValue: '', encoding: encoding, createdAt: new Date(), parent:this.getCaseId() };
        return rv;
    }
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestPatientCasesAction {
    type: 'REQUEST_PATIENT_CASES';
    lastUpdatedAt: number;
    syncWithServer: boolean;
}

interface ReceivePatientCasesAction {
    type: 'RECEIVE_PATIENT_CASES';
    patientCases: PatientCase[];
}

interface UpdatePatientCaseAction {
    type: 'UPDATE_PATIENT_CASE';
    patientCase: PatientCase;
}



// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestPatientCasesAction | ReceivePatientCasesAction | UpdatePatientCaseAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestPatientCases: (lastUpdatedAt:number, syncWithServer:boolean): AppThunkAction<KnownAction> => (dispatch, getState) => {
        if (lastUpdatedAt != getState().patientCases.lastUpdatedAt) {
            let fetchTask = fetch(`api/DatapointContainer?attemptSync=${syncWithServer}`)
                .catch((e) => { console.log('failed to retrieve case',e)} )
                .then(response => response.json() as Promise<PatientCase[]>)
                .then(data => {
                    let patientImpl = data.map<PatientCase>((value: PatientCase) => { return new PatientCaseImplementation(value) });
                    dispatch({ type: 'RECEIVE_PATIENT_CASES', patientCases: patientImpl });
                });

            addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
            dispatch({ type: 'REQUEST_PATIENT_CASES', lastUpdatedAt:lastUpdatedAt, syncWithServer:syncWithServer });
        }
    },
    createNewPatientCase:() => () => {
        let rv = PatientCaseImplementation.createNew();
        return rv;
    },
    updatePatientCase: (patientCase: PatientCase): AppThunkAction<KnownAction> => (dispatch, getState) => {
        if (patientCase) {
            let updateTask = fetch(`api/DatapointContainer`, { method: 'post', body: JSON.stringify(patientCase), headers: {'content-type':'application/json'} })
                .catch((e) => { console.log('failed to update case', e) })
                .then(response => response.json() as Promise<PatientCase>)
                .then(data => {
                    let patientImpl = new PatientCaseImplementation(data); dispatch({ type: 'UPDATE_PATIENT_CASE', patientCase: patientImpl });
                });
            addTask(updateTask);
            let lastUpdatedAt = getState().patientCases.lastUpdatedAt || 0;
            dispatch({
                type: 'REQUEST_PATIENT_CASES', lastUpdatedAt: lastUpdatedAt + 1, syncWithServer: false
            });

        }
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: PatientCaseState = { containerDataPoints: [], isLoading: false };

export const reducer: Reducer<PatientCaseState> = (state: PatientCaseState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    const cndpd = DatapointDefinitions.CONTAINERNAME;
    switch (action.type) {
        case 'REQUEST_PATIENT_CASES':
            return {
                containerDataPoints: state.containerDataPoints,
                lastUpdatedAt: action.lastUpdatedAt,
                isLoading: true
            };
        case 'RECEIVE_PATIENT_CASES':
                return {
                    containerDataPoints: action.patientCases,
                    lastUpdatedAt: state.lastUpdatedAt,
                    isLoading: false
            };
        case 'UPDATE_PATIENT_CASE':
            let newArrayOfCases = state.containerDataPoints.slice();
            let updatedOrCreatedCase = action.patientCase;
            var createOrUpdateIndex = newArrayOfCases.findIndex((value: PatientCase) => { return value.getPropertyStringValue(cndpd.dataPointName) == updatedOrCreatedCase.getPropertyStringValue(cndpd.dataPointName) });
            if (createOrUpdateIndex != -1) {
                newArrayOfCases[createOrUpdateIndex] = action.patientCase;
            } else {
                newArrayOfCases.push(action.patientCase);
            }
            return {
                containerDataPoints: newArrayOfCases,
                lastUpdateAt: state.lastUpdatedAt,
                isLoading: state.isLoading
            };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
