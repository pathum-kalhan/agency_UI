<template>
  <v-layout row wrap>
    <v-flex xs12 sm12 md12>
      <v-alert v-model="hasAlert" dismissible :type="alertType">{{alert}}</v-alert>
    </v-flex>
    <v-flex xs12 sm12 md12>
      <v-card>
        <v-card-title>
          <h1>View and update users</h1>
        </v-card-title>
        <v-card-text>

          <v-text-field label="Search" v-model="search" outline></v-text-field>
          <v-data-table
            :items="items"
            :headers="headers"
            :search="search"
            disable-initial-sort
            :pagination.sync="pagination"
          >
            <template slot="items" slot-scope="props">
              <td>{{props.item.fullName}}</td>
              <td>{{props.item.email}}</td>
              <td>{{props.item.nic}}</td>
              <!-- <td>{{props.item.contactNumber1}}</td>
              <td>{{props.item.contactNumber2}}</td> -->
              <td>{{props.item.address}}</td>
              <td>{{props.item.notes}}</td>
              <td>{{props.item.role}}</td>
              <td>{{props.item.dateJoined}}</td>
              <td>{{props.item.birthday}}</td>


              <td>
                <v-btn
                  class="warning"
                  @click="$router.push({path:'/user',query:{id:props.item.id}})"
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
// import { CHANGE_STATUS } from "../../assets/image-upload.js";
export default {
  //   mixins: [CHANGE_STATUS],
  mounted() {
    this.GET();
  },
  data() {
    return {
      pagination: {
        rowsPerPage: 10,
      },
      search: '',
      items: [],
      headers: [

        { text: 'Name', value: 'fullName' },
        // { text: 'Display picture', value: 'profileImg' },
        { text: 'Email', value: 'email' },
        { text: 'NIC', value: 'nic' },
        // { text: 'Contact Number 1', value: 'contactNumber1' },
        // { text: 'Contact Number 2', value: 'contactNumber2' },
        { text: 'Address', value: 'address' },
        { text: 'Notes', value: 'notes' },
        { text: 'Role', value: 'role' },
        { text: 'Date joined', value: 'dateJoined' },
        { text: 'Birthday', value: 'birthday' },


        // { text: "Created at", value: "createdAt" },
        {
          text: 'Update',
          value: null,
          sortable: false,
        },
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
        const data = await this.$http.get('auth');
        this.items = data.data;
      } catch (error) {
        this.alertType = 'error';
        this.alert = 'Error while loading the data from api...';
        this.hasAlert = false;
      }
    },
    async PUT(status, id) {
      try {
        await this.$http.put('auth/status', { status: !status, id });
        this.GET();
      } catch (error) {
        // alert('Status changing failed!');
      }
    },
  },
};
</script>
