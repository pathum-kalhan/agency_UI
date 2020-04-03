module.exports = {
  admin: [


    { icon: 'fa-chart-line', text: 'Dashboard', path: '/dashboard' },
    {
      icon: 'fa-angle-up',
      'icon-alt': 'fa-angle-down',
      text: 'User management',
      children: [
        { text: 'Create an user', path: '/user' },
        { text: 'Users list', path: '/viewUsers' },
      ],
    },
    {
      icon: 'fa-angle-up',
      'icon-alt': 'fa-angle-down',
      text: 'Expenses management',
      children: [
        { text: 'Record expenses', path: '/expenses' },
        { text: 'View expenses', path: '/viewExpenses' },
      ],
    },
    {
      icon: 'fa-angle-up',
      'icon-alt': 'fa-angle-down',
      text: 'Attendance management',
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
      text: 'Job management',
      children: [
        { text: 'Create a job', path: '/job' },
        { text: 'Jobs list', path: '/jobsList' },
      ],
    },
    {
      icon: 'fa-angle-up',
      'icon-alt': 'fa-angle-down',
      text: 'Calls management',
      children: [
        { text: 'Add call logs', path: '/calls' },
        { text: 'Calls list', path: '/callLogs' },
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
        // { text: 'Categories report', path: '/categoryR' },
        // { text: 'Vehicles report', path: '/vehicleR' },
        // { text: 'Places report', path: '/placeR' },
        // { text: 'Trips report', path: '/tripsR' },

        // { text: 'Fuel report', path: '/fuelR' },
        // { text: 'Maintenance report', path: '/maintaR' },
        // { text: 'Finance report', path: '/financeR' },

        // { text: 'Summary report', path: '/summaryR' },


      ],
    },


  ],


};
