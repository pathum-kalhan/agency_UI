<template>
  <v-layout row wrap>
    <v-flex xs12 sm12 md12>
      <v-form ref="tripForm">
        <v-card>
          <v-card-title>
            <h1 v-if="componentStatus">Record expenses</h1>
            <h1 v-else>Update monthly expenses</h1>
          </v-card-title>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12 sm12 md6>
                <v-text-field label="Amount" outline class="required" v-model="amount" type="number"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md6>
                <v-text-field label="Type" outline class="required" v-model="expensesType"></v-text-field>

              </v-flex>


              <v-flex xs12 sm12 md12>
                <v-textarea
                  label="Notes"
                  outline
                  v-model="notes"
                  :counter="300"
                  :error-messages="notesErrors"
                  @input="$v.notes.$touch()"
                ></v-textarea>
              </v-flex>


            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-btn
              v-if="componentStatus"
              class="success"
              @click="POST"
              :disabled="$v.$invalid"
            >create</v-btn>
            <!-- <v-btn v-if="componentStatus">check availability</v-btn> -->
            <v-btn v-else class="error" @click="POST" :disabled="$v.$invalid">update</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-flex>
    <v-flex xs12 sm12 md12>
      <v-alert v-model="hasAlert" dismissible :type="alertType">{{alertingMessage}}</v-alert>
    </v-flex>
  </v-layout>
</template>

<script>
import { required, maxLength } from 'vuelidate/lib/validators';

export default {

  computed: {
    notesErrors() {
      const errors = [];
      if (!this.$v.notes.$dirty) return errors;

      if (!this.$v.notes.maxLength) errors.push('Maximum length for the notes is 300.');
      return errors;
    },
  },
  validations() {
    return {
      amount: { required },
      expensesType: { required },

      notes: { maxLength: maxLength(300) },
    };
  },
  mounted() {
    if (this.$route.query.id) {
      this.componentStatus = false;
      this.GET_DATA(this.$route.query.id);
    }
    // this.GET();
  },
  data() {
    return {
      selectedPlaces: [],
      places: '',
      allowances: '',
      startFrom: '',
      menu: '',
      driverId: '',
      vehicleId: '',
      vehicles: [],
      componentStatus: true,
      id: '',

      items: [],
      address: '',

      notes: '',
      drivers: [],
      menu1: '',
      menu2: '',
      stopAt: '',
      hasAlert: false,
      alertType: 'success',
      alertingMessage: '',
      amount: 0,
      expensesType: '',
    };
  },
  methods: {
    async POST() {
      try {
        let { amount } = this;
        if (!this.amount) {
          amount = 0;
        }
        const formData = {
          expensesType: this.expensesType,
          notes: this.notes,
          amount,

        };

        if (this.componentStatus) {
          await this.$http.post('expense', formData);
          this.$v.$reset();
          this.$refs.tripForm.reset();
          this.alertType = 'success';
          this.alertingMessage = 'Expense recorded successfully.';
          this.hasAlert = true;
        } else {
          await this.$http.put(`expense/${this.id}`, formData);
          this.$router.push('/viewExpenses');
        }
      } catch (error) {
        this.alertType = 'error';
        this.alertingMessage = 'Oops! Something went wrong.';
        this.hasAlert = true;
      }
    },
    async GET_DATA(id) {
      try {
        const data = await this.$http.get(`expense/${id}`);
        this.id = data.data.id;
        this.amount = data.data.amount;
        this.expensesType = data.data.expensesType;

        this.notes = data.data.notes;
      } catch (error) {
        this.alertType = 'error';
        this.alertingMessage = 'Error while loading the data from API...';
        this.hasAlert = true;
      }
    },
    // async GET() {
    //   try {
    //     const data = await this.$http.get('vehicle');
    //     data.data.forEach(e => (e.vehicleName = `${e.make} ${e.vin}`));
    //     this.vehicles = data.data.filter(e => e.status);
    //     const drivers = await this.$http.get('user');
    //     drivers.data.forEach(e => (e.name = `${e.firstName} ${e.lastName}`));
    //     this.drivers = drivers.data.filter(
    //       e => e.role === 'driver' && e.status,
    //     );

    //     const places = await this.$http.get('place');
    //     this.places = places.data;
    //   } catch (error) {
    //     alert('Error while loading the data from api...');
    //   }
    // },
  },
};
</script>
