<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          aria-label="Menu"
          v-if="$route.fullPath !== '/chat'"
        />
        <q-btn icon="arrow_back" flat dense v-if="$route.fullPath === '/chat'" v-go-back.single/>

        <q-toolbar-title class="absolute-center">
          {{ title }}
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

      <!-- show-if-above -->
    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      content-class="bg-grey-2"
    >
      <q-list>
        <q-item-label header>Menú principal</q-item-label>
        <q-item clickable tag="a" to="/">
          <q-item-section avatar>
            <q-icon name="record_voice_over" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Contactos</q-item-label>
            <q-item-label caption>Listado de contactos</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" to="/auth" v-if="!userDetails.userId">
          <q-item-section avatar>
            <q-icon name="lock_open" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Autenticación</q-item-label>
            <q-item-label caption>Login y registro</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" v-else @click="logoutUser">
          <q-item-section avatar>
            <q-icon name="exit_to_app" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Cerrar sesión</q-item-label>
            <q-item-label caption>{{ userDetails.name }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'MyLayout',

  data () {
    return {
      leftDrawerOpen: false
    }
  },
  computed: {
    ...mapState('store', ['userDetails']),
    title () {
      let currentPath = this.$route.fullPath
      return currentPath === '/' ? 'Contactos' : currentPath === '/chat' ? 'Chats' : 'Autenticación'
    }
  },
  methods: {
    ...mapActions('store', ['logoutUser'])
  }
}
</script>
