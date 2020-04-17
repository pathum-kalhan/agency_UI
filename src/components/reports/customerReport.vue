<template>
  <v-layout row wrap>
    <v-flex>
      <v-card>
        <v-card-title>
          <h1>Customer Report</h1>
        </v-card-title>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12 sm12 md12>
              <v-radio-group row v-model="status">
                <v-radio label="Active" :value="true"></v-radio>
                <v-radio label="Inactive" :value="false"></v-radio>
                <v-radio label="All" value="All"></v-radio>
              </v-radio-group>
            </v-flex>

            <v-flex xs12 sm12 md6>
              <v-subheader>Created From</v-subheader>
              <v-date-picker  v-model="dateFrom" :max="maxDate" :landscape="true"></v-date-picker>
            </v-flex>
            <v-flex xs12 sm12 md6>
              <v-subheader>Created To</v-subheader>
              <v-date-picker  v-model="dateTo" :max="maxDate" :landscape="true"></v-date-picker>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <JsonExcel
            class="btn"
            :fetch="POST"
            :fields="json_fields"
            name="customerReport.csv"
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

const date_greather_than = (value, vm) => {
  const from = new Date(vm.dateFrom);
  const to = new Date(value);
  return from <= to;
};
export default {
  validations: {
    dateFrom: { required },
    dateTo: { required, date_greather_than },
    status: { required },
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
        Id: 'id',
        Name: 'name',
        Email: 'email',
        ContactPerson: 'contactPerson',
        Designation: 'designation',
        Address: 'address',
        Notes: 'notes',
        CustomerType: 'customerType',
        Locality: 'locality',
        Status: 'status',
        CreatedAt: 'createdAt',
        UpdatedAt: 'updatedAt',
      },
      items: [],
      selectedUsers: [],
      dateFrom: '',
      alertType: 'error',
      alert: 'Error while loading the data from api...',
      hasAlert: false,
      status: '',
      dateTo: '',
    };
  },
  methods: {
    async GET() {
      try {
        const data = await this.$http.get('user');

        this.items = data.data;
      } catch (error) {
        this.alertType = 'error';
        this.alert = 'Error while loading the data from api...';
        this.hasAlert = false;
      }
    },
    async POST() {
      try {
        const formData = {
          from: this.dateFrom,
          to: this.dateTo,
          status: this.status,
        };
        if (this.$v.$invalid) {
          this.alertType = 'error';
          this.alert = 'Please fill all the required fields.';
          this.hasAlert = true;
          return;
        }
        const data = await this.$http.post('/customer/report', formData);
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
