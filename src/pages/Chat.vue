
<template>
  <q-page class="flex column">
    <q-banner class="bg-grey-4 text-center">
      User is offline
    </q-banner>
    <div class="q-pa-md column col justify-end">
      <q-chat-message
        v-for="message in messages"
        :key="message.text"
        :name="message.from"
        :text="[message.text]"
        :sent="message.from == 'Yo' ? true : false"
      />
    </div>
    <q-footer elevated>
      <q-toolbar>
        <q-form @submit="sendMessage" class="full-width">
          <q-input
            v-model="newMessage"
            bg-color="white"
            outlined
            rounded
            label="Escribe aquí"
            dense
          >
            <template v-slot:after>
              <q-btn round dense flat @click="sendMessage" color="white" icon="send"/>
            </template>
          </q-input>
        </q-form>
      </q-toolbar>
    </q-footer>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      newMessage: '',
      messages: [
        {
          text: 'Hola ¿Cómo estás?',
          from: 'Yo'
        },
        {
          text: 'Muy bien ¿Y vos?',
          from: 'Alguien'
        },
        {
          text: 'Eso me alegra mucho, yo muy bien, solo pasaba a saludar.',
          from: 'Yo'
        }
      ]
    }
  },
  methods: {
    sendMessage () {
      this.messages.push({
        text: this.newMessage,
        from: 'Yo'
      })
      this.newMessage = ''
    }
  }
}
</script>

<style>
</style>
