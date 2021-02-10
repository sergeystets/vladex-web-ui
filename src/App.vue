<template>
  <v-app>
    <v-navigation-drawer v-if="!(isMobile && !showRoomsList)" absolute temporary v-model="drawerToggle">
      <v-list>
        <v-list-item>
          <v-list-item-action>
            <v-icon>mdi-account</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            {{ $t('label.contacts') }} ({{ contacts.length }})
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list>
        <v-list-item v-for="user in contacts" v-bind:key="user.username">
          <v-badge
              bordered
              bottom
              :color="user.online?'green accent-4' : 'grey lighten-2'"
              dot
              offset-x="10"
              offset-y="10"
          >
            <v-list-item-avatar>
              <img :src="user.avatar" alt="avatar"/>
            </v-list-item-avatar>

          </v-badge>
          <v-list-item-content>
            <v-list-item-title>{{ user.username }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list>
        <v-list-item-content class="text-center red--text">
          <a :href=logoutHref class="red--text" @click="logout"
             style="text-decoration: none; cursor: pointer"> {{ $t('label.button.logout') }}</a>
        </v-list-item-content>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app class="light-blue darken-1">
      <v-app-bar-nav-icon v-if="isMobile && !showRoomsList" @click.native.stop="goBackToRoomsList">
        <v-icon>mdi-arrow-left</v-icon>
      </v-app-bar-nav-icon>
      <v-app-bar-nav-icon v-else @click.native.stop="drawerToggle = !drawerToggle">
      </v-app-bar-nav-icon>
      <v-toolbar-title v-show="!isMobile || showRoomsList">
        <router-link to="/" tag="span" style="cursor: pointer">Vladex
        </router-link>
      </v-toolbar-title>
      <div v-show="(isMobile && !showRoomsList) || !isMobile"
           :style="{'padding-left': !isMobile? '110px': '20px'}"> {{ chatName }} {{ chatStatus }}
      </div>
      <v-spacer></v-spacer>
      <v-toolbar-items v-for="item in menuItems" v-bind:key="item.route">
        <v-btn text :key="item.title" :to="item.route">
          <v-icon left>{{ item.icon }}</v-icon>
          <div class="hidden-xs-only">{{ $t('label.button.search') }}</div>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>

export default {
  data() {
    return {
      drawerToggle: false,
    }
  },
  methods: {
    goBackToRoomsList() {
      this.$store.dispatch('goBackToRoomsList');
    },
    logout() {
      this.$store.dispatch('logout');
    }
  },
  computed: {
    isMobile() {
      return this.$store.getters.isMobile;
    },
    showRoomsList() {
      return this.$store.getters.showRoomsList;
    },
    menuItems() {
      let items = [];
      if (this.userIsAuthenticated) {
        items = [
          {icon: 'mdi-magnify', title: 'label.button.search', route: '#'},
        ]
      }
      return items
    },
    logoutHref() {
      return process.env.VUE_APP_AUTH_URL + "/logout";
    },
    chatName() {
      let activeChat = this.$store.getters.activeChat;

      if (activeChat !== undefined) {
        return activeChat.peerToPeer ?
            activeChat.members.find(m => m.id !== this.$store.getters.user.id).username :
            activeChat.name;
      }
      return "";
    },
    chatStatus() {
      let activeChat = this.$store.getters.activeChat;

      if (activeChat !== undefined) {
        return activeChat.peerToPeer ?
            (activeChat.members.find(m => m.id !== this.$store.getters.user.id).online ? "(online)" : "") : "";

      }
      return "";
    },
    userIsAuthenticated() {
      return this.$store.getters.user !== null && this.$store.getters.user !== undefined;
    },
    contacts() {
      return this.$store.getters.contacts;
    }
  }
}
</script>