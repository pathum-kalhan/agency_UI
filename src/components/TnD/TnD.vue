<template>
  <v-layout row wrap>

    <v-flex xs12 sm12 md12>
      <v-form ref="vehicleForm">
        <v-card>
          <v-card-title>
            <h1 v-if="componentStatus">Add traning and development plan</h1>
            <h1 v-else>Update a traning and development plan</h1>
          </v-card-title>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12 sm12 md12>

                <v-select
                  outline
                  label="User name"
                  v-model="userId"
                  :items="users"
                  item-text="fullName"
                  item-value="id"
                  class="required"
                ></v-select>
              </v-flex>

              <v-flex xs12 sm12 md12>
                <v-subheader class="required">Time period *</v-subheader>
                <!-- {{timePeriod}} -->
                <v-radio-group v-model="timePeriod" row>
                  <v-radio label="3 Months" value=3></v-radio>
                  <v-radio label="6 Months" value=6></v-radio>
                  <v-radio label="12 Months" value=12></v-radio>
                  <v-radio label="18 Months" value=18></v-radio>
                  <v-radio label="24 Months" value=24></v-radio>

                </v-radio-group>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-textarea
                  outline
                  label="Notes"
                  v-model="notes"
                  :counter="100"
                  :error-messages="notesErrors"
                  @input="$v.notes.$touch()"
                ></v-textarea>

                <v-text-field
                  outline
                  label="Investment"
                  v-model.number="investment"
                  :error-messages="investmentErrors"
                  @input="$v.investment.$touch()"
                   class="required"
                   type="number"
                ></v-text-field>

                <v-text-field
                  outline
                  label="Mile stones"
                  v-model="mileStone"
                  counter="30"
                   class="required"
                ></v-text-field>
                <v-btn @click="addMileStone()" :disabled="!mileStone || mileStone.length > 30">add</v-btn>
                <ul>

                  <li v-for="(i,index) in mileStones" :key="i">
                    {{i}}
                    <v-btn @click="removeMileStone(index)">delete</v-btn>
                  </li>
                </ul>

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
            <v-btn v-else class="error" @click="POST" :disabled="$v.$invalid">update</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-flex>
    <v-flex xs12 sm12 md12>
      <v-alert v-model="hasAlert" dismissible :type="alertType">{{alert}}</v-alert>
    </v-flex>
  </v-layout>
</template>

<script>
import {
  required,
  maxLength,

  minValue,

} from 'vuelidate/lib/validators';

export default {
  computed: {


    investmentErrors() {
      const errors = [];
      if (!this.$v.investment.$dirty) return errors;
      if (!this.$v.investment.required) errors.push('Investment is required.');
      if (!this.$v.investment.minValue) errors.push('Investment should be greather than 500.');


      return errors;
    },
    notesErrors() {
      const errors = [];
      if (!this.$v.notes.$dirty) return errors;
      if (!this.$v.notes.maxLength) errors.push('Maximum length for the notes is 100.');
      return errors;
    },
  },

  validations() {
    return {
      userId: { required },
      timePeriod: { required },
      notes: { maxLength: maxLength(100) },

      mileStones: { required },
      investment: { required, minValue: minValue(500) },
    };
  },
  mounted() {
    this.GET();
    if (this.$route.query.id) {
      this.componentStatus = false;
      this.GET_DATA(this.$route.query.id);
    }
  },
  data() {
    return {
      make: '',
      year: '',
      color: '',
      vin: '',
      mileStone: '',
      notes: '',
      userId: '',
      users: [],
      componentStatus: true,
      id: '',
      alertType: 'error',
      hasAlert: false,
      alert: '',
      timePeriod: '3',
      mileStones: [],
      investment: 500,
    };
  },
  methods: {
    async GET() {
      try {
        const data = await this.$http.get('auth');
        this.users = data.data.filter(el => el.status);
      } catch (error) {
        this.alertType = 'error';
        this.alert = 'Error while loading the users data from api...';
        this.hasAlert = false;
      }
    },
    async POST() {
      try {
        const formData = {

          mileStones: this.mileStones,
          notes: this.notes,
          userId: this.userId,
          timePeriod: this.timePeriod,
          investment: this.investment,
        };

        if (this.componentStatus) {
          await this.$http.post('tnd', formData);
          this.$refs.vehicleForm.reset();
          this.$v.$reset();

          this.alertType = 'success';
          this.alert = 'Traning and development plan created successfully.';
          this.hasAlert = true;
        } else {
          await this.$http.put(`/vehicle/${this.id}`, formData);
          this.$router.push('/viewVehicles');
        }
      } catch (error) {
        if (this.componentStatus) {
          if (error.response.status === 422) {
            this.alert = error.response.data;
          } else {
            this.alert = 'Vehicle creatation failed.';
          }
          this.alertType = 'error';
          this.hasAlert = true;
        } else {
          this.alertType = 'success';
          this.alert = 'Vehicle updation failed.';
          this.hasAlert = true;
        }
      }
    },
    async GET_DATA(id) {
      try {
        const data = await this.$http.get(`/vehicle/${id}`);
        this.id = data.data.id;
        this.make = data.data.make;
        this.year = data.data.year;
        this.color = data.data.color;
        this.vin = data.data.vin;
        this.mileStone = data.data.mileStone;
        this.notes = data.data.notes;
        this.userId = data.data.userId;
        this.timePeriod = data.data.timePeriod;
      } catch (error) {
        this.alertType = 'error';
        this.alert = 'Error while loading the vehicle data from api...';
        this.hasAlert = true;
      }
    },
    addMileStone() {
      this.mileStones.push(this.mileStone);
      this.mileStone = '';
    },
    removeMileStone(index) {
      this.mileStones.splice(index, 1);
    },
  },
};
</script>
