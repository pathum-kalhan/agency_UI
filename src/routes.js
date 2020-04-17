import welcome from './components/common/welcome.vue';
import dashboard from './components/dashboard.vue';
import user from './components/user/user.vue';
import viewUsers from './components/user/viewUsers.vue';
import item from './components/item/item.vue';
import itemList from './components/item/itemsList.vue';
import job from './components/job/job.vue';
import jobsList from './components/job/jobsList.vue';
import attendance from './components/attendance/attendance.vue';
import viewAttendance from './components/attendance/viewAttendance.vue';
import expenses from './components/expenses/expenses.vue';
import viewExpenses from './components/expenses/viewExpenses.vue';
import calls from './components/callLogs/callLogs.vue';
import callsList from './components/callLogs/viewLogs.vue';
import customer from './components/customer/customer.vue';
import customerList from './components/customer/customerList.vue';
import resetPassword from './components/common/resetPassword.vue';

import TnD from './components/TnD/TnD.vue';
import viewTnD from './components/TnD/viewPlans.vue';


import Leave from './components/leaves/Leave.vue';
import LeavesList from './components/leaves/LeavesList.vue';


// reports
import categoryReport from './components/reports/categoryR.vue';
import userR from './components/reports/userR.vue';
import auditR from './components/reports/auditR.vue';
import attendanceR from './components/reports/attendanceReport.vue';
import customerReport from './components/reports/customerReport.vue';
import expencesReport from './components/reports/expencesReport.vue';
import maintaR from './components/reports/maintaR.vue';
import financeR from './components/reports/financeR.vue';
import summaryR from './components/reports/summaryR.vue';
import callLogsReport from './components/reports/callLogsReport.vue';

import backupDb from './components/backupDb.vue';

const routes = [
  {
    path: '/',
    name: 'welcome',
    component: welcome,

  }, {
    path: '/dashboard',
    name: 'dashboard',
    component: dashboard,

    meta: { permissions: ['admin', 'manager'] },

  }, {
    path: '/user',
    component: user,

    meta: { permissions: ['admin'] },
  },
  {
    path: '/viewUsers',
    component: viewUsers,
    meta: { permissions: ['admin'] },

  },
  {
    path: '/leave',
    component: Leave,
    meta: { permissions: ['admin', 'staff', 'manager'] },

  },
  {
    path: '/leavesList',
    component: LeavesList,
    meta: { permissions: ['admin', 'staff', 'manager'] },

  }, {
    path: '/job',
    component: job,
    meta: { permissions: ['admin', 'staff', 'manager'] },

  }, {
    path: '/jobsList',
    component: jobsList,
    meta: { permissions: ['admin', 'staff', 'manager'] },

  }, {
    path: '/attendance',
    component: attendance,
    meta: { permissions: ['admin', 'staff', 'manager'] },

  }, {
    path: '/viewAttendance',
    component: viewAttendance,
    meta: { permissions: ['admin', 'staff', 'manager'] },

  }, {
    path: '/expenses',
    component: expenses,
    meta: { permissions: ['admin', 'staff', 'manager'] },

  }, {
    path: '/viewExpenses',
    component: viewExpenses,
    meta: { permissions: ['admin', 'staff', 'manager', 'driver'] },

  }, {
    path: '/calls',
    component: calls,
    meta: {
      permissions: ['admin', 'staff', 'manager', 'driver'],
    },
  }, {
    path: '/callLogs',
    component: callsList,
    meta: {
      permissions: ['admin', 'staff', 'manager', 'driver'],
    },
  }, {
    path: '/customer',
    component: customer,
    meta: { permissions: ['admin', 'staff', 'manager', 'driver'] },

  }, {
    path: '/customerList',
    component: customerList,
    meta: { permissions: ['admin', 'staff', 'manager', 'driver'] },

  },
  {
    path: '/categoryR',
    component: categoryReport,
    meta: {
      permissions: ['admin', 'manager'],

    },
  },
  {
    path: '/userR',
    component: userR,
    meta: {
      permissions: ['admin', 'manager'],

    },
  }, {
    path: '/auditR',
    component: auditR,
    meta: {
      permissions: ['admin', 'manager'],

    },
  }, {
    path: '/attendanceReport',
    component: attendanceR,
    meta: {
      permissions: ['admin', 'manager'],

    },
  }, {
    path: '/customerReport',
    component: customerReport,
    meta: {
      permissions: ['admin', 'manager'],

    },
  },
  {
    path: '/resetPassword',
    component: resetPassword,
    meta: { permissions: ['admin', 'staff', 'manager', 'driver'] },

  },
  {
    path: '/expencesReport',
    component: expencesReport,
    meta: {
      permissions: ['admin', 'manager'],

    },
  }, {
    path: '/maintaR',
    component: maintaR,
    meta: {
      permissions: ['admin', 'manager'],

    },

  },
  {
    path: '/financeR',
    component: financeR,
    meta: {
      permissions: ['admin', 'manager'],

    },

  },
  {
    path: '/summaryR',
    component: summaryR,
    meta: {
      permissions: ['admin', 'manager'],

    },

  },

  {
    path: '/backupdb',
    name: 'backup',
    component: backupDb,


  },
  {
    path: '/callLogsReport',
    name: 'tripsR',
    component: callLogsReport,


  },
  {
    path: '/tnd',
    name: 'tnd',
    component: TnD,


  },
  {
    path: '/viewTnD',
    name: 'tnd',
    component: viewTnD,


  },


];

export default routes;
