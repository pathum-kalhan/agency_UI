<template>
  <v-layout row wrap>
    <v-flex xs12 sm12 md12>
      <v-form ref="form">
        <v-card>
          <v-card-title>
            <h1 v-if="componetStatus">Generate salary</h1>
            <h1 v-else>Update salary record</h1>
          </v-card-title>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12 sm12 md4>
                  <v-autocomplete :items="users"
                    v-model="userId"
                    label="Staff member"
                    item-text="fullName"
                    item-value="id"
                    outline
                    class="required"
                  ></v-autocomplete>
              </v-flex>
              <v-flex xs12 sm12 md4>
                <v-text-field type="number" label="Allowances" v-model="allowance" outline></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md4>
                <v-select :items="days" label="Working days" v-model="workingDays" class="required" outline></v-select>
              </v-flex>
            </v-layout>


            <v-date-picker type="month" v-model="salaryMonth" full-width readonly></v-date-picker>


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
      <v-alert v-model="hasAlert" dismissible :type="alertType">{{alert}}</v-alert>
    </v-flex>
  </v-layout>
</template>

<script>
import { required } from 'vuelidate/lib/validators';

export default {
  computed: {
    // nameErrors() {
    //   const errors = [];
    //   if (!this.$v.name.$dirty) return errors;
    //   !this.$v.name.required && errors.push('Name is required.');
    //   !this.$v.name.maxLength
    //     && errors.push('Maximum length for the name is 35.');
    //   return errors;
    // },
    // descriptionErrors() {
    //   const errors = [];
    //   if (!this.$v.description.$dirty) return errors;
    //   !this.$v.description.maxLength
    //     && errors.push('Maximum length for the description is 100.');
    //   return errors;
    // },
  },
  validations() {
    return {
      userId: { required },

      salaryMonth: { required },
      workingDays: { required },
    };
  },
  mounted() {
    if (this.$route.query.id) {
      this.componetStatus = false;
      this.GET_DATA(this.$route.query.id);
    }
    this.getUsers();
    for (let index = 1; index <= 31; index++) {
      this.days.push(index);
    }
    const y = new Date();
    const len = String(y.getMonth() + 1);
    this.salaryMonth = `${y.getFullYear()}-${len.length === 1 ? '0' : ''}${y.getMonth() + 1}`;
  },
  data() {
    return {
      componetStatus: true,
      id: '',

      alert: 'Failed',
      alertType: 'error',
      hasAlert: false,
      users: [],
      salaryMonth: '',
      userId: '',
      allowance: '',
      workingDays: '',
      days: [],
    };
  },
  methods: {
    async POST() {
      try {
        let allowance = null;
        if (this.allowance) {
          allowance = this.allowance;
        } else {
          allowance = 0;
        }
        const formData = {
          userId: this.userId,
          allowance,
          salaryMonth: this.salaryMonth,
          workingDays: this.workingDays,
        };

        if (this.componetStatus) {
          await this.$http.post('salary', formData);
          this.$refs.form.reset();
          this.$v.$reset();

          this.alert = 'Salary created successfully!';
          this.alertType = 'success';
          this.hasAlert = true;
        } else {
          await this.$http.put(`item/${this.id}`, formData);

          this.$router.push('itemList');
        }
        // alert("Success!");
      } catch (error) {
        if (error.response.status === 422) {
          this.alert = 'You already created salary for this user.';
        } else {
          this.alert = 'Failed';
        }
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
