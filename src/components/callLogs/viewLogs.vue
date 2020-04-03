<template>
  <v-layout row wrap>


    <v-flex xs12 sm12 md12>
      <v-alert v-model="hasAlert" dismissible :type="alertType">{{alert}}</v-alert>
    </v-flex>
    <v-flex xs12 sm12 md12>
      <v-card>
        <v-card-title>
          <h1>View and update call logs</h1>
        </v-card-title>
        <v-card-text>
          <v-text-field label="Search" v-model="search" outline></v-text-field>

          <v-data-table :items="items" :headers="headers" :search="search" disable-initial-sort dense>
            <template slot="items" slot-scope="props">
              <td>{{props.item.id}}</td>
              <td>{{props.item.user.fullName}}</td>
              <td>{{props.item.contactPerson}}</td>
              <td>{{props.item.company}}</td>
              <td>{{props.item.phoneNumber}}</td>
              <td>{{props.item.email}}</td>
              <td>{{props.item.notes}}</td>
              <td>{{props.item.status}}</td>

              <td>
                <v-btn
                  class="warning"
                  @click="$router.push({path:'/calls',query:{id:props.item.id}})"
                >Update</v-btn>
              </td>

            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {

  mounted() {
    this.GET();
  },
  data() {
    return {
      search: '',
      items: [],
      headers: [
        { text: 'Id', value: 'id' },

        { text: 'Caller', value: 'user.fullName' },
        { text: 'Contact Person', value: 'contactPerson' },
        { text: 'Company', value: 'company' },
        { text: 'Phone Number', value: 'phoneNumber' },
        { text: 'Email', value: 'email' },
        { text: 'Notes', value: 'notes' },
        { text: 'Status', value: 'status' },

        {
          text: 'Update',
          value: null,
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
        const data = await this.$http.get('callLogs');
        this.items = data.data;
      } catch (error) {
        this.alertType = 'error';
        this.alert = 'Error while loading the data from api...';
        this.hasAlert = false;
      }
    },


  },
};
</script>
