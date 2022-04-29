<template>
  <v-container >
    <v-app-bar app>
      <v-row>
        <v-col cols="10">
          <!--          <v-toolbar-title> {{ jsonName === "" ? "json helper" : jsonName }}</v-toolbar-title>-->
        </v-col>
        <v-col cols="2">
          <v-btn color="primary" block @click="loadFile">switchjson</v-btn>
        </v-col>
      </v-row>
    </v-app-bar>

    <v-row class="mt-2">
      <v-col v-for="(item , index) in jsons" :key="filesPaths[index]" :cols="12/filesPaths.length">
        <v-app-bar>
          <v-row>
            <v-col cols="6" style="overflow: hidden">
              <h6>
                {{ filesPaths[index] }}
              </h6>
            </v-col>
            <v-col cols="2" >
              <v-btn color="green" dark block @click="changeColor(index)"><v-icon>mdi-palette</v-icon></v-btn>
            </v-col>
            <v-col cols="2" >
              <v-btn color="primary" block @click="saveJson(index)"><v-icon>mdi-content-save</v-icon></v-btn>
            </v-col>
            <v-col cols="2">
              <v-btn color="red" block @click="closeJson(index)">close</v-btn>
            </v-col>
          </v-row>
        </v-app-bar>
        <ObjectProp :content="item" :deepness="0" :tittle="filesPaths[index]" :basecolor=" colors[index]"></ObjectProp>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>

import ObjectProp from "./ObjectProp";

const fs = require('fs');
const electron = require('electron');
const dialog = electron.remote.dialog;
const path = require('path');

export default {
  name: 'Home',
  components: {ObjectProp},
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
