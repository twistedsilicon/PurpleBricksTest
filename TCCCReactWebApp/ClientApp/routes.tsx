import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './components/Home';
import FetchData from './components/FetchData';
import Counter from './components/Counter';
import FetchPatientCaseData from './components/PatientCases';
import PatientCaseDetails from './components/PatientCaseDetails';

export const routes = <Layout>
    <Route exact path='/' component={ Home } />
    <Route path='/counter' component={ Counter } />
    <Route path='/fetchdata/:startDateIndex?' component={ FetchData } />
    <Route path='/patientCases' component={FetchPatientCaseData} />
    <Route path='/patientCaseDetail' component={PatientCaseDetails} />
</Layout>;
