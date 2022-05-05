<template>
  <v-app
      style="background-repeat: repeat; background-image: url('https://jukeboxvr.fr/dist/assets/gif/ultra-light-hp-52d79828b249afbf40354aaf5fa9a19d.gif')">
    <v-app-bar dark app>
      <v-row>
        <v-col cols="8" align-self="center">
          <h2>
            INSANELY COOL JSON EDITOR
          </h2>
        </v-col>
        <v-col cols="2">
          <v-btn color="primary" block @click="clearPasteBin()">
            <v-icon>mdi-reload</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="2">
          <v-btn color="primary" block @click="loadFile">
            <v-icon>mdi-note-plus</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-app-bar>

    <v-container>
      <v-row>
        <v-col v-for="(item , index) in jsons" :key="filesPaths[index]" :cols="12/filesPaths.length">
          <v-card elevation="10" style="border-radius: 2em; margin-bottom: 1.2em">
            <v-app-bar dark elevation="0" color="primary" style="overflow: hidden; margin-bottom: 1em">
              <v-row>
                <v-col cols="9" style="overflow: hidden">
                  <h4 style=" padding-left: 2em; color: white; max-height: 40px ">
                    {{ filesPaths[index] }}
                  </h4>
                </v-col>
                <v-col cols="1">
                  <v-btn dark icon @click="changeColor(index)">
                    <v-icon>mdi-reload</v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="1">
                  <v-btn icon color="success" @click="saveJson(index)">
                    <v-icon>mdi-content-save</v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="1">
                  <v-btn icon color="red" @click="closeJson(index)">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-app-bar>
            <title-bar
                :title="filesPaths[index]"
                :icon="'mdi-menu'"
                :content="item"
                :deepness="0"
                :array-elem="-1"
            ></title-bar>
          </v-card>
        </v-col>
      </v-row>
      <v-scroll-y-transition>
        <v-card elevation="20" v-if="pastebinOpen && $ObjectOperation.pastebin" class="pastebin" style="border-radius: 2em; border: 1px solid rgba(0,0,0,0.2);" >
          <title-bar
              :title="$ObjectOperation.pastebin.title"
              :content="$ObjectOperation.pastebin.value"
              :deepness="0"
              :array-elem="-1"
              :pastebin="true"
          ></title-bar>
        </v-card>
      </v-scroll-y-transition>
      <v-btn style="position:fixed; bottom: 0; right: 25vw; width: 50%; border-radius: 2em" color="primary"
             @click="openPastebin()">
        PASTEBIN
        <v-icon right>{{ pastebinOpen ? 'mdi-arrow-down' : 'mdi-arrow-up' }}</v-icon>
      </v-btn>
    </v-container>

  </v-app>
</template>

<script>

import Vue from "vue";

const fs = require('fs');
const electron = require('electron');
const dialog = electron.remote.dialog;
const path = require('path');

export default {
  name: 'Home',
  data: () => {
    return {
      jsons: [],
      filesPaths: [],
      colors: [],
      pastebinOpen: false
    }
  },
  methods: {

    openPastebin() {
      this.pastebinOpen = !this.pastebinOpen;
      this.$forceUpdate();
    },
    loadFile() {
      let me = this;
      if (process.platform !== 'darwin') {
        dialog.showOpenDialog({
          title: 'Select the Files to be Load',
          defaultPath: path.join(__dirname, '../assets/'),
          buttonLabel: 'LoadFile(s)',
          filters: [
            {
              name: 'file',
              extensions: ['json']
            },],
          // Specifying the File Selector Property
          properties: ['openFile', 'multiSelections']
        }).then(file => {
          if (file.canceled) {
            console.error("open json canceled !");
          } else {
            for (let i = 0; i < file.filePaths.length; i++) {
              me.$fileSystem.load(file.filePaths[i], (result) => {
                    console.log(file.filePaths[i] + " : ");
                    console.log(result);
                    me.filesPaths[i] = file.filePaths[i];
                    me.jsons[i] = result;
                    me.colors[i] = Math.floor(Math.random() * 500);
                    me.$forceUpdate();
                  },
                  (error) => {
                    console.error(error);
                  });
            }
          }
        }).catch(err => {
          console.log(err)
        });
      }
    },

    closeJson(index) {
      this.jsons.splice(index, 1);
      this.filesPaths.splice(index, 1);
    },
    changeColor(index) {
      this.colors[index] = Math.floor(Math.random() * 500);
      this.$forceUpdate();
    },
    clearPasteBin() {
      this.$ObjectOperation.pastebin = null;
      this.$forceUpdate();
      console.log(this.jsons[0]);
    },
    saveJson(index) {
      this.$fileSystem.write(JSON.stringify(this.jsons[index]), "test.json", () => {

          },
          (error) => {
            console.error(error);
          })
    }

  }
}
</script>

<style>
.v-card {
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
}

.v-card::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}

.pastebin {
  position: fixed;
  bottom: 0;
  right: 25vw;
  width: 50%;
  max-height: 50%;
  min-height: 6em;
  padding-top: 1em;
  padding-bottom: 2em;
  overflow: scroll
}
</style>
