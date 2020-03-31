<template>
  <v-layout justify-center row wrap>
    <v-flex xs12 sm12 md6>
      <v-card>
        <v-card-title class="primary white--text">
          <h2>Welcome back!</h2>
        </v-card-title>
        <v-card-text>
          <v-text-field
            label="Email"
            v-model="email"

            outline
          ></v-text-field>
          <v-text-field
            type="password"
            label="Password"
            counter="15"
            outline
            v-model="password"
            class="required"
            @blur="$v.password.$touch()"
            :error-messages="passwordErrors"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn class="primary" :disabled="$v.$invalid" @click="onLogin">login</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-flex xs12 sm12 md12>
      <v-alert v-model="hasError" dismissible type="error">{{alert}}</v-alert>
    </v-flex>
  </v-layout>
</template>

<script>
import { required, maxLength, minLength } from 'vuelidate/lib/validators';

import { mapActions } from 'vuex';
import permission from '../../permissions';

export default {
  validations() {
    return {
      password: { required, minLength: minLength(6), maxLength: maxLength(15) },
    };
  },
  computed: {

    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      if (!this.$v.password.required && errors.push('Password is required.')) return errors;
      if (
        !this.$v.password.minLength
        && errors.push('Length for a valid password is 6 to 15.')
      ) return errors;
      if (
        !this.$v.password.maxLength
        && errors.push('Length for a valid password is 6 to 15.')
      ) return errors;
      return errors;
    },
  },
  data() {
    return {
      nic: '',
      password: '',
      hasError: false,
      alert: '',
      email: null,
    };
  },
  methods: {
    ...mapActions(['login', 'setPermissions']),
    async onLogin() {
      try {
        const data = await this.$http.post('auth/login', {
          email: this.email,
          password: this.password,
        });

        await this.login({
          name: data.data.name,
          role: data.data.role,
          token: data.data.token,
        });

        await this.setPermissions(permission[data.data.role]);
        this.$router.push('/dashboard');
      } catch (error) {
        if (error.response.status === 401) {
          this.alert = error.response.data;
        } else {
          this.alert = 'Ops! Something went wrong!';
        }
        this.hasError = true;
      }
    },
  },
};
</script>
