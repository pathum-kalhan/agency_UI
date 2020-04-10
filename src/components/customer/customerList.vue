<template>
  <v-layout row wrap>

    <v-flex xs12 sm12 md12>
      <v-alert v-model="hasAlert" dismissible :type="alertType">{{alert}}</v-alert>
    </v-flex>
    <v-flex xs12 sm12 md12>
      <v-card>
        <v-card-title>
          <h1>View and update customers</h1>
        </v-card-title>
        <v-card-text>
          <v-text-field label="Search" v-model="search" outline></v-text-field>


          <v-data-table :items="items" :headers="headers" :search="search" disable-initial-sort>
            <template slot="items" slot-scope="props">

              <td>{{props.item.id}}</td>
              <td>{{props.item.name}}</td>
              <td>{{props.item.email}}</td>
              <td>{{props.item.contactPerson}}</td>
              <td>{{props.item.designation}}</td>


              <td>{{props.item.address}}</td>
              <td>{{props.item.notes}}</td>
              <td>{{props.item.customerType}}</td>
              <td>{{props.item.locality}}</td>
              <td>
                <v-btn
                  class="warning"
                  @click="$router.push({path:'/customer',query:{id:props.item.id}})"
                >Update</v-btn>
              </td>
              <td>
                <v-btn
                  @click="PUT(props.item.status,props.item.id)"
                  :class="{'error':props.item.status,'success':!props.item.status}"
                >
                  <span v-if="props.item.status">Incativate</span>
                  <span v-else>Activate</span>
                </v-btn>
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
      id: '',
      amount: '',
      dialog: false,
      search: '',
      items: [],
      headers: [
        { text: 'Id', value: 'id' },

        { text: 'Name', value: 'name' },
        { text: 'Email', value: 'email' },
        { text: 'Contact Person', value: 'contactPerson' },
        { text: 'Designation', value: 'designation' },
        { text: 'Address', value: 'address' },
        { text: 'Notes', value: 'notes' },
        { text: 'Customer Type', value: 'customerType' },
        { text: 'Locality', value: 'locality' },

        { text: 'Update', value: 'update' },
        {
          text: 'Change status',
          value: 'status',
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
        const data = await this.$http.get('customer');
        this.items = data.data;
      } catch (error) {
        this.alertType = 'error';
        this.alert = 'Error while loading the data from api...';
        this.hasAlert = false;
      }
    },
    async openDialog(id) {
      try {
        this.id = id;
        this.dialog = true;
      } catch (error) {
        this.alertType = 'error';
        this.alert = 'Status change failed!';
        this.hasAlert = true;
      }
    },
    async add(amount) {
      try {
        await this.$http.put(`vehicle/fuel/${this.id}`, { fuelLevel: amount });
        this.GET();
        this.dialog = false;
      } catch (error) {
        this.alertType = 'error';
        this.alert = 'Status change failed!';
        this.hasAlert = true;
      }
    },
    async PUT(status, id) {
      try {
        await this.$http.put('customer/status', { status: !status, id });
        this.GET();
      } catch (error) {
        // alert('Status changing failed!');
      }
    },
  },
};
</script>
