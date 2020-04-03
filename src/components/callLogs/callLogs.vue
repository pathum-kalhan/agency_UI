<template>
    <v-layout row wrap>
      <v-flex xs12 sm12 md12>
<v-form ref="calls">
<v-flex xs12 sm12 md12>
          <v-card>
            <v-card-text>
            <h1></h1>
            <h1 v-if="componentStatus">Create a call log</h1>
            <h1 v-else>Update a call log</h1>
            <v-layout row wrap>
              <v-flex xs12 sm12 md6>

           <v-autocomplete :items="users"
            v-model="userId"
            label="Caller"
            item-text="fullName"
            item-value="id"
            outline
            class="required"
            ></v-autocomplete>
              </v-flex>
              <v-flex xs12 sm12 md6>

            <v-text-field
            label="Contact person"
            v-model="contactPerson"
            outline counter="15"
            :error-messages="contactPersonErrors"
             @input="$v.contactPerson.$touch()"
            ></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md6>

           <v-text-field label ="Company" v-model="company" outline counter="15" class="required"
           :error-messages="companyNameErrors"
             @input="$v.company.$touch()"> </v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md6>
           <v-text-field
           label ="Phone number"
           v-model="phoneNumber"
           outline
           placeholder="071XXXXXXX"
           counter="10"
           class="required"
           :error-messages="phoneNumberErrors"
           @input="$v.phoneNumber.$touch()"
           > </v-text-field>

              </v-flex>
              <v-flex xs12 sm12 md12>
           <v-text-field label ="Email"
            v-model="email"
             outline
             class="required"
              type="email"
               :error-messages="emailErrors"
               @blur="$v.email.$touch()"
               > </v-text-field>

              </v-flex>

            </v-layout>


        <v-textarea label="Notes" outline v-model="notes" :error-messages="notesErrors"
        @input="$v.notes.$touch()"
        counter="1000"></v-textarea>

        <v-radio-group row v-model="status">
            <v-radio value="Positive" label="Positive" color="blue"></v-radio>
            <v-radio value="Rejected" label="Rejected" color="pink"></v-radio>
            <v-radio value="email" label="Email follow up" color="blue"></v-radio>
            <v-radio value="meet" label="Mettings" color="pink"></v-radio>
            <v-radio value="tech" label="Technical team follow up" color="pink"></v-radio>

        </v-radio-group>


            </v-card-text>
          <v-card-actions>
        <v-btn class="success" @click="POST" :disabled="$v.$invalid" v-if="componentStatus">create</v-btn>
        <v-btn class="warning" @click="PUT" :disabled="$v.$invalid" v-else>update</v-btn>


          </v-card-actions>

          </v-card>


            </v-flex>
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

  email,

} from 'vuelidate/lib/validators';

const phoneNumberValidator = (value) => {
  const regexPattern = /^0(70|71|72|75|76|77|78|11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)\d{7}$/;
  return regexPattern.test(value);
};
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
      contactPerson: { maxLength: maxLength(15) },
      company: { maxLength: maxLength(15), required },
      phoneNumber: { phoneNumberValidator, required },
      email: { required, email },
      notes: { maxLength: maxLength(1000) },
      status: { required },

    };
  },
  computed: {
    notesErrors() {
      const errors = [];
      if (!this.$v.notes.$dirty) return errors;
      if (!this.$v.notes.maxLength) errors.push('Maximum length for the notes is 1000.');
      return errors;
    },
    contactPersonErrors() {
      const errors = [];
      if (!this.$v.contactPerson.$dirty) return errors;
      if (
        !this.$v.contactPerson.maxLength
      ) { errors.push('Maximum length for the contact number is 15.'); }
      return errors;
    },

    companyNameErrors() {
      const errors = [];
      if (!this.$v.company.$dirty) return errors;
      if (
        !this.$v.company.required
      ) { errors.push('Company name is required.'); }
      if (
        !this.$v.company.maxLength
      ) { errors.push('Maximum length for the company name is 15.'); }
      return errors;
    },
    phoneNumberErrors() {
      const errors = [];
      if (!this.$v.phoneNumber.$dirty) return errors;

      if (
        !this.$v.phoneNumber.phoneNumberValidator
      ) { errors.push('Phone number format is invalid.'); }
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      if (!this.$v.email.required && errors.push('Email is required.')) { return errors; }
      if (!this.$v.email.email && errors.push('Please enter a valid email.')) { return errors; }
      return errors;
    },
  },
  data() {
    return {
      userId: '',
      company: '',
      phoneNumber: '',
      email: '',
      notes: '',
      alert: 'Failed',
      alertType: 'error',
      hasAlert: false,
      id: null,
      users: [],
      contactPerson: '',
      status: 'Positive',
      componentStatus: true,
    };
  },
  methods: {
    async POST() {
      try {
        const formData = {
          userId: this.userId,
          contactPerson: this.contactPerson,
          company: this.company,
          phoneNumber: this.phoneNumber,
          email: this.email,
          notes: this.notes,
          status: this.status,
        };
        await this.$http.post('callLogs', formData);
        this.$refs.calls.reset();
        this.$v.$reset();
        this.alert = 'Record created succesfully.';
        this.alertType = 'success';
        this.hasAlert = true;
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
          status: this.status,

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
        this.status = data.data.status;
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
        this.alert = 'Error while loading the users data from api...';
        this.hasAlert = false;
      }
    },
  },
};
</script>
