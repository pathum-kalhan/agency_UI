<template>
  <v-layout row wrap>
    <v-flex xs12 sm12 md12>
      <v-form ref="form">
        <v-card>
          <v-card-title>
            <h1 v-if="componentStatus">Mark attendance</h1>
            <h1 v-else>Update an attendance</h1>
          </v-card-title>
          <v-card-text>


            <v-layout row wrap>
              <v-flex xs12 sm12 md6>

                <v-select
              label="User"
              v-model="userId"
              outline
              class="required"
              :items="items"
              item-text="fullName"
              item-value="id"
            ></v-select>
              </v-flex>
              <v-flex xs12 sm12 md6>
                <v-select
                  label="Site"
                  v-model="site"
                  outline
                  class="required"
                  :items="sites"

                ></v-select>
              </v-flex>
              <v-flex xs12 sm12 md12>

                <v-date-picker :landscape="true" full-width v-model="attendanceDate" :max="attendanceDateMax"></v-date-picker>
              </v-flex>
              <v-flex xs12 sm12 md6 id="times">
                 <label for="checkOut">CHECK IN</label>

                <input type="time" v-model="checkIn">
              </v-flex>
              <v-flex xs12 sm12 md6 id="times">
                <label for="checkOut" >CHECK OUT</label>

                <input type="time" v-model="checkOut">
              </v-flex>
              <v-flex xs12 sm12 md6>
                <v-radio-group v-model="status" :row="true">
                 <v-radio label="Half day" value="Half day" color="red"></v-radio>
      <v-radio label="Short leave" value="Short leave" color="orange"></v-radio>
      <v-radio label="Normal" value="Normal" color="green"></v-radio>
                </v-radio-group>
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
            <v-btn v-else class="warning" @click="PUT" :disabled="$v.$invalid">update</v-btn>
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

} from 'vuelidate/lib/validators';

export default {
  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.required && errors.push('Name is required.');
      !this.$v.name.maxLength
        && errors.push('Maximum length for the name is 35.');
      return errors;
    },
    latitudeErrors() {
      const errors = [];
      if (!this.$v.lat.$dirty) return errors;
      !this.$v.lat.required && errors.push('Latitude is required.');
      !this.$v.lat.decimal && errors.push('Please enter a valid latitude.');
      return errors;
    },
    lngErrors() {
      const errors = [];
      if (!this.$v.lng.$dirty) return errors;
      !this.$v.lng.required && errors.push('Longitude is required.');
      !this.$v.lng.decimal && errors.push('Please enter a valid longitude.');
      return errors;
    },
    notesErrors() {
      const errors = [];
      if (!this.$v.notes.$dirty) return errors;

      !this.$v.notes.maxLength
        && errors.push('Maximum length for the notes is 300.');
      return errors;
    },
    addressErrors() {
      const errors = [];
      if (!this.$v.address.$dirty) return errors;
      // !this.$v.address.required && errors.push("Name is required.");
      !this.$v.address.maxLength
        && errors.push('Maximum length for the address is 100.');
      return errors;
    },
  },
  validations() {
    return {
      userId: { required },
      site: { required },
      checkIn: { required },
      checkOut: { required },
      attendanceDate: { required },
      status: { required },
    };
  },
  mounted() {
    if (this.$route.query.id) {
      this.componentStatus = false;
      this.readById(this.$route.query.id);
    }
    this.GET();
    // this.attendanceDate = new Date();
    this.attendanceDateMax = this.$moment().format('YYYY-MM-DD');
    this.attendanceDate = this.$moment().format('YYYY-MM-DD');
  },
  data() {
    return {
      componentStatus: true,
      id: '',

      items: [],


      alertType: 'error',
      hasAlert: false,
      alert: '',
      sites: ['Site A', 'Site B', 'Site C', 'HO'],
      userId: null,
      site: null,
      checkIn: '09:00',
      checkOut: '17:00',
      attendanceDate: null,
      status: 'Normal',
      attendanceDateMax: '',
    };
  },
  methods: {
    async POST() {
      try {
        await this.$http.post('/attendance', {
          userId: this.userId,
          site: this.site,
          checkIn: this.checkIn,
          checkOut: this.checkOut,
          attendanceDate: this.attendanceDate,
          status: this.status,
        });
        this.$refs.form.reset();
        this.$v.$reset();
        this.alertType = 'success';
        this.alert = 'Attendace marked successfully!';
        this.hasAlert = true;
      } catch (error) {
        if (error.response.status === 422) {
          this.alert = error.response.data;
        } else {
          this.alert = 'Failed!';
        }
        this.alertType = 'error';
        this.hasAlert = true;
      }
    },
    async readById(id) {
      try {
        const data = await this.$http.get(`/attendance/${id}`);

        this.id = data.data.id;
        this.userId = data.data.userId;
        this.site = data.data.site;
        this.checkIn = data.data.checkIn;
        this.checkOut = data.data.checkOut;
        this.attendanceDate = data.data.attendanceDate;
        this.status = data.data.status;
      } catch (error) {
        this.alert = 'Error while loading the data from api...';
        this.alertType = 'error';
        this.hasAlert = true;
      }
    },
    async GET() {
      try {
        const data = await this.$http.get('auth');
        this.items = data.data;
      } catch (error) {
        this.alert = 'Error while loading the data from api...';
        this.alertType = 'error';
        this.hasAlert = true;
      }
    },
    async PUT() {
      try {
        await this.$http.put(`/attendance/${this.id}`, {
          userId: this.userId,
          site: this.site,
          checkIn: this.checkIn,
          checkOut: this.checkOut,
          attendanceDate: this.attendanceDate,
          status: this.status,

        });

        this.$router.push('/viewAttendance');
      } catch (error) {
        if (error.response.status === 422) {
          this.alert = 'A record already exsists!';
        } else {
          this.alert = 'Oops! Something went wrong.';
        }
        this.alertType = 'error';
        this.hasAlert = true;
      }
    },
  },
};
</script>

<style >
  #times{
    padding: 30px;
    /* margin: 40px; */
    background-color: antiquewhite;
    margin-top: 32px;
  }
</style>
