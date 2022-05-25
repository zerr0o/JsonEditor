<template>
  <v-app
      style="background-repeat: repeat; background-image: url('https://jukeboxvr.fr/dist/assets/gif/ultra-light-hp-52d79828b249afbf40354aaf5fa9a19d.gif')">


    <element-adder v-if="$ObjectOperation.editing"
                   :edit="$ObjectOperation.editing.edit"
                   :array="$ObjectOperation.editing.array"
                   :return-function="$ObjectOperation.editing.returnFunction"
                   :type="$ObjectOperation.editing.type"
    ></element-adder>

    <v-app-bar dark app>
      <v-row no-gutters>
        <v-col cols="4" align-self="center">
          <h2>
            INSANELY COOL JSON EDITOR
          </h2>
        </v-col>

        <v-col cols="4">
          <v-row no-gutters>
            <v-col cols="1" align-self="center">
              <v-icon>mdi-magnify</v-icon>
            </v-col>
            <v-col cols="10" align-self="baseline">
              <v-text-field class="pt-7" label="search" v-model="search" clearable></v-text-field>
            </v-col>
            <v-col cols="1" align-self="center">
              <v-btn @click="pasteClipBoard()" icon>
                <v-icon>mdi-content-paste</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="3" offset="1" align-self="center">
          <v-row>
            <v-col cols="6">
              <v-btn :color="$ObjectOperation.showOnlySearch ? 'red':'primary' " block @click="toggleOnlySearch()">
                <v-icon left> {{ $ObjectOperation.showOnlySearch ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                 {{  $ObjectOperation.showOnlySearch ? 'only search' : 'everything' }}
              </v-btn>
            </v-col>
            <v-col cols="3">
              <v-btn color="primary" block @click="loadFile">
                <v-icon>mdi-folder-download</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="3">
              <v-btn color="primary" block @click="createFile">
                <v-icon>mdi-note-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-app-bar>

    <v-container>

      <v-row>
        <v-col v-for="(item , index) in jsons" :key="filesPaths[index]" :cols=" Math.max(6 , 12/filesPaths.length)">
          <v-card elevation="10" class="rounded-xl">
            <v-app-bar dark elevation="0" color="primary">
              <v-row>
                <v-col cols="9" style="overflow: hidden">
                  <v-card-title>
                    {{ filesPaths[index] }}
                  </v-card-title>
                </v-col>
                <v-col cols="1">
                  <v-btn :color="magnify[index] ? 'green' : 'red'" dark icon @click="toggleSearh(index)">
                    <v-icon>mdi-magnify</v-icon>
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
            <v-card-text>

              <title-bar v-if="!magnify[index] || searchModify"
                         :title="filesPaths[index]"
                         :icon="'mdi-menu'"
                         :content="item"
                         :deepness="0"
                         :array-elem="-1"
                         :search-value=" magnify[index] ?  searchObj : null"/>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-scroll-y-transition>
        <v-card elevation="20" v-if="pastebinOpen && $ObjectOperation.pastebin" class="pastebin rounded-xl"
        >
          <v-card-text>
            <title-bar
                :title="$ObjectOperation.pastebin.title"
                :content="$ObjectOperation.pastebin.value"
                :deepness="0"
                :array-elem="-1"
                :pastebin="true"
            />
          </v-card-text>
        </v-card>
      </v-scroll-y-transition>
      <v-btn :disabled="!$ObjectOperation.pastebin" style="position:fixed; bottom: 0; right: 25vw; width: 50%;"
             class="rounded-xl" color="primary"
             @click="openPastebin()">
        PASTEBIN
        <v-icon right>{{ pastebinOpen ? 'mdi-arrow-down' : 'mdi-arrow-up' }}</v-icon>
      </v-btn>
    </v-container>


    <div style="position: fixed; bottom: 0; width: 20%; right: 0" class="pr-3 pb-4">
      <v-alert v-for="(alert , index )  in $genericMethods.alerts" :key="alert.text +''+index"
               border="left"
               :color="alert.color"
               dense
               prominent
               :icon="alert.icon"
               :type="alert.type"
      >{{ alert.text }}</v-alert>
    </div>

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
      magnify: [],
      pastebinOpen: false,
      search: null,
      searchModify: true,
      searchObj: {
        txt: null,
        searching: false
      }
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
                    // console.log(file.filePaths[i] + " : ");
                    // console.log(result);
                    me.filesPaths.push(file.filePaths[i]);
                    me.jsons.push(result);
                    me.magnify.push(true);

                    this.$genericMethods.addAlert(
                        {
                          text:"JSON Loaded" ,
                          icon:"mdi-plus",
                          color:"green",
                          type:"success"
                        })

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
      this.magnify.splice(index, 1);
      this.$genericMethods.addAlert(
          {
            text:"JSON closed" ,
            icon:"mdi-close",
            color:"primary",
            type:"success"
          })
    },
    toggleOnlySearch() {
      //this.$ObjectOperation.pastebin = null;
      this.$ObjectOperation.showOnlySearch = !this.$ObjectOperation.showOnlySearch
      this.$forceUpdate();
    },
    saveJson(index) {
      const content = "File content to save";
      const element = document.createElement("a");
      const file = new Blob([JSON.stringify(this.jsons[index])], {type: "text/plain"});
      element.href = URL.createObjectURL(file);
      element.download = "myJson.json";
      element.click();

    },
    createFile() {
      this.jsons.push({});
      this.filesPaths.push("new file");
      this.$genericMethods.addAlert(
          {
            text:"new json added",
            icon:"mdi-plus",
            color:"green",
            type:"success"
          })
    },
    toggleSearh(index) {
      this.magnify[index] = !this.magnify[index];
      this.$forceUpdate();
      this.$genericMethods.addAlert(
          {
            text:"toggle search : " + this.magnify[index],
            icon:"mdi-magnify",
            color:"primary",
            type:"success"
          })
    },
    pasteClipBoard() {
      let me = this;
      navigator.clipboard.readText().then(function (result) {
        console.log('Async: reading to clipboard was successful : ' + result);
        me.search = result;
      }, function (err) {
        console.error('Async: Could not copy text: ', err);
      });


    }

  },
  watch: {
    search(value) {

      this.searchModify = false;
      setTimeout(() => {
        this.searchObj = {
          txt: value,
          searching: !!value
        }
        this.searchModify = true;
      }, 10)
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
