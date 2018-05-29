import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './components/Home';
import FetchPatientCaseData from './components/PatientCases';
import PatientCaseDetails from './components/PatientCaseDetails';

export const routes = <Layout>
    <Route exact path='/' component={ Home } />
    <Route path='/patientCases' component={FetchPatientCaseData} />
    <Route path='/patientCaseDetail' component={PatientCaseDetails} />
</Layout>;
