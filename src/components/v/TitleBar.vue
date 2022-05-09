<template>
  <div style="position: relative" >

    <div v-if="!$ObjectOperation.isAVar(content) && deepness > 0"
         :class="{'opened-div' : isOpened }"
         :style="{ 'padding-left' : deepness*0.7+'rem' }"
    ></div>

    <div @click.stop="isOpened = !isOpened"
         :style="{'filter': searchOK === 3 ? 'grayscale(100%)' : searchOK === 1 ? 'saturate(100%)' : ''  }"
         :class="{blink_me : searchOK === 2 }"
         class="rounded-xl pl-3" >

      <v-row no-gutters v-if=" !$ObjectOperation.showOnlySearch || (searchOK === 1 || searchOK === 2 || searchOK === 0)" >
        <v-col :cols="pastebin ? 11 :9" :style="{ 'padding-left' : deepness*0.7+'rem' }" align-self="center"
        >

          <v-row no-gutters >
            <v-col align-self="center" cols="1" >
              <v-icon :color="!$ObjectOperation.isAVar(content) && arrayElem > -1 ?'primary' : getColor(content) ">
                {{ getIcon() }}
              </v-icon>
            </v-col>
            <v-col align-self="center" :cols="$ObjectOperation.isAVar(content) ? 3 : (pastebin ?11 :11)">
              <h5 style="color: grey;"
                  class="pl-3"
                  :class="{ 'rounded-l-xl' : $ObjectOperation.isAVar(content) ,  'rounded-xl' : !$ObjectOperation.isAVar(content) }"
                  :style="{ 'background-color': arrayElem>= 0?'rgba(76,255,255,0.18)':'rgba(76,255,0,0.18)'}"
              >{{ title }}</h5>
            </v-col>
            <v-col align-self="center" v-if="$ObjectOperation.isAVar(content)" :cols="8">
              <h5
                  class="pl-3 rounded-r-xl"
                  style=" text-align: center; overflow: hidden; background-color: rgba(255,0,0,0.18)">{{ content }}</h5>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="3" v-if="!pastebin">
          <v-row no-gutters>

            <v-col offset="1" cols="2" align="center">
              <v-btn v-if="arrayElem === -1 || $ObjectOperation.isAVar(content)" icon
                     @click.stop="$ObjectOperation.editing={
                          edit:{ key:title , value:content , type:getIconType() },
                          array:arrayElem,
                          type:getIconType(),
                          returnFunction:(x,y,z)=>{editElement(x,y,z) }
              }">
                <v-icon sm color="blue">mdi-pencil-outline</v-icon>
              </v-btn>
            </v-col>

            <v-col  cols="2" align="center">
              <v-btn v-if="!$ObjectOperation.isAVar(content)" icon
                     @click.stop="$ObjectOperation.editing={
                          edit:false,
                          array:arrayElem,
                          type:getIconType(),
                          returnFunction:(x,y,z)=>{addElement(x,y,z) }

              }">
                <v-icon color="green">mdi-plus</v-icon>

              </v-btn>
            </v-col>



            <v-col cols="2" align="center">
              <v-btn v-if="!$ObjectOperation.isAVar(content)" icon elevation="0" color="primary"
                     @click.stop="pasteHere()">
                <v-icon>mdi-content-paste</v-icon>
              </v-btn>
            </v-col>

            <v-col cols="2" align="center">
              <v-btn icon elevation="0" color="green" @click.stop="copyElem()">
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
            </v-col>


            <v-col cols="2" align="center">
              <v-btn v-if="deepness>0" icon @click.stop="askedDeleteElem()">
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
        <v-col v-else cols="1">
          <v-icon @click.stop="copyElem()" right color="blue">mdi-content-copy</v-icon>
        </v-col>
      </v-row>


    </div>

    <v-expand-transition>
      <div v-if="isOpened">
        <component v-if="$ObjectOperation.isAnObject(content) || $ObjectOperation.isAnArray(content)"
                   :is="$ObjectOperation.isAnObject(content) ?  'object-prop' : 'array-prop'"
                   :paste-bin="pastebin"
                   @reOpen="reOpen()"
                   :content="content"
                   :tittle="content"
                   :deepness="deepness+1"
                   :search-value="searchValue"
        />

      </div>
    </v-expand-transition>

  </div>
</template>

<script>

import Vue from "vue";

export default {
  name: "TitleBar",
  props: ['title', "content", "arrayElem", 'deepness', "deleteItem", "parent", "pastebin", "searchValue"],
  data: () => {
    return {
      isOpened: false,
      adding: false,
      editing: false,
      hover: false,
      search: null,
      searchOK: 0
    }
  },
  created() {
    if (this.deepness === 0)
      this.isOpened = true;

    this.search = this.searchValue;
    if (this.searchValue && this.searchValue.searching) {
      let titleInclude = this.title.toString().includes(this.searchValue.txt);
      let contentInclude = JSON.stringify(this.content).includes(this.searchValue.txt);

      if (contentInclude || titleInclude) {
        this.searchOK = 1;
        if (this.$ObjectOperation.isAVar(this.content) || (titleInclude && this.arrayElem === -1)) {
          this.searchOK = 2;

        }
        if (!(this.arrayElem !== -1 && !contentInclude))
          this.reOpen();
      } else
        this.searchOK = 3;
    } else {
      this.searchOK = 0;
    }

  },
  methods: {
    closeOverlay() {
      this.adding = false;
      this.editing = false;
    },
    openOverlay() {
      this.isOpened = true;
      this.adding = true;
    },
    getIcon() {
      if (this.isOpened) {
        switch (this.getIconType()) {
          case this.$constants.ELEM_TYPE_OBJ :
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
      this.$genericMethods.addAlert(
          {
            text:"element copied to pastebin" ,
            icon:"mdi-content-paste",
            color:"primary",
            type:"success"
          })
    },
    pasteHere() {
      if (!this.$ObjectOperation.pastebin)
        return;

      if (this.$ObjectOperation.isAnObject(this.content)) {
        let keyValue = this.$ObjectOperation.pastebin.title;
        while (this.content[keyValue])
          keyValue += '-copy';
        this.content[keyValue] = JSON.parse(JSON.stringify(this.$ObjectOperation.pastebin.value));
        this.$genericMethods.addAlert(
            {
              text:"element pasted" ,
              icon:"mdi-content-paste",
              color:"green",
              type:"success"
            })
        this.reOpen();
      } else if (this.$ObjectOperation.isAnArray(this.content)) {
        this.content.push(JSON.parse(JSON.stringify(this.$ObjectOperation.pastebin.value)));

        this.$genericMethods.addAlert(
            {
              text:"element pasted" ,
              icon:"mdi-content-paste",
              color:"green",
              type:"success"
            })

        this.reOpen();
      } else {
        console.error("can't paste here");
      }

    },
    askedDeleteElem() {
      this.deleteItem({title: this.title, value: this.content, index: this.arrayElem});
      this.$genericMethods.addAlert(
          {
            text:"element deleted" ,
            icon:"mdi-delete",
            color:"error",
            type:"error"
          })
    },
    reOpen() {
      this.$forceUpdate();
      this.isOpened = false;
      let me = this;
      setTimeout(() => {
        me.isOpened = true;
      }, 100)
    },
    addElement(key, value, type) {


      if (this.$ObjectOperation.isAnObject(this.content) && !key)
        return;

      if (this.$ObjectOperation.isAnObject(this.content)) {
        let keyValue = key;
        while (this.content[keyValue])
          keyValue += '-homo';

        if (type === 0) {
          this.content[keyValue] = {};
        } else if (type === 1) {
          this.content[keyValue] = [];
        } else {
          this.content[keyValue] = value;
        }
        this.reOpen();
      } else if (this.$ObjectOperation.isAnArray(this.content)) {
        if (type === 0)
          this.content.push({});
        else if (type === 1)
          this.content.push([]);
        else
          this.content.push(value);
      }
    },
    editElement(key, value, type) {

      if (this.$ObjectOperation.isAnObject(this.parent)) {
        if (type === 0 || type === 1) {
          let temp = this.parent[this.title];
          delete this.parent[this.title];
          this.parent[key] = temp
        } else {
          delete this.parent[this.title];
          this.parent[key] = value;
          this.content = value;
          this.title = key;
        }

      } else if (this.$ObjectOperation.isAnArray(this.parent)) {
        if (type === 2) {
          this.parent[key] = value;
          this.content = value;
        }
      } else {
        this.content = value;
      }

      this.title = key;
      this.closeOverlay();

    },


  }
}
</script>

<style>

.opened-div:before {
  content: "";
  position: absolute;
  top: 0;
  height: 100%;
  width: 1%; /* or 100px */
  border-bottom: 3px solid lightblue;
  border-top: 3px solid lightblue;
  border-left: 3px solid lightblue;
  border-radius: 2em 0 0 2em;
}

.blink_me {
  background-color: rgba(225, 188, 2, 0.2);
}

</style>
