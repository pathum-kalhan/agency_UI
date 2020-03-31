<template>
  <v-layout row wrap>
    <v-flex xs12 sm12 md12>
      <v-alert v-model="hasAlert" dismissible :type="alertType">{{alert}}</v-alert>
    </v-flex>
    <v-flex xs12 sm12 md12>
      <v-card>
        <v-card-title>
          <h1>View and update items</h1>
        </v-card-title>
        <v-card-text>

          <v-text-field label="Search" v-model="search" outline></v-text-field>
          <v-data-table :items="items" :headers="headers" :search="search" disable-initial-sort  :pagination.sync="pagination">
            <template slot="items" slot-scope="props">
              <td>{{props.item.id}}</td>
              <td>{{props.item.name}}</td>
              <td>{{props.item.unit}}</td>

              <td>{{props.item.description}}</td>
              <td>{{props.item.createdDate}}</td>
              <td>{{props.item.updatedDate}}</td>
              <td>
                <v-btn
                  class="warning"
                  @click="$router.push({path:'/item',query:{id:props.item.id}})"
                >Update</v-btn>
              </td>
              <td>
                <v-btn
                  @click="PUT(props.item.status,props.item.id)"
                  :class="{'error':props.item.status,'success':!props.item.status}"
                >
                  <span v-if="props.item.status">Inactivate</span>
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
      pagination: {
        rowsPerPage: 10,
      },
      search: '',
      items: [],
      headers: [
        { text: 'Id', value: 'id' },
        { text: 'Name', value: 'name' },
        { text: 'Unit', value: 'unit' },
        { text: 'Description', value: 'description' },
        {
          text: 'createdAt',
          value: 'createdAt',
        },
        {
          text: 'updatedAt',
          value: 'updatedAt',
        },
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
        const data = await this.$http.get('item');
        this.items = data.data;
      } catch (error) {
        this.alertType = 'error';
        this.alert = 'Error while loading the data from api...';
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
  },
};
</script>
