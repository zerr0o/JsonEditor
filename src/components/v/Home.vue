<template>
  <v-app>
    <v-app-bar app >
      <v-row>
        <v-col cols="8">
            <h4 style="padding-left: 2em; color: cornflowerblue; max-height: 40px">
              In the pastebin : {{ $pastebin.elemTitle }}
            </h4>
        </v-col>
        <v-col cols="2">
          <v-btn color="primary" block @click="clearPasteBin()">Clear pastebin <v-icon>mdi-close</v-icon></v-btn>
        </v-col>
        <v-col cols="2">
          <v-btn color="primary" block @click="loadFile">switchjson</v-btn>
        </v-col>
      </v-row>
    </v-app-bar>

    <v-container>
    <v-row >
      <v-col v-for="(item , index) in jsons" :key="filesPaths[index]" :cols="12/filesPaths.length">
        <v-app-bar style="border-radius: 2em; margin-bottom: 0.2em">
          <v-row>
            <v-col cols="5" style="overflow: hidden" >
              <h4 style="padding-left: 2em; color: cornflowerblue; max-height: 40px">
                {{ filesPaths[index] }}
              </h4>
            </v-col>
            <v-col cols="1" >
              <v-btn color="green" dark icon @click="changeColor(index)"><v-icon>mdi-palette</v-icon></v-btn>
            </v-col>
            <v-col cols="1" >
              <v-btn icon color="primary"  @click="saveJson(index)">
                <v-icon>mdi-content-save</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="1">
              <v-btn icon color="red"  @click="closeJson(index)">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-app-bar>
        <object-prop :content="item" :deepness="0" :tittle="filesPaths[index]" :basecolor=" colors[index]"></object-prop>
      </v-col>
    </v-row>
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
      colors:[]
    }
  },
  methods: {

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
                    me.colors[i]= Math.floor(Math.random() * 500);
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
    saveJson(index)
    {
      console.log("TODO : save the json")
    },
    changeColor(index)
    {
      this.colors[index]= Math.floor(Math.random() * 500);
      this.$forceUpdate();
    },
    clearPasteBin()
    {
      Vue.prototype.$pastebin =  { type : null , elemTitle : null ,  elem : null };
      this.$forceUpdate();
    }

  }
}
</script>

<style >

  .v-card
  {
    border-radius: 2em !important;
  }

</style>
