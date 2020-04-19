<template>
  <v-layout row wrap>
    <v-flex>
      <v-card>
        <v-card-title>
          <h1>Salary Report</h1>
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

            <v-flex xs12 sm12 md12>
              <v-subheader>Month</v-subheader>
              <v-date-picker
              v-model="month"
              :max="maxDate"
              :landscape="true"
              type="month">
              </v-date-picker>
            </v-flex>

          </v-layout>
        </v-card-text>
        <v-card-actions>
          <JsonExcel
            class="btn"
            :fetch="POST"
            :fields="json_fields"
            name="salaryReport.csv"
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


export default {
  validations: {
    month: { required },
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
        Id: 'id',
        'Staff Name': 'fullName',
        'User Id': 'userId',
        Allowance: 'allowance',
        'Salary Month': 'salaryMonth',
        'Basic Salary': 'basicSal',
        Salary: 'sal',

        CreatedAt: 'createdAt',

      },
      items: [],
      selectedUsers: [],
      month: '',
      dateTo: '',
      alertType: 'error',
      alert: 'Error while loading the data from API...',
      hasAlert: false,
      status: '',
      orderByTypes: [
        { text: 'Staff Name Ascending', value: 'users.firstName' },
        { text: 'Staff Name Decending', value: 'users.firstName DESC' },
        { text: 'Salary Ascending', value: 'sal' },
        { text: 'Salary Descending', value: 'sal DESC' },
        { text: 'Created Date Ascending', value: 'DATE(salaries.createdAt)' },
        { text: 'Created Date Descending', value: 'DATE(salaries.createdAt) DESC' },
      ],
      orderBy: 'name',
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
          month: this.month,
          orderBy: this.orderBy,
        };
        if (this.$v.$invalid) {
          this.alertType = 'error';
          this.alert = 'Please fill all the required fields.';
          this.hasAlert = true;
          return;
        }
        const data = await this.$http.post('salary/report', formData);
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
