<template>
    <v-app>
      <v-app-bar app>
        Electron vue template V2
      </v-app-bar>
      <!-- Sizes your content based upon application components -->
      <v-main>
        <router-view></router-view>
      </v-main>
    </v-app>
</template>

<script>

export default {
  name: 'App'
}

</script>

<style lang="less">
  @import './index.less';
</style>

