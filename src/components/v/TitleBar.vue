<template>
  <div style="padding-left: 0.2em; " @mouseenter="hover=true" @mouseleave="hover=false">

    <div v-if="!$ObjectOperation.isAVar(content) && deepness !==0"
         style="position: absolute; height: 100%; width: 100%; top:0 ; left: 0;"
         :class="{'openedDiv' : isOpened }"></div>

    <div @click.stop="isOpened = !isOpened"
         :style="{'filter': searchOK === 3 ? 'grayscale(100%)' : searchOK === 1 ? 'saturate(100%)' : ''  }"
         :class="{blink_me : searchOK === 2 }"
         style="border-radius: 2em; padding-left: 1em"
    >


      <v-row no-gutters dense style="margin: 0 !important;">

        <v-col align-self="center" cols="1">
          <v-icon :color="!$ObjectOperation.isAVar(content) && arrayElem > -1 ?'primary' : getColor(content) ">
            {{ getIcon() }}
          </v-icon>
        </v-col>
        <v-col align-self="center" :cols="$ObjectOperation.isAVar(content) ? ( pastebin ? 4 :2) : (pastebin ?10 :8)">
          <h5 style="text-align: start; color: grey; padding-left: 1.5em"
              :style="{ 'background-color': arrayElem>= 0?'rgba(76,255,255,0.18)':'rgba(76,255,0,0.18)'}"
          >{{ title }}</h5>
        </v-col>
        <v-col align-self="center" v-if="$ObjectOperation.isAVar(content)" :cols="pastebin ? 6 :6">
          <h5 style=" text-align: center; overflow: hidden; background-color: rgba(255,0,0,0.18)">{{ content }}</h5>
        </v-col>

        <v-col cols="3" v-if="!pastebin">
          <v-row no-gutters>


            <v-col offset="1" cols="2" align="center">
              <v-btn v-if="!$ObjectOperation.isAVar(content)" icon @click.stop="openOverlay()">
                <v-icon color="green">mdi-plus</v-icon>

              </v-btn>
            </v-col>

            <v-col cols="2">
              <v-btn v-if="arrayElem === -1 || $ObjectOperation.isAVar(content)" icon @click.stop="editing=true">
                <v-icon sm color="blue">mdi-pencil</v-icon>
              </v-btn>
            </v-col>

<!--            todo: z-index pété !-->
            <element-adder :array="arrayElem"
                           :return-function="(x,y,z)=>{addElement(x,y,z)}" @closeOverlay="closeOverlay()"
                           v-if="adding"></element-adder>

            <element-adder
                :edit="{ key:title , value:content , type:getIconType() }"
                :array="arrayElem"
                :return-function="(x,y,z)=>{editElement(x,y,z)}" @closeOverlay="closeOverlay()"
                v-if="editing"></element-adder>

            <v-col cols="2" align="center">
              <v-btn v-if="!$ObjectOperation.isAVar(content)" icon elevation="0" color="green"
                     @click.stop="pasteHere()">
                <v-icon>mdi-content-paste</v-icon>
              </v-btn>
            </v-col>

            <v-col cols="2" align="center">
              <v-btn icon elevation="0" color="primary" @click.stop="copyElem()">
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

    <!--    <v-scale-transition>-->
    <div v-if="isOpened">
      <!--   if it is an object     -->
      <div v-if="$ObjectOperation.isAnObject(content)">
        <object-prop :paste-bin="pastebin" @reOpen="reOpen()" :content="content" :tittle="content"
                     :deepness="deepness+1" :search-value="searchValue"></object-prop>
      </div>
      <!--   if it is an array     -->
      <div v-else-if="$ObjectOperation.isAnArray(content)">
        <array-prop :paste-bin="pastebin" @reOpen="reOpen()" :content="content" :tittle="content" :deepness="deepness+1"
                    :search-value="searchValue"></array-prop>
      </div>
    </div>
    <!--    </v-scale-transition>-->

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

    // if (this.pastebin)
    //   this.isOpened = true;
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
            // if (this.arrayElem >= 0)
            //   return "mdi-arrow-down"
            // else
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
            // if (this.arrayElem >= 0)
            //   return "mdi-arrow-right"
            // else
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
      }, 50)
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


      // if (type === 0) {
      //   let temp = this.parent[this.title];
      //   console.log(temp);
      //   delete this.parent[this.title];
      //   this.parent[key] = temp
      // } else if (type === 1) {
      //   this.parent[key] = value
      // } else {
      //   if( this.$ObjectOperation.isAnObject(this.parent) )
      //   {
      //     delete this.parent[this.title];
      //     this.parent[key] = value;
      //   }
      //
      //   this.content = value;
      // }
      // this.title = key;
      //
      // this.closeOverlay();

      if (this.$ObjectOperation.isAnObject(this.parent)) {
        if (type === 0 || type === 1) {
          let temp = this.parent[this.title];
          console.log(temp);
          delete this.parent[this.title];
          this.parent[key] = temp
        } else {
          delete this.parent[this.title];
          this.parent[key] = value;
          this.content = value;
          this.title = key;
        }

      } else if (this.$ObjectOperation.isAnArray(this.parent)) {
        console.log(" key :  " + key + "  value : " + value + "  type = " + type);
        console.log(this.parent);
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

.blink_me {
  animation: blinker 2s linear infinite;
}

@keyframes blinker {
  50% {
    background-color: rgb(198, 80, 80, 0.1);
  }
}

</style>
