
<template>
  <q-page class="page-chat flex column" ref="pageChat">
    <q-banner class="bg-grey-4 text-center" v-if="!otherUserDetails.online">
      {{ otherUserDetails.name }} is offline
    </q-banner>
    <div class="q-pa-md column col justify-end" :class="{ 'invisible' : !showMessages }">
      <q-chat-message
        v-for="(message, key) in messages"
        :key="key"
        :name="message.from == 'me' ? '' : otherUserDetails.name"
        :text="[message.text]"
        :sent="message.from == 'me' ? true : false"
      />
    </div>
    <q-footer elevated>
      <q-toolbar>
        <q-form @submit="sendMessage" class="full-width">
          <q-input
            v-model="newMessage"
            ref="newMessage"
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
import { mapState, mapActions } from 'vuex'
import mixinOtherUserDetails from 'src/mixins/mixin-other-user-details.js'

export default {
  mixins: [mixinOtherUserDetails],
  data () {
    return {
      newMessage: '',
      showMessages: false
    }
  },
  methods: {
    ...mapActions('store', ['firebaseGetMessages', 'firebaseStopGettingMessages', 'firebaseSendMessage']),
    sendMessage () {
      this.firebaseSendMessage({
        message: {
          text: this.newMessage,
          from: 'me'
        },
        otherUserId: this.$route.params.otherUserId
      })
      this.newMessage = ''
      this.$refs.newMessage.focus()
    },
    scrollToBottom () {
      let pageChat = this.$refs.pageChat.$el
      setTimeout(() => {
        window.scrollTo(0, pageChat.scrollHeight)
      }, 20)
    }
  },
  computed: {
    ...mapState('store', ['messages', 'userDetails'])
  },
  watch: {
    messages: function (val) {
      if (Object.keys(val).length) {
        this.scrollToBottom()
        setTimeout(() => {
          this.showMessages = true
        }, 200)
      }
    }
  },
  mounted () {
    this.firebaseGetMessages(this.$route.params.otherUserId)
  },
  destroyed () {
    this.firebaseStopGettingMessages()
  }
}
</script>

<style lang="stylus" scoped>
  .page-chat
    &:after
      content: ''
      display block
      position fixed
      opacity 0.1
      left 0
      right 0
      top 0
      bottom 0
      z-index 0
      background linear-gradient(135deg, #708090 21px, #d9ecff 22px, #d9ecff 24px, transparent 24px, transparent 67px, #d9ecff 67px, #d9ecff 69px, transparent 69px), linear-gradient(225deg, #708090 21px, #d9ecff 22px, #d9ecff 24px, transparent 24px, transparent 67px, #d9ecff 67px, #d9ecff 69px, transparent 69px)0 64px
      background-color #708090;
      background-size 64px 128px;
  .q-banner
    z-index 2
    opacity 0.8
  .q-message
    z-index 1
    opacity 1
</style>
