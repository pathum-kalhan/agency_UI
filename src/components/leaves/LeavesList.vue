<template>
  <v-layout row wrap>

    <v-flex xs12 sm12 md12>
      <v-alert v-model="hasAlert" dismissible :type="alertType">{{alert}}</v-alert>
    </v-flex>
    <v-flex xs12 sm12 md12>
      <v-card>
        <v-card-title>
          <h1>Leaves</h1>
        </v-card-title>
        <v-card-text>
          <v-text-field label="Search" v-model="search" outline></v-text-field>


          <v-data-table :items="items" :headers="headers" :search="search" disable-initial-sort>
            <template slot="items" slot-scope="props">

              <td>{{props.item.id}}</td>
              <td>{{props.item.user.fullName}}</td>
              <td>{{props.item.typeOfLeave}}</td>
              <td>{{props.item.leaveType}}</td>
              <td>{{props.item.leaveDate}}</td>


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
      id: '',
      amount: '',
      dialog: false,
      search: '',
      items: [],
      headers: [
        { text: 'Id', value: 'id' },

        { text: 'Name', value: 'name' },
        { text: 'Type', value: 'leaveType' },
        { text: 'Half day / Full day', value: 'typeOfLeave' },
        { text: 'Leave Date', value: 'leaveDate' },

        // { text: 'Notes', value: 'notes', width: '200px' },


        // { text: 'Update', value: 'update' },
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
        const data = await this.$http.get('leave');
        this.items = data.data;
      } catch (error) {
        this.alertType = 'error';
        this.alert = 'Error while loading the data from api...';
        this.hasAlert = false;
      }
    },
    async onDelete(id) {
      try {
        await this.$http.delete(`leave/${id}`);
        this.GET();
      } catch (error) {
        this.alertType = 'error';
        this.alert = 'Something went wrong.';
        this.hasAlert = false;
      }
    },
  },
};
</script>
