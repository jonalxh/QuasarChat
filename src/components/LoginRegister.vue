// Este archivo es porque el formulario de login es similar al de register
<template>
  <q-form
    @submit="onSubmit"
    class="q-gutter-md">
    <q-input v-model="formData.name" type="text" label="Nombre" v-if="tab === 'register'"/>
    <q-input v-model="formData.email" type="email" label="Correo" />
    <q-input v-model="formData.pass" type="password" label="Contraseña" />

    <q-btn :label="tab" type="submit" color="primary"/>
  </q-form>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: ['tab'],
  data () {
    return {
      formData: {
        name: '',
        email: 'p@h.com',
        pass: '123456'
      }
    }
  },
  methods: {
    ...mapActions('store', ['registerUser', 'loginUser']),
    onSubmit () {
      if (this.tab === 'login') {
        this.loginUser(this.formData)
      } else {
        this.registerUser(this.formData)
      }
    }
  }
}
</script>

<style>
</style>
