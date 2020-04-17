<template>
    <v-layout row wrap>
        <v-flex>
            <v-form ref="leaves">

          <v-card>
            <v-card-text>
                 <h1 v-if="componentStatus">Create a leave record</h1>
                <h1 v-else>Update a leave record</h1>

                <v-layout row wrap>
                  <v-flex xs12 sm12 md12>
                    <v-autocomplete :items="users"
                      v-model="userId"
                      label="Staff member"
                      item-text="fullName"
                      item-value="id"
                      outline
                      class="required"
                      ></v-autocomplete>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-date-picker  v-model="leaveDate" landscape></v-date-picker>
                  </v-flex>
                  <v-flex xs12 md12 sm12>
                    <v-textarea label="Notes" outline v-model="notes" :error-messages="notesErrors"
                    @input="$v.notes.$touch()"
                    counter="1000"></v-textarea>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-radio-group row v-model="leaveType">
                        <v-radio value="Annual" label="Annual" color="blue"></v-radio>
                        <v-radio value="Casual" label="Casual" color="pink"></v-radio>
                        <v-radio value="Medical" label="Medical" color="blue"></v-radio>
                        <v-radio value="Nopay" label="No pay" color="green"></v-radio>
                    </v-radio-group>
                    <v-radio-group row v-model="daysCount">
                        <v-radio :value="0.5" label="Half Day" color="blue"></v-radio>
                        <v-radio :value="1" label="Full Day" color="pink"></v-radio>
                    </v-radio-group>
                  </v-flex>

                </v-layout>


            </v-card-text>
          <v-card-actions>
        <v-btn class="success" @click="POST" :disabled="$v.$invalid" v-if="componentStatus">create</v-btn>
        <v-btn class="warning" @click="PUT" :disabled="$v.$invalid" v-else>update</v-btn>


          </v-card-actions>

          </v-card>


            <v-flex xs12 sm12 md12>
      <v-alert v-model="hasAlert" dismissible :type="alertType">{{alert}}</v-alert>
    </v-flex>
      </v-form>
        </v-flex>


        </v-layout>
</template>

<script>
import {
  required,
  maxLength,


} from 'vuelidate/lib/validators';


// const alwaysOK = { OK: () => true };

export default {

  mounted() {
    if (this.$route.query.id) {
      this.componentStatus = false;
      this.GET(this.$route.query.id);
    }
    // this.joinedDateMax = this.$moment().format('YYYY-MM-DD');
    this.getUsers();
  },
  validations() {
    return {
      userId: { required },
      leaveDate: { required },
      notes: { maxLength: maxLength(1000) },
      leaveType: { required },
      daysCount: { required },

    };
  },
  computed: {
    notesErrors() {
      const errors = [];
      if (!this.$v.notes.$dirty) return errors;
      if (!this.$v.notes.maxLength) errors.push('Maximum length for the notes is 1000.');
      return errors;
    },


  },
  data() {
    return {
      userId: '',

      notes: '',
      alert: 'Failed',
      alertType: 'error',
      hasAlert: false,
      id: null,
      users: [],
      leaveDate: null,
      leaveType: 'Annual',
      componentStatus: true,
      isHalfDay: false,
      daysCount: 1,
    };
  },
  methods: {
    async POST() {
      try {
        const formData = {
          userId: this.userId,
          leaveDate: this.leaveDate,
          notes: this.notes,
          leaveType: this.leaveType,

          daysCount: this.daysCount,
        };
        const data = await this.$http.post('leave', formData);
        this.$refs.leaves.reset();
        this.$v.$reset();

        if (data.data !== '') {
          this.alert = data.data;
          this.alertType = 'error';
          this.hasAlert = true;
        } else {
          this.alert = 'Record created succesfully.';
          this.alertType = 'success';
          this.hasAlert = true;
        }
      } catch (error) {
        this.alert = 'Oops! Something went wrong.';
        this.alertType = 'error';
        this.hasAlert = true;
      }
    },
    async PUT() {
      try {
        const formData = {
          userId: this.userId,
          contactPerson: this.contactPerson,
          company: this.company,
          phoneNumber: this.phoneNumber,
          email: this.email,
          notes: this.notes,
          leaveType: this.leaveType,

        };
        await this.$http.put(`callLogs/${this.id}`, formData);
        this.$router.push('/callLogs');
      //   this.alert = 'Record created succesfully.';
      // this.alertType = 'success';
      // this.hasAlert = true;
      } catch (error) {
        this.alert = 'Oops! Something went wrong.';
        this.alertType = 'error';
        this.hasAlert = true;
      }
    },
    async GET(id) {
      try {
        const data = await this.$http.get(`callLogs/${id}`);
        this.id = data.data.id;
        this.userId = data.data.userId;
        this.contactPerson = data.data.contactPerson;
        this.company = data.data.company;
        this.phoneNumber = data.data.phoneNumber;
        this.email = data.data.email;
        this.notes = data.data.notes;
        this.leaveType = data.data.leaveType;
      } catch (error) {
        this.alert = 'Oops! Something went wrong.';
        this.alertType = 'error';
        this.hasAlert = true;
      }
    },
    async getUsers() {
      try {
        const data = await this.$http.get('auth');
        this.users = data.data;
      } catch (error) {
        this.alertType = 'error';
        this.alert = 'Error while loading the users data from API...';
        this.hasAlert = false;
      }
    },
  },
};
</script>
