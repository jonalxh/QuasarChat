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
          v-if="!$route.fullPath.includes('/chat')"
        />
        <q-btn icon="arrow_back" flat dense v-if="$route.fullPath.includes('/chat')" v-go-back.single/>

        <q-toolbar-title class="absolute-center">
          {{ title }} <q-avatar :color="this.otherUserDetails.online ? 'green' : 'grey'" size="xs" v-if="$route.fullPath.includes('/chat')"></q-avatar>
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-footer reveal elevated bordered>
      <q-tabs>
        <q-route-tab v-for="item in navs" :icon="item.icon" :label="item.label" :to="item.to" :key="item.label"/>
      </q-tabs>
    </q-footer>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      content-class="bg-primary"
    >
      <q-list class="text-grey-4">
        <q-item-label header class="text-white">Menú principal</q-item-label>
        <q-item clickable exact to="/" v-if="userDetails.userId" class="text-white">
          <q-item-section avatar>
            <q-icon name="record_voice_over" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Contactos</q-item-label>
            <q-item-label caption class="text-grey-5">Listado de contactos</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable exact to="/info">
          <q-item-section avatar>
            <q-icon name="info_outline" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Acerca de</q-item-label>
            <q-item-label caption>Información relevante de la app</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable exact to="/auth" v-if="!userDetails.userId">
          <q-item-section avatar>
            <q-icon name="lock_open" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Autenticación</q-item-label>
            <q-item-label caption>Login y registro</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-else @click="logoutUser">
          <q-item-section avatar>
            <q-icon name="exit_to_app" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Cerrar sesión</q-item-label>
            <q-item-label caption>Has iniciado como: {{ userDetails.name }}</q-item-label>
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
import mixinOtherUserDetails from 'src/mixins/mixin-other-user-details.js'

export default {
  mixins: [mixinOtherUserDetails],
  data () {
    return {
      leftDrawerOpen: false,
      navs: [
        { label: 'Contactos', icon: 'record_voice_over', to: '/' },
        { label: 'Autenticación', icon: 'lock_open', to: '/auth' },
        { label: 'Info', icon: 'info_outline', to: '/info' },
        { label: 'Cerrar sesión', icon: 'exit_to_app', to: '/logout' }
      ]
    }
  },
  computed: {
    ...mapState('store', ['userDetails']),
    title () {
      let currentPath = this.$route.fullPath
      return currentPath === '/' ? 'Contactos' : currentPath.includes('/chat') ? this.otherUserDetails.name : currentPath === '/auth' ? 'Autenticación' : currentPath === '/info' ? 'Información' : 'Quasar chat'
    }
  },
  methods: {
    ...mapActions('store', ['logoutUser'])
  }
}
</script>

<style scoped>
.q-router-link--exact-active{
  color: white;
}
</style>
