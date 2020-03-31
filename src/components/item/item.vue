<template>
  <v-layout row wrap>
    <v-flex xs12 sm12 md12>
      <v-form ref="form">
        <v-card>
          <v-card-title>
            <h1 v-if="componetStatus">Create an item</h1>
            <h1 v-else>Update an item</h1>
          </v-card-title>
          <v-card-text>
            <v-text-field
              label="Name"
              class="required"
              v-model="name"
              :counter="35"
              outline
              @input="$v.name.$touch()"
              :error-messages="nameErrors"
            ></v-text-field>
            <v-textarea
              label="Description"
              outline
              v-model="description"
              :error-messages="descriptionErrors"
              @input="$v.description.$touch()"
              :counter="100"
            ></v-textarea>
            <v-radio-group row v-model="unit">
             <v-radio value="Feets" label="Feets" color="red"></v-radio>
                  <v-radio value="Cube" label="Cube" color="green"></v-radio>
                  <v-radio value="Barrels" label="Barrels" color="blue"></v-radio>
                  <v-radio value="Units" label="Units" color="orange"></v-radio>
            </v-radio-group>
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
import { required, maxLength } from 'vuelidate/lib/validators';

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
    descriptionErrors() {
      const errors = [];
      if (!this.$v.description.$dirty) return errors;
      !this.$v.description.maxLength
        && errors.push('Maximum length for the description is 100.');
      return errors;
    },
  },
  validations() {
    return {
      name: { required, maxLength: maxLength(35) },
      description: { maxLength: maxLength(100) },
      unit: { required },
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
      componetStatus: true,
      id: '',
      name: '',
      unit: 'Cube',
      description: '',
      alert: 'Failed',
      alertType: 'error',
      hasAlert: false,
    };
  },
  methods: {
    async POST() {
      try {
        const formData = {
          name: this.name,
          description: this.description,
          unit: this.unit,
        };

        if (this.componetStatus) {
          await this.$http.post('item', formData);
          this.$refs.form.reset();
          this.$v.$reset();

          this.alert = 'Item created successfully!';
          this.alertType = 'success';
          this.hasAlert = true;
        } else {
          await this.$http.put(`item/${this.id}`, formData);

          this.$router.push('itemList');
        }
        // alert("Success!");
      } catch (error) {
        if (error.response.status === 422) {
          this.alert = error.response.data;
        } else {
          this.alert = 'Failed';
        }
        this.alertType = 'error';
        this.hasAlert = true;
      }
    },
    async GET_DATA(id) {
      try {
        const data = await this.$http.get(`item/${id}`);
        this.id = data.data.id;
        this.name = data.data.name;
        this.description = data.data.description;
        this.unit = data.data.unit;
      } catch (error) {
        alert('Error while loading the data from api...');
      }
    },
  },
};
</script>
