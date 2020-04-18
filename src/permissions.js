module.exports = {
  admin: [


    { icon: 'fa-chart-line', text: 'Dashboard', path: '/dashboard' },
    {
      icon: 'fa-angle-up',
      'icon-alt': 'fa-angle-down',
      text: 'Users',
      children: [
        { text: 'Create an user', path: '/user' },
        { text: 'Users list', path: '/viewUsers' },
      ],
    },
    {
      icon: 'fa-angle-up',
      'icon-alt': 'fa-angle-down',
      text: 'Customers',
      children: [
        { text: 'Create a customer', path: '/customer' },
        { text: 'Customers list', path: '/customerList' },
      ],
    },
    {
      icon: 'fa-angle-up',
      'icon-alt': 'fa-angle-down',
      text: 'Expenses',
      children: [
        { text: 'Record expenses', path: '/expenses' },
        { text: 'View expenses', path: '/viewExpenses' },
      ],
    },
    {
      icon: 'fa-angle-up',
      'icon-alt': 'fa-angle-down',
      text: 'Attendance',
      children: [
        { text: 'Mark attendance', path: '/attendance' },
        { text: 'Attendance history', path: '/viewAttendance' },
      ],
    },
    {
      icon: 'fa-angle-up',
      'icon-alt': 'fa-angle-down',
      text: 'TnD',
      children: [
        { text: 'Add plan', path: '/TnD' },
        { text: 'View plans', path: '/viewTnD' },
      ],
    },
    {
      icon: 'fa-angle-up',
      'icon-alt': 'fa-angle-down',
      text: 'Jobs',
      children: [
        { text: 'Create a job', path: '/job' },
        { text: 'Jobs list', path: '/jobsList' },
      ],
    },
    {
      icon: 'fa-angle-up',
      'icon-alt': 'fa-angle-down',
      text: 'Calls',
      children: [
        { text: 'Add call logs', path: '/calls' },
        { text: 'Calls list', path: '/callLogs' },
      ],
    },
    {
      icon: 'fa-angle-up',
      'icon-alt': 'fa-angle-down',
      text: 'Leaves',
      children: [
        { text: 'Add leave records', path: '/leave' },
        { text: 'Leaves list', path: '/leavesList' },
      ],
    },
    {
      icon: 'fa-angle-up',
      'icon-alt': 'fa-angle-down',
      text: 'Salary',
      children: [
        { text: 'Generate salary', path: '/salary' },
        { text: 'Salary history', path: '/salaryHistory' },
      ],
    },

    { icon: 'fas fa-key', text: 'Reset password', path: '/resetPassword' },


    {
      icon: 'fa-angle-up',
      'icon-alt': 'fa-angle-down',
      text: 'Reports',
      children: [
        { text: 'Audit report', path: '/auditR' },

        { text: 'User report', path: '/userR' },
        { text: 'Attendance report', path: '/attendanceReport' },
        { text: 'Call logs report', path: '/callLogsReport' },
        { text: 'Customer report', path: '/customerReport' },
        { text: 'Expenses report', path: '/expencesReport' },

        // { text: 'Fuel report', path: '/fuelR' },
        // { text: 'Maintenance report', path: '/maintaR' },
        // { text: 'Finance report', path: '/financeR' },

        // { text: 'Summary report', path: '/summaryR' },


      ],
    },


  ],


};
