<template>
  <v-layout row wrap>
    <v-dialog v-model="isShow">
      <v-card>
        <v-card-text>
          <table>
            <tr>
              <th>Id</th>
              <th>Mile stone</th>
              <th>Status</th>
            </tr>
            <tr v-for="i in mileStones" :key="i.id">
              <td>{{i.id}}</td>
              <td>{{i.name}}</td>
              <td>{{i.completedDate}}
                <v-btn @click="onUpdateMileStone(i.id,i.tndId)">completed</v-btn>
              </td>
            </tr>
          </table>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-flex xs12 sm12 md12>
      <v-alert v-model="hasAlert" dismissible :type="alertType">{{alert}}</v-alert>
    </v-flex>
    <v-flex xs12 sm12 md12>
      <v-card>
        <v-card-title>
          <h1>View and update plans</h1>
        </v-card-title>
        <v-card-text>

          <v-text-field label="Search" v-model="search" outline></v-text-field>

          <v-data-table :items="items" :headers="headers" :search="search" disable-initial-sort  :pagination.sync="pagination">
            <template slot="items" slot-scope="props">
              <td>{{props.item.id}}</td>

              <td>{{props.item.user.fullName}}</td>
              <td>{{props.item.timePeriod}} Months</td>
              <td>{{props.item.investment}} LKR</td>
              <td>{{props.item.notes}}</td>
              <td>{{props.item.deadlineDate}}</td>
              <td>{{props.item.completedPercentage}} %</td>

              <td>
                <v-btn
                  class="warning"
                  @click="onUpdate(props.item.id)"
                >Update</v-btn>
              </td>
              <!-- <td>
                <v-btn
                  @click="PUT('vehicle',props.item.status,props.item.id)"
                  :class="{'error':props.item.status}"
                >
                  <span v-if="props.item.status">Disable</span>
                  <span v-else>Enable</span>
                </v-btn>
              </td>
              <td>{{props.item.createdAt}}</td>
              <td>{{props.item.updatedAt}}</td> -->
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
      pagination: {
        rowsPerPage: 10,
      },
      search: '',
      items: [],
      headers: [
        { text: 'Id', value: 'id' },
        { text: 'User', value: 'user.fullName' },
        { text: 'Time Period', value: 'timePeriod' },
        { text: 'Investment', value: 'investment' },
        { text: 'Notes', value: 'notes' },
        { text: 'Deadline', value: 'deadlineDate' },
        { text: 'Progress', value: 'completedPercentage' },
        { text: 'Update', value: 'update' },
        // { text: 'Notes', value: 'notes' },

      ],
      alertType: 'error',
      hasAlert: false,
      alert: '',
      mileStones: [],
      isShow: false,
    };
  },
  methods: {
    async GET() {
      try {
        const data = await this.$http.get('tnd');
        this.items = data.data;
      } catch (error) {
        this.alertType = 'error';
        this.alert = 'Error while loading the data from api...';
        this.hasAlert = false;
      }
    },
    async onUpdate(id) {
      try {
        const data = await this.$http.get(`tnd/milestones/${id}`);
        this.mileStones = data.data;
        this.isShow = true;
      } catch (error) {
        this.alertType = 'error';
        this.alert = 'Status change failed!';
        this.hasAlert = true;
      }
    },
    async onUpdateMileStone(id, tndId) {
      try {
        await this.$http.put(`tnd/${id}/${tndId}`);
        // this.mileStones = data.data;
        this.isShow = false;
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

<style scoped>


</style>
