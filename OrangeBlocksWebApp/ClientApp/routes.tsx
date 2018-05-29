import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './components/Home';
import FetchPropertyData from './components/Properties';
import PropertyDetails from './components/PropertyDetails';

export const routes = <Layout>
    <Route exact path='/' component={ Home } />
    <Route path='/properties' component={FetchPropertyData} />
    <Route path='/propertyDetails' component={PropertyDetails} />
</Layout>;
