<template>
  <v-layout row wrap>
    <v-flex xs12 sm12 md12>
      <v-alert v-model="hasAlert" dismissible :type="alertType">{{alert}}</v-alert>
    </v-flex>
    <v-flex xs12 sm12 md12>
      <v-card>
        <v-card-title>
          <h1>Attendance history</h1>
        </v-card-title>
        <v-card-text>
          <v-text-field label="Search" v-model="search" outline></v-text-field>
          <v-data-table :items="items" :headers="headers" :search="search" disable-initial-sort>
            <template slot="items" slot-scope="props">
              <td>{{props.item.id}}</td>
              <td>{{props.item.fullName}}</td>
              <td>{{props.item.site}}</td>
              <td>{{props.item.attendanceDate}}</td>
              <td>{{props.item.checkIn}}</td>
              <td>{{props.item.checkOut}}</td>
              <td>{{props.item.status}}</td>


              <td>
                <v-btn
                  class="warning"
                  @click="$router.push({path:'/attendance',query:{id:props.item.id}})"
                >Update</v-btn>
              </td>
              <td>
                <v-btn
                  @click="onDelete(props.item.id)"
                 class="error"
                >
                  delete
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
      search: '',
      items: [],
      headers: [
        { text: 'Id', value: 'id' },
        { text: 'User name', value: 'fullName' },
        { text: 'Site', value: 'site' },
        { text: 'Date', value: 'attendanceDate' },
        { text: 'checkIn', value: 'checkIn' },
        { text: 'checkOut', value: 'checkOut' },
        { text: 'Status', value: 'status' },

        {
          text: 'Update',
          value: null,
          sortable: false,
        },
        {
          text: 'Delete',
          value: null,
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
        const data = await this.$http.get('attendance');
        this.items = data.data;
      } catch (error) {
        this.alertType = 'error';
        this.alert = 'Error while loading the data from api...';
        this.hasAlert = true;
      }
    },
    async onDelete(id) {
      try {
        await this.$http.delete(`attendance/${id}`);
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
