import Vue from 'vue'
import { firebaseAuth, firebaseRealtime } from '../boot/firebase'

let messagesRef
// import { firebaseAuth, firebaseRealtime, firebaseFirestore } from 'boot/firebase'

const state = { /* Todos los datos que alberga la app */
  userDetails: {},
  users: {},
  messages: {}
}

const mutations = { /* Métodos que manipulan la información de state, es síncrono y no puede manipular la BD */
  setUserDetails (state, payload) {
    state.userDetails = payload
  },
  addUser (state, payload) {
    Vue.set(state.users, payload.userId, payload.userDetails)
  },
  updateUser (state, payload) {
    Object.assign(state.users[payload.userId], payload.userDetails)
  },
  addMesage (state, payload) {
    Vue.set(state.messages, payload.messageId, payload.messageDetails)
  },
  clearMessages (state) {
    state.messages = {}
  }
}

const actions = { /* Parecido a mutations pero puede ser asíncrono y manipular BD, también puede llamar métodos de mutations */
  registerUser (algo, payload) {
    firebaseAuth.createUserWithEmailAndPassword(payload.email, payload.pass).then(res => {
      let userId = firebaseAuth.currentUser.uid
      firebaseRealtime.ref('users/' + userId).set({
        name: payload.name,
        email: payload.email,
        online: true
      })
    }).catch(error => {
      console.log('TCL: registerUser -> error', error)
    })
  },
  loginUser (algo, payload) {
    firebaseAuth.signInWithEmailAndPassword(payload.email, payload.pass).then(res => {
      // console.log('TCL: loginUser -> res', res)
    }).catch(error => {
      console.log('TCL: loginUser -> error', error)
    })
  },
  logoutUser () {
    firebaseAuth.signOut()
  },
  handleAuthStateChanged ({ commit, dispatch, state }) {
    console.log('User auth changed')
    firebaseAuth.onAuthStateChanged(user => {
      console.log('TCL: handleAuthStateChanged -> user', user)
      // let userId = firebaseAuth.currentUser.uid
      if (user) {
        firebaseRealtime.ref('users/' + user.uid).once('value', snapshot => { // Once ejecuta una sola vez
          let userDetails = snapshot.val()
          commit('setUserDetails', {
            name: userDetails.name,
            email: userDetails.email,
            userId: user.uid
          })
        })
        if (this.$router.currentRoute.fullPath !== '/') {
          this.$router.push('/')
        }
        dispatch('firebaseUpdateUser', {
          userId: user.uid,
          updates: {
            online: true
          }
        })
        dispatch('firebaseGetUsers')
      } else {
        this.$router.push('/auth')
        dispatch('firebaseUpdateUser', {
          userId: state.userDetails.userId,
          updates: {
            online: false
          }
        })
        commit('setUserDetails', {})
      }
    })
  },
  firebaseUpdateUser (algo, payload) {
    firebaseRealtime.ref('users/' + payload.userId).update(payload.updates)
  },
  firebaseGetUsers ({ commit }) {
    firebaseRealtime.ref('users').on('child_added', snapshot => {
      let userDetails = snapshot.val()
      let userId = snapshot.key
      commit('addUser', {
        userId,
        userDetails
      })
    })
    firebaseRealtime.ref('users').on('child_changed', snapshot => {
      let userDetails = snapshot.val()
      let userId = snapshot.key
      commit('updateUser', {
        userId,
        userDetails
      })
    })
  },
  firebaseGetMessages ({ commit, state }, otherUserId) {
    let userId = state.userDetails.userId
    messagesRef = firebaseRealtime.ref('chats/' + userId + '/' + otherUserId)
    messagesRef.on('child_added', snapshot => {
      let messageDetails = snapshot.val()
      let messageId = snapshot.key
      commit('addMesage', {
        messageId,
        messageDetails
      })
    })
  },
  firebaseStopGettingMessages ({ commit }) {
    if (messagesRef) {
      messagesRef.off('child_added')
      commit('clearMessages')
    }
  },
  firebaseSendMessage (algo, payload) {
    console.log('TCL: firebaseSendMessage -> payload', payload)
    firebaseRealtime.ref('chats/' + state.userDetails.userId + '/' + payload.otherUserId).push(payload.message)
    payload.message.from = 'them'
    firebaseRealtime.ref('chats/' + payload.otherUserId + '/' + state.userDetails.userId).push(payload.message)
  }
}

const getters = { /* Hace que la información de state esté disponible */
  users: state => {
    let usersFiltered = {}
    Object.keys(state.users).forEach(key => {
      if (key !== state.userDetails.userId) {
        usersFiltered[key] = state.users[key]
      }
    })
    return usersFiltered
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
