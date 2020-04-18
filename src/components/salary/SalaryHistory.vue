<template>
  <v-layout row wrap>
    <v-flex xs12 sm12 md12>
      <v-alert v-model="hasAlert" dismissible :type="alertType">{{alert}}</v-alert>
    </v-flex>
    <v-flex xs12 sm12 md12>
      <v-card>
        <v-card-title>
          <h1>Salaries history</h1>
        </v-card-title>
        <v-card-text>

          <v-text-field label="Search" v-model="search" outline></v-text-field>

          <v-data-table :items="items" :headers="headers" :search="search" disable-initial-sort  :pagination.sync="pagination">
            <template slot="items" slot-scope="props">
              <td>{{props.item.id}}</td>
              <td>{{props.item.user.fullName}}</td>
              <td>{{props.item.basicSal}}</td>

              <td>{{props.item.allowance}}</td>
              <td>{{props.item.sal}}</td>
              <td>{{props.item.salaryMonth}}</td>
              <td>
                <v-btn
                  class="warning"
                  @click="$router.push({path:'/item',query:{id:props.item.id}})"
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
      pagination: {
        rowsPerPage: 10,
      },
      search: '',
      items: [],
      headers: [
        { text: 'Id', value: 'id' },
        { text: 'Name', value: 'user.fullName' },
        { text: 'Basic', value: 'basicSal' },
        { text: 'Allowances', value: 'allowance' },
        {
          text: 'Salary',
          value: 'sal',
        },
        {
          text: 'Month',
          value: 'salaryMonth',
        },
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
        const data = await this.$http.get('salary');
        this.items = data.data;
      } catch (error) {
        this.alertType = 'error';
        this.alert = 'Error while loading the data from API...';
        this.hasAlert = true;
      }
    },
    async PUT(status, id) {
      try {
        await this.$http.put('item/status', { status: !status, id });
        this.GET();
      } catch (error) {
        this.alertType = 'error';
        this.alert = 'Status change failed!';
        this.hasAlert = true;
      }
    },
    async onDelete(id) {
      try {
        await this.$http.delete(`salary/${id}`);
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
