import { fetch, addTask  } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import DatapointDefinitions from './DataPointDefinitions';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface PropertyState {
    isLoading: boolean;
    lastUpdatedAt?: number;
    containerDataPoints: Property[];
}

export interface PropertyDataPoints {
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

export interface Property {
    containerDataPoints: PropertyDataPoints[];
    getPropertyStringValue(propName: string): string;
    getCurrentDataPoint(propName: string): PropertyDataPoints | undefined;
    createNewDataPoint(propName: string): PropertyDataPoints;
}

class PropertyImplementation implements Property {   
    constructor(copy?: Property) {
        if (copy != null)
            this.containerDataPoints = copy.containerDataPoints;
        else {
            this.containerDataPoints = [];
        }
    }
    containerDataPoints: PropertyDataPoints[];

    getCurrentDataPoint(propName: string): PropertyDataPoints | undefined {
        let foundProp: PropertyDataPoints | undefined;
        let latestPropCreatedAtTime: Date = new Date(0);
        if (propName) {
            foundProp = this.containerDataPoints.reduce((previousValue:PropertyDataPoints|undefined, currentValue: PropertyDataPoints) => {
                if (currentValue.dataPointName.toUpperCase() == propName.toUpperCase() && (previousValue == null || currentValue.createdAt > latestPropCreatedAtTime) ) {
                    latestPropCreatedAtTime = currentValue.createdAt;
                    previousValue = currentValue;
                }
                return previousValue;
            }, foundProp); 
            if (!foundProp) {
                //one of our special names
                if (propName == 'createdAt') {
                    // created at, find the date time that the CN datapoint was created.                   
                    foundProp = this.containerDataPoints.find((value: PropertyDataPoints) => { return value.dataPointName.toUpperCase() == 'CN' });
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
    static createNew() : Property {
        let rv = new PropertyImplementation();
        // and Id of empty string indicates this is a new case.
        let cndpd = DatapointDefinitions.CONTAINERNAME;
        rv.containerDataPoints = [{ id: '', dataPointName: cndpd.dataPointName, stringValue: 'New Property', encoding: cndpd.storeEncoding, createdAt:new Date() }];
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
    createNewDataPoint(datapointname: string): PropertyDataPoints {
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

interface RequestPropertiesAction {
    type: 'REQUEST_PROPERTIES';
    lastUpdatedAt: number;
    syncWithServer: boolean;
}

interface ReceivePropertiesAction {
    type: 'RECEIVE_PROPERTIES';
    properties: Property[];
}

interface UpdatePropertyAction {
    type: 'UPDATE_PROPERTY';
    property: Property;
}



// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestPropertiesAction | ReceivePropertiesAction | UpdatePropertyAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestProperties: (lastUpdatedAt:number, syncWithServer:boolean): AppThunkAction<KnownAction> => (dispatch, getState) => {
        if (lastUpdatedAt != getState().properties.lastUpdatedAt) {
            let fetchTask = fetch(`api/DatapointContainer?attemptSync=${syncWithServer}`)
                .catch((e) => { console.log('failed to retrieve case',e)} )
                .then(response => response.json() as Promise<Property[]>)
                .then(data => {
                    let propertiesImpl = data.map<Property>((value: Property) => { return new PropertyImplementation(value) });
                    dispatch({ type: 'RECEIVE_PROPERTIES', properties: propertiesImpl });
                });

            addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
            dispatch({ type: 'REQUEST_PROPERTIES', lastUpdatedAt:lastUpdatedAt, syncWithServer:syncWithServer });
        }
    },
    createNewProperty:() => () => {
        let rv = PropertyImplementation.createNew();
        return rv;
    },
    updateProperty: (property: Property): AppThunkAction<KnownAction> => (dispatch, getState) => {
        if (property) {
            let updateTask = fetch(`api/DatapointContainer`, { method: 'post', body: JSON.stringify(property), headers: {'content-type':'application/json'} })
                .catch((e) => { console.log('failed to update property', e) })
                .then(response => response.json() as Promise<Property>)
                .then(data => {
                    let propertyImpl = new PropertyImplementation(data); dispatch({ type: 'UPDATE_PROPERTY', property: propertyImpl });
                });
            addTask(updateTask);
            let lastUpdatedAt = getState().properties.lastUpdatedAt || 0;
            dispatch({
                type: 'REQUEST_PROPERTIES', lastUpdatedAt: lastUpdatedAt + 1, syncWithServer: false
            });

        }
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: PropertyState = { containerDataPoints: [], isLoading: false };

export const reducer: Reducer<PropertyState> = (state: PropertyState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    const cndpd = DatapointDefinitions.CONTAINERNAME;
    switch (action.type) {
        case 'REQUEST_PROPERTIES':
            return {
                containerDataPoints: state.containerDataPoints,
                lastUpdatedAt: action.lastUpdatedAt,
                isLoading: true
            };
        case 'RECEIVE_PROPERTIES':
                return {
                    containerDataPoints: action.properties,
                    lastUpdatedAt: state.lastUpdatedAt,
                    isLoading: false
            };
        case 'UPDATE_PROPERTY':
            let newArrayOfCases = state.containerDataPoints.slice();
            let updatedOrCreatedCase = action.property;
            var createOrUpdateIndex = newArrayOfCases.findIndex((value: Property) => { return value.getPropertyStringValue(cndpd.dataPointName) == updatedOrCreatedCase.getPropertyStringValue(cndpd.dataPointName) });
            if (createOrUpdateIndex != -1) {
                newArrayOfCases[createOrUpdateIndex] = action.property;
            } else {
                newArrayOfCases.push(action.property);
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
