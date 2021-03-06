<template>
  <v-layout row wrap>
    <v-flex>
      <v-card>
        <v-card-title>
          <h1>Customers Report</h1>
        </v-card-title>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12 sm12 md6>
              <v-radio-group row v-model="status">
                <v-radio label="Active" :value="true"></v-radio>
                <v-radio label="Inactive" :value="false"></v-radio>
                <v-radio label="All" value="All"></v-radio>
              </v-radio-group>
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
            name="customersReport.csv"
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
        'Contact Person': 'contactPerson',
        Designation: 'designation',
        Address: 'address',
        Notes: 'notes',
        'Customer Type': 'customerType',
        Locality: 'locality',
        Status: 'status',
        CreatedAt: 'createdAt',
        UpdatedAt: 'updatedAt',
      },
      items: [],
      selectedUsers: [],
      dateFrom: '',
      dateTo: '',
      alertType: 'error',
      alert: 'Error while loading the data from API...',
      hasAlert: false,
      status: '',
      orderByTypes: [
        { text: 'Name Ascending', value: 'name' },
        { text: 'Name Descending', value: 'name DESC' },
        { text: 'Locality Ascending', value: 'locality' },
        { text: 'Locality Descending', value: 'locality DESC' },
        { text: 'Created Date Ascending', value: 'DATE(createdAt)' },
        { text: 'Created Date Descending', value: 'DATE(createdAt) DESC' },
      ],
      orderBy: 'name',
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
          orderBy: this.orderBy,
        };
        if (this.$v.$invalid) {
          this.alertType = 'error';
          this.alert = 'Please fill all the required fields.';
          this.hasAlert = true;
          return;
        }
        const data = await this.$http.post('customer/report', formData);
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
