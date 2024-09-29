import React from 'react';
import { Route, Routes } from 'react-router-dom';
import BasicCalendarSetup from './components/calendar/BasicCalendar';
import FieldWizard from './components/admin/FieldWizard';
import LocationBuilder from './components/inventory/LocationBuilder';
import Accounting from './screens/accounting/Accounting';
import CustomBoard from './screens/auth/CustomBoard';
import Dashboard from './screens/auth/Dashboard';
import Login from './screens/auth/Login';
import IMS from './screens/inventory/IMS';
import PMS from './screens/production/PMS';
import Reports from './screens/reports/Reports';
import Retail from './screens/retail/Retail';
import Sales from './screens/sales/Sales';
import Vendor from './screens/vendor/Vendor';
import InvBulk from './screens/InvBulk';
import TaskCalendar from './components/calendar/TaskCalendar';
import FormBuilder from './components/admin/formbulder/FormBuilder';
import FormFiller from './components/utils/FormFiller';
import WorkflowBuilder from './components/admin/workflowbuilder/WorkflowBuilder';

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Login />} />



    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/ims" element={<IMS />} />
    <Route path="/ims/locwiz" element={<LocationBuilder />} />
    <Route path="/pms" element={<PMS />} />
    <Route path="/retail" element={<Retail />} />
    <Route path="/vendor" element={<Vendor />} />
    <Route path="/accounting" element={<Accounting />} />
    <Route path="/reports" element={<Reports />} />
    <Route path="/sales" element={<Sales />} />
    <Route path="/fw" element={<FieldWizard />} />
    <Route path="/custom" element={<CustomBoard />} />
    <Route path="/calendar" element={<BasicCalendarSetup />} />
    <Route path="/InvBulk" element={<InvBulk />} />
    <Route path="/tc" element={<TaskCalendar />} />
    <Route path="/fb" element={<FormBuilder />} />
    <Route path="/ff" element={<FormFiller />} />
    <Route path="/wfb" element={<WorkflowBuilder />} />
  </Routes>
);

export default AppRouter;
