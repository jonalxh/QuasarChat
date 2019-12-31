
<template>
  <q-page class="page-chat flex column" ref="pageChat">
    <div class="q-pa-md column col justify-end" :class="{ 'invisible' : !showMessages }">
      <q-chat-message
        v-for="(message, key) in messages"
        :key="key"
        :name="message.from == 'me' ? '' : otherUserDetails.name"
        :text="[message.text]"
        :sent="message.from == 'me' ? true : false"
        :stamp="message.date ? formatDate(message.date) : ''"
      />

      <transition
        appear
        enter-active-class="animated fadeInLeft"
        leave-active-class="animated fadeOutLeft"
      >
        <q-btn color="primary" icon="keyboard_arrow_down" id="scroll-to-bottom" round class="fixed-bottom-left shadow-6" @click="scrollToBottom" v-if="scrolledToTop"/>
      </transition>
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
import { date, scroll } from 'quasar'
import mixinOtherUserDetails from 'src/mixins/mixin-other-user-details.js'
const { getScrollTarget, setScrollPosition } = scroll

export default {
  mixins: [mixinOtherUserDetails],
  data () {
    return {
      newMessage: '',
      showMessages: false,
      scrolledToTop: false
    }
  },
  methods: {
    ...mapActions('store', ['firebaseGetMessages', 'firebaseStopGettingMessages', 'firebaseSendMessage']),
    formatDate (dateObject) {
      const now = new Date()
      let formatted
      let diff = date.getDateDiff(now, dateObject, 'days')
      if (diff === 0) {
        diff = date.getDateDiff(now, dateObject, 'hours')
        if (diff === 0) {
          diff = date.getDateDiff(now, dateObject, 'minutes')
          formatted = 'Hace ' + diff + (diff <= 1 ? ' minutos' : ' minutos')
        } else {
          formatted = 'Hace ' + diff + (diff <= 1 ? ' hora' : ' horas')
        }
      } else {
        formatted = date.formatDate(dateObject, 'DD/MM/YY h:mm A')
      }
      return formatted
    },
    sendMessage () {
      this.firebaseSendMessage({
        message: {
          text: this.newMessage,
          from: 'me',
          date: Date.now()
        },
        otherUserId: this.$route.params.otherUserId
      })
      this.newMessage = ''
      this.$refs.newMessage.focus()
    },
    scrollToBottom () {
      const el = this.$refs.pageChat.$el
      const target = getScrollTarget(el)
      const offset = el.scrollHeight
      const duration = 1000
      setScrollPosition(target, offset, duration)
    },
    scroll () {
      window.onscroll = () => {
        let bottomOfWindow = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight === document.documentElement.offsetHeight

        if (!bottomOfWindow) {
          this.scrolledToTop = true
        } else {
          this.scrolledToTop = false
        }
      }
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
    this.scroll()
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
  #scroll-to-bottom
    z-index 2
    bottom 60px
    left 10px
</style>
