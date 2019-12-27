
<template>
  <q-page class="flex column">
     <q-list class="full-width" separator>
      <q-item v-for="user in users" :key="user.id" class="q-my-sm" clickable v-ripple to="/chat">
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white">
            {{ user.name.charAt(0) }}
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ user.name }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-badge :color="user.online ? 'light-green' : 'grey'" :label="user.online ? 'Online' : 'Offline'"/>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      users: [{
        id: 1,
        name: 'Daniel',
        email: 'daniel0@discuz.net',
        online: true
      }, {
        id: 2,
        name: 'Jonathan',
        email: 'malessandrini1@marketwatch.com',
        online: false
      }, {
        id: 3,
        name: 'Armando',
        email: 'ewicklen2@microsoft.com',
        online: true
      }]
    }
  }
}
</script>

<style>

</style>
