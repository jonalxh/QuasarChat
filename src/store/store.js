import { firebaseAuth, firebaseRealtime } from '../boot/firebase'

// import { firebaseAuth, firebaseRealtime, firebaseFirestore } from 'boot/firebase'

const state = { /* Todos los datos que alberga la app */
  userDetails: {}
}

const mutations = { /* Métodos que manipulan la información de state, es síncrono y no puede manipular la BD */
  setUserDetails (state, payload) {
    state.userDetails = payload
  }
}

const actions = { /* Parecido a mutations pero puede ser asíncrono y manipular BD, también puede llamar métodos de mutations */
  registerUser (algo, payload) {
    firebaseAuth.createUserWithEmailAndPassword(payload.email, payload.pass).then(res => {
      console.log(res)
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
      console.log('TCL: loginUser -> res', res)
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
        this.$router.push('/')
        dispatch('firebaseUpdateUser', {
          userId: user.uid,
          updates: {
            online: true
          }
        })
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
  }
}

const getters = { /* Hace que la información de state esté disponible */

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
