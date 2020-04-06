<template>
  <v-layout row wrap>
    <v-flex xs12 sm12 md12>
      <v-form ref="tripForm">
        <v-card>
          <v-card-title>
            <h1 v-if="componetStatus">Create a customer</h1>
            <h1 v-else>Update a customer</h1>
          </v-card-title>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12 sm12 md6>
                <v-text-field
                 label="Customer Name"
                 v-model="name"
                 outline
                 counter="15"
                 class="required"
                 :error-messages="nameErrors"
                 @input="$v.name.$touch()"
                 ></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md6>
           <v-text-field label ="Email"
            v-model="email"
             outline
             class="required"
              type="email"
               :error-messages="emailErrors"
               @blur="$v.email.$touch()"
               > </v-text-field>

              </v-flex>
             <v-flex xs12 sm12 md6>
                <v-text-field
                label="Name of the contact person"
                v-model="contactPerson"
                outline
                counter="15"
                class="required"
                 :error-messages="contactPersonErrors"
                 @input="$v.contactPerson.$touch()"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md6>
                <v-text-field
                label="Designation of the contact person"
                v-model="designation"
                outline
                counter="15"
                class="required"
                 :error-messages="designationErrors"
                 @input="$v.designation.$touch()"
                ></v-text-field>
              </v-flex>

              <v-flex xs12 sm12 md6>
                <v-textarea
                  label="Address"
                  outline
                  v-model="address"
                  :counter="300"
                  :error-messages="addressErrors"
                  @input="$v.address.$touch()"
                ></v-textarea>
              </v-flex>
              <v-flex xs12 sm12 md6>
                <v-textarea
                  label="Notes"
                  outline
                  v-model="notes"
                  :counter="100"
                  :error-messages="notesErrors"
                  @input="$v.notes.$touch()"
                ></v-textarea>
              </v-flex>
              <v-flex xs12 sm12 md6>
                <v-subheader>
                  Customer type
                </v-subheader>
                <v-radio-group row v-model="customerType" >
            <v-radio value="Company" label="Company" color="blue"></v-radio>
            <v-radio value="Individual" label="Individual" color="red"></v-radio>
            <v-radio value="Agency" label="Marketing Agency" color="green"></v-radio>


        </v-radio-group>
              </v-flex>
              <v-flex xs12 sm12 md6>
                <v-subheader>
                  Locality
                </v-subheader>
                <v-radio-group row v-model="locality">

            <v-radio value="Local" label="Local" color="blue"></v-radio>
            <v-radio value="Foreign" label="Foreign" color="red"></v-radio>

        </v-radio-group>
              </v-flex>


            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-btn
              v-if="componetStatus"
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
      <v-alert v-model="hasAlert" dismissible :type="alertType">{{alertingMessage}}</v-alert>
    </v-flex>
  </v-layout>
</template>

<script>
import { required, maxLength, email } from 'vuelidate/lib/validators';

export default {
  computed: {
    notesErrors() {
      const errors = [];
      if (!this.$v.notes.$dirty) return errors;
      if (!this.$v.notes.maxLength) errors.push('Maximum length for the notes is 100.');
      return errors;
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      if (!this.$v.name.required) errors.push('Customer name is required.');
      if (!this.$v.name.maxLength) errors.push('Maximum length for the customer name is 15.');
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      if (!this.$v.email.required && errors.push('Email is required.')) { return errors; }
      if (!this.$v.email.email && errors.push('Please enter a valid email')) { return errors; }
      return errors;
    },
    contactPersonErrors() {
      const errors = [];
      if (!this.$v.contactPerson.$dirty) return errors;
      if (!this.$v.contactPerson.required && errors.push('Contact person name is required.')) ;
      if (!this.$v.contactPerson.maxLength) errors.push('Maximum length for the contact person name is 15.');
      return errors;
    },
    designationErrors() {
      const errors = [];
      if (!this.$v.designation.$dirty) return errors;
      if (!this.$v.designation.required && errors.push('Designation is required.')) ;
      if (!this.$v.designation.maxLength) errors.push('Maximum length for the designation is 15.');
      return errors;
    },
    addressErrors() {
      const errors = [];
      if (!this.$v.address.$dirty) return errors;
      if (!this.$v.address.maxLength) errors.push('Maximum length for the address is 300.');
      return errors;
    },

  },
  validations() {
    return {
      name: { required, maxLength: maxLength(15) },
      email: { required, email },
      contactPerson: { required, maxLength: maxLength(15) },
      designation: { required, maxLength: maxLength(15) },
      notes: { required, maxLength: maxLength(100) },
      address: { required, maxLength: maxLength(300) },
      customerType: { required },
      locality: { required },

    };
  },
  mounted() {
    if (this.$route.query.id) {
      this.componetStatus = false;
      this.GET_DATA(this.$route.query.id);
    }
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
      componetStatus: true,
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
      isPaid: true,

      name: '',
      email: '',
      contactPerson: '',
      designation: '',
      customerType: 'Individual',
      locality: 'Local',
    };
  },
  methods: {
    async POST() {
      try {
        const formData = {
          name: this.name,
          email: this.email,
          contactPerson: this.contactPerson,
          designation: this.designation,
          notes: this.notes,
          address: this.address,
          customerType: this.customerType,
          locality: this.locality,

        };

        if (this.componetStatus) {
          await this.$http.post('/customer', formData);
          this.$v.$reset();
          this.$refs.tripForm.reset();
          this.alertType = 'success';
          this.alertingMessage = 'Customer is created successfully.';
          this.hasAlert = true;
        } else {
          await this.$http.put(`/customer/${this.id}`, formData);
          this.$router.push('/customerList');
        }
      } catch (error) {
        if (error.response.status === 422) {
          this.alertType = 'error';
          this.alertingMessage = error.response.data.toString();
          this.hasAlert = true;
        }
      }
    },
    async GET_DATA(id) {
      try {
        const data = await this.$http.get(`/place/${id}`);
        this.id = data.data.id;
        this.name = data.data.name;
        this.address = data.data.address;
        this.lat = data.data.lat;
        this.lng = data.data.lng;
        this.notes = data.data.notes;
      } catch (error) {
        // alert('Error while loading the data from api...');
      }
    },

  },
};
</script>
