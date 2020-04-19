<template>
  <v-layout row wrap>
    <v-flex xs12 sm12 md12>
      <v-card>
        <v-card-title>
          <h1>Call Logs Report</h1>
        </v-card-title>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12 sm12 md6>
              <v-subheader>From</v-subheader>
              <v-date-picker  v-model="dateFrom" :max="maxDate" landscape></v-date-picker>
            </v-flex>
            <v-flex xs12 sm12 md6>
              <v-subheader>To</v-subheader>
              <v-date-picker  v-model="dateTo" :max="maxDate" landscape></v-date-picker>
            </v-flex>
            <v-flex xs12 sm12 md6>

              <v-autocomplete
                label="Users"
                :items="items"
                item-value="id"
                item-text="fullName"
                v-model="selectedUsers"
                multiple
                outline

              ></v-autocomplete>
            </v-flex>
            <v-flex xs12 sm12 md6>
              <v-autocomplete
                label="Order by"
                outline
                :items="orderByTypes"
                item-text="text"
                item-value="value"
                v-model="orderBy"
              ></v-autocomplete>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <JsonExcel
            class="btn"
            :fetch="POST"
            :fields="json_fields"
            name="callsReport.csv"
            type="csv"
            :style=" $v.$invalid ? 'pointer-events:none;cursor: no-drop;' : 'pointer-events:auto;' "
          >Download Excel</JsonExcel>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-flex xs12 sm12 md12>
      <v-alert v-model="hasAlert" dismissible :type="alertType">{{alert}}</v-alert>
    </v-flex>
  </v-layout>
</template>

<script>
import JsonExcel from 'vue-json-excel';
import { required } from 'vuelidate/lib/validators';

const dateGreaterThan = (value, vm) => {
  const from = new Date(vm.dateFrom);
  const to = new Date(value);
  return from <= to;
};

export default {
  validations: {
    dateFrom: { required },
    dateTo: { required, dateGreaterThan },
    selectedUsers: { required },
    orderBy: { required },
  },
  components: {
    JsonExcel,
  },
  mounted() {
    this.GET();
    this.maxDate = this.$moment().format('YYYY-MM-DD');
  },
  data() {
    return {
      maxDate: '',
      json_fields: {
        id: 'id',
        'Full Name': 'fullName',
        'User Id': 'userId',
        'Contact Person': 'contactPerson',
        Company: 'company',
        'Phone Number': 'phoneNumber',
        Email: 'email',
        Notes: 'notes',
        Status: 'status',
        CreatedAt: 'createdAt',
      },
      items: [],
      selectedUsers: [],
      dateFrom: '',
      dateTo: '',
      alertType: 'error',
      alert: 'Error while loading the data from API...',
      hasAlert: false,
      orderByTypes: [
        { text: 'Call Status', value: 'status' },
        { text: 'Company Name', value: 'company' },
        { text: 'Company Name Descending', value: 'company DESC' },
        { text: 'Created Date Ascending', value: 'DATE(calllogs.createdAt)' },
        { text: 'Created Date Descending', value: 'DATE(calllogs.createdAt) DESC' },
      ],
      orderBy: 'area',
    };
  },
  methods: {
    async GET() {
      try {
        const data = await this.$http.get('auth/all');
        this.items = data.data;
      } catch (error) {
        this.alertType = 'error';
        this.alert = 'Error while loading the data from API...';
        this.hasAlert = false;
      }
    },
    async POST() {
      try {
        const formData = {
          ids: this.selectedUsers,
          from: this.dateFrom,
          to: this.dateTo,
          orderBy: this.orderBy,
        };
        if (this.$v.$invalid) {
          this.alertType = 'error';
          this.alert = 'Please fill all the required fields.';
          this.hasAlert = true;
          return;
        }
        const data = await this.$http.post('callLogs/report', formData);
        if (data.data.length === 0) {
          this.alertType = 'error';
          this.alert = 'No data available!';
          this.hasAlert = true;
          return;
        }

        return data.data;
      } catch (error) {
        this.alertType = 'error';
        this.alert = 'Some thing went wrong!';
        this.hasAlert = true;
      }
    },
  },
};
</script>
