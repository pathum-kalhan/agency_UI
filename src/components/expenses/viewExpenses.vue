<template>
  <v-layout row wrap>
    <v-flex xs12 sm12 md12>
      <v-alert v-model="hasAlert" dismissible :type="alertType">{{alert}}</v-alert>
    </v-flex>
    <v-flex xs12 sm12 md12>
      <v-card>
        <v-card-title>
          <h1>View and update expenses</h1>
        </v-card-title>
        <v-card-text>
          <v-text-field label="Search" v-model="search" outline></v-text-field>


          <v-data-table :items="items" :headers="headers" :search="search" disable-initial-sort>
            <template slot="items" slot-scope="props">
              <td>{{props.item.id}}</td>
              <td>{{props.item.amount}}</td>
              <td>{{props.item.expensesType}}</td>
              <td>{{props.item.notes}}</td>

              <td>{{props.item.createdAt}}</td>
            <td>
                <v-btn class="warning" @click="$router.push({path:'/expenses',query:{id:props.item.id}})">update</v-btn>
              </td>

            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['role']),
  },
  mounted() {
    this.GET();
  },
  data() {
    return {
      search: '',
      items: [],
      headers: [
        { text: 'Id', value: 'id' },
        { text: 'Amount', value: 'amount' },
        { text: 'Expense Type', value: 'expensesType' },
        { text: 'Notes', value: 'note' },

        {
          text: 'createdAt',
          value: 'createdAt',
        },
        {
          text: 'Update',
          value: 'update',
          sortable: false,
        },

      ],
      alertType: 'error',
      hasAlert: false,
      alert: '',
    };
  },
  methods: {
    async GET() {
      try {
        const data = await this.$http.get('expense');
        this.items = data.data;
      } catch (error) {
        this.alertType = 'error';
        this.alert = 'Error while loading the data from api...';
        this.hasAlert = true;
      }
    },
    async PUT(model_name, status, id) {
      try {
        const r = confirm(`This will mark status as ${status}?`);
        if (r == false) {
          return;
        }
        await this.$http.put('common', { model_name, status, id });
        this.GET();
      } catch (error) {
        this.alertType = 'error';
        this.alert = 'Status change failed!';
        this.hasAlert = true;
      }
    },
  },
};
</script>
