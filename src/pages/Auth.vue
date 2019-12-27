
<template>
  <div>
    <q-tabs v-model="tab" align="justify" narrow-indicator class="q-mb-lg">
      <q-tab name="login" label="Login" />
      <q-tab name="register" label="Registro" />
    </q-tabs>
    <div class="q-gutter-y-sm">
      <q-tab-panels
        v-model="tab"
        animated
        transition-prev="scale"
        transition-next="scale"
        class="text-center"
      >
        <q-tab-panel name="login">
          <login-register :tab="tab"/>
        </q-tab-panel>
      </q-tab-panels>

      <q-tab-panels
        v-model="tab"
        animated
        transition-prev="fade"
        transition-next="fade"
        class="text-center"
      >
        <q-tab-panel name="register">
          <login-register :tab="tab"/>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tab: 'login'
    }
  },
  components: {
    'login-register': require('components/LoginRegister.vue').default
  }
}
</script>

<style>
</style>
