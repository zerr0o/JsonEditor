<template>
  <div style="padding-left: 1em; ">

    <div v-if="!$ObjectOperation.isAVar(content) && deepness !==0"
         style="position: absolute; height: 100%; width: 100%; top:0 ; left: 0;"
         :class="{'openedDiv' : isOpened }"></div>

    <div @click.stop="isOpened = !isOpened">

      <v-row no-gutters dense style="margin: 0 !important;">

        <v-col align-self="center" cols="1">
          <v-icon :color="getColor(content)">{{ getIcon() }}</v-icon>
        </v-col>
        <v-col align-self="center" :cols="$ObjectOperation.isAVar(content) ? 2 :8">
          <h5 style="text-align: start; color: grey; padding-left: 1.5em"
              :style="{ 'background-color': arrayElem>= 0?'rgba(76,255,255,0.18)':'rgba(76,255,0,0.18)'}"
          >{{ title }}</h5>
        </v-col>
        <v-col align-self="center" v-if="$ObjectOperation.isAVar(content)" cols="6">
          <h5 style=" text-align: center; overflow: hidden; background-color: rgba(255,0,0,0.18)">{{ content }}</h5>
        </v-col>

        <v-col cols="3" >
          <v-row no-gutters>
            <v-col cols="3" align="center">
              <v-btn v-if="!$ObjectOperation.isAVar(content)" icon elevation="0" color="green"
                     @click.stop="pasteHere()">
                <v-icon>mdi-content-paste</v-icon>
              </v-btn>
            </v-col>

            <v-col cols="3" align="center">
              <v-btn icon elevation="0" color="primary" @click.stop="copyElem()">
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
            </v-col>

            <v-col cols="3" align="center">
              <v-btn v-if="deepness>0" icon @click.stop="askedDeleteElem()">
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </v-col>

            <v-col cols="3" align="center">
              <v-btn icon @click.stop="addElem()">
                <v-icon color="green">mdi-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

    </div>

    <div v-if="isOpened">
      <!--   if it is an object     -->
      <div v-if="$ObjectOperation.isAnObject(content)">
        <object-prop @reOpen="reOpen()" :content="content" :tittle="content" :deepness="deepness+1"></object-prop>
      </div>
      <!--   if it is an array     -->
      <div v-else-if="$ObjectOperation.isAnArray(content)">
        <array-prop @reOpen="reOpen()" :content="content" :tittle="content" :deepness="deepness+1"></array-prop>
      </div>
    </div>

  </div>
</template>

<script>

import Vue from "vue";

export default {
  name: "TitleBar",
  props: ['title', "content", "arrayElem", 'deepness', "deleteItem"],
  data: () => {
    return {
      isOpened: false,
    }
  },
  created() {
    if (this.deepness === 0)
      this.isOpened = true;
  },
  methods: {
    getIcon() {
      if (this.isOpened) {
        switch (this.getIconType()) {
          case this.$constants.ELEM_TYPE_OBJ :
            if (this.arrayElem >= 0)
              return "mdi-arrow-down"
            else
              return "mdi-folder-open";
          case this.$constants.ELEM_TYPE_ARRAY :
            return "mdi-application-array-outline"
          case this.$constants.ELEM_TYPE_VAR :
            return this.getIconAndType(this.content)
          default:
            return this.icon
        }

      } else {
        switch (this.getIconType()) {
          case this.$constants.ELEM_TYPE_OBJ :
            if (this.arrayElem >= 0)
              return "mdi-arrow-right"
            else
              return "mdi-folder";
          case this.$constants.ELEM_TYPE_ARRAY :
            return "mdi-application-array"
          case this.$constants.ELEM_TYPE_VAR :
            return this.getIconAndType(this.content)
          default:
            return this.icon
        }
      }

    },
    getIconAndType(value) {
      if (!value) {
        return "mdi-help-circle-outline";
      }

      let stringValue = value.toString();
      switch (true) {
        case stringValue.includes(".mp4") || stringValue.includes(".MP4"):
          return "mdi-youtube";
        case stringValue.includes(".jpg") || stringValue.includes(".JPG") || stringValue.includes(".png") || stringValue.includes(".PNG"):
          return "mdi-file-image";
        case !isNaN(parseInt(stringValue)):
          return "mdi-numeric";
        case stringValue === "true" || stringValue === "false":
          return stringValue === "true" ? "mdi-checkbox-outline" : "mdi-checkbox-blank-outline";
        default :
          return "mdi-alphabetical-variant";
      }

    },
    getColor() {
      let value = this.content;
      if (!value || !this.$ObjectOperation.isAVar(value)) {
        return "black";
      }
      let stringValue = value.toString();
      switch (true) {
        case stringValue.includes(".mp4") || stringValue.includes(".MP4"):
          return "red";
        case stringValue.includes(".jpg") || stringValue.includes(".JPG") || stringValue.includes(".png") || stringValue.includes(".PNG"):
          return "yellow";
        case !isNaN(parseInt(stringValue)):
          return "green";
        case stringValue === "true" || stringValue === "false":
          return stringValue === "true" ? "blue" : "red";
        default :
          return "orange";
      }
    },
    getIconType() {
      switch (true) {
        case this.$ObjectOperation.isAnObject(this.content):
          return this.$constants.ELEM_TYPE_OBJ;
        case this.$ObjectOperation.isAnArray(this.content):
          return this.$constants.ELEM_TYPE_ARRAY;
        default:
          return this.$constants.ELEM_TYPE_VAR;
      }
    },
    copyElem() {
      this.$ObjectOperation.pastebin = {title: this.title, value: this.content};
    },
    pasteHere() {
      if (!this.$ObjectOperation.pastebin)
        return;

      if (this.$ObjectOperation.isAnObject(this.content)) {
        let keyValue = this.$ObjectOperation.pastebin.title;
        while (this.content[keyValue])
          keyValue += '-copy';
        console.log(JSON.stringify(this.$ObjectOperation.pastebin));
        this.content[keyValue] = JSON.parse(JSON.stringify(this.$ObjectOperation.pastebin.value));
        this.reOpen();
      } else if (this.$ObjectOperation.isAnArray(this.content)) {
        this.content.push(JSON.parse(JSON.stringify(this.$ObjectOperation.pastebin.value)));
        this.reOpen();
      } else {
        console.log("canbt paste here");
      }

    },
    askedDeleteElem() {
      this.deleteItem({title: this.title, value: this.content, index: this.arrayElem});
    },
    reOpen() {
      this.$forceUpdate();
      this.isOpened = false;
      let me = this;
      setTimeout(() => {
        me.isOpened = true;
      }, 200)
    },
    addElem() {

    }


  }
}
</script>

<style scoped>


.openedDiv:before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3%; /* or 100px */
  border-bottom: 3px solid lightblue;
  border-top: 3px solid lightblue;
  border-left: 3px solid lightblue;
  border-radius: 2em 0 0 2em;
}

</style>
