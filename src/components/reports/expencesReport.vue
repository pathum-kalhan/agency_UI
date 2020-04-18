<template>
  <v-layout row wrap>
    <v-flex xs12 sm12 md12>
      <v-card>
        <v-card-title>
          <h1>Expences Report</h1>
        </v-card-title>
        <v-card-text>
          <v-layout row wrap>

            <v-flex xs12 sm12 md12>
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
            name="expencesReport.csv"
            type="csv"
            :style=" $v.$invalid ? 'pointer-events:none;' : 'pointer-events:auto;' "
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
  validations() {
    return {
      dateFrom: { required },
      dateTo: { required, dateGreaterThan },
      orderBy: { required },

    };
  },
  components: {
    JsonExcel,
  },
  mounted() {
    this.maxDate = this.$moment().format('YYYY-MM-DD');
  },
  data() {
    return {
      json_fields: {
        Id: 'id',
        Amount: 'amount',
        'Expenses Type': 'expensesType',
        Notes: 'notes',
        CreatedAt: 'createdAt',
        UpdatedAt: 'updatedAt',

      },
      items: [],
      maxDate: '',
      dateFrom: '',
      dateTo: '',
      orderByTypes: [
        { text: 'Amount', value: 'amount' },
        { text: 'Amount Decending', value: 'amount DESC' },
        { text: 'Expenses Type', value: 'expensesType' },
        { text: 'Expenses Type Decending', value: 'expensesType DESC' },
        { text: 'Created Date Ascending', value: 'DATE(createdAt)' },
        { text: 'Created Date Descending', value: 'DATE(createdAt) DESC' },
      ],
      orderBy: 'fuelLevel',
      alertType: 'error',
      alert: 'Error while loading the data from api...',
      hasAlert: false,
      status: 'All',
    };
  },
  methods: {

    async POST() {
      try {
        const formData = {
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

        const data = await this.$http.post('expense/report', formData);
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
