<template>
  <v-app>
    <v-navigation-drawer absolute temporary v-model="drawerToggle">
      <v-list>
        <v-list-item>
          <v-list-item-action>
            <v-icon>mdi-account</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            Contacts ({{ contacts.length }})
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list>
        <v-list-item v-for="user in contacts" v-bind:key="user.username">

          <!--online-->
          <v-badge v-show="user.online"
                   bordered
                   bottom
                   color="green accent-4"
                   dot
                   offset-x="10"
                   offset-y="10"
          >
            <v-list-item-avatar>
              <img :src="user.avatar" alt="avatar"/>
            </v-list-item-avatar>
          </v-badge>

          <!--offline-->
          <v-badge v-show="!user.online"
                   bordered
                   bottom
                   color="grey lighten-2"
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
             style="text-decoration: none; cursor: pointer"> Log out</a>
        </v-list-item-content>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app class="light-blue darken-1">
      <v-app-bar-nav-icon @click.native.stop="drawerToggle = !drawerToggle"></v-app-bar-nav-icon>
      <v-toolbar-title v-show="!isMobile">
        <router-link :to="/chat/ + lastChatId" tag="span" style="cursor: pointer">Vladex
        </router-link>
      </v-toolbar-title>
      <div v-show="isMobile && !showRoomsList">
        <v-btn color="#039ce5" v-on:click="goBackToRoomsList">
          <v-icon>arrow_back</v-icon>
        </v-btn>
      </div>
      <div v-show="(isMobile && !showRoomsList) || !isMobile"
           :style="{'padding-left': !isMobile? '110px': '20px'}"> {{ chatName }} {{ chatStatus }}
      </div>
      <v-spacer></v-spacer>
      <v-toolbar-items v-for="item in menuItems" v-bind:key="item.route">
        <v-btn text :key="item.title" :to="item.route">
          <v-icon left>{{ item.icon }}</v-icon>
          <div class="hidden-xs-only">{{ item.title }}</div>
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
          {icon: 'mdi-magnify', title: 'Search', route: '/search'},
        ]
      }
      return items
    },
    logoutHref() {
      return process.env.VUE_APP_AUTH_URL + "/logout";
    },
    chatName() {
      let activeChat = this.$store.getters.activeChat;
      return activeChat === undefined ? "" : activeChat.name;
    },
    chatStatus() {
      let activeChat = this.$store.getters.activeChat;
      return activeChat === undefined || !activeChat.online ? "" : "(online)";
    },
    userIsAuthenticated() {
      return this.$store.getters.user !== null && this.$store.getters.user !== undefined;
    },
    lastChatId() {
      return this.$store.getters.user ? this.$store.getters.user.chatIdToLoad : 0
    },
    contacts() {
      return this.$store.getters.contacts;
    }
  }
}
</script>