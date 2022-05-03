<template>
  <div :elevation="arrayElem || deepness ===0 ? 0 :10"
       style=" position:relative ;margin-left: 0.2em;
       margin-bottom: 0.2em; padding-left: 0.5em; padding-right: 0.5vw; padding-bottom: 0.5vh; overflow: hidden; border-radius: 2em"
       :style="{ 'background-color' : deepness ===0 ? 'transparent' : $ObjectOperation.getColor(deepness,false,basecolor) }"
  >
    <div @click=" !isAVar() && deepness !==0 ? isOpened = !isOpened : ''" style="position: absolute; height: 100%; width: 100%; top:0 ; left: 0;"
         :class="{'openedDiv' : deepness !==0 && isOpened && !arrayElem}"></div>
    <v-row align="center" no-gutters>
      <v-col :cols=" isAVar() ? 8 : 6">
        <v-card-title v-if="!isAVar()" >
          <v-btn v-if="!isAVar() && deepness !==0" icon @click.stop="isOpened = !isOpened" :color="isOpened ? 'blue' : 'blue' "
                 style="padding-right: 1vw">
            <v-icon large>  {{
                isOpened ? $ObjectOperation.isAnArray(content)? 'mdi-application-array-outline' : ( arrayElem ? 'mdi-arrow-down' : 'mdi-folder-open' ) : $ObjectOperation.isAnArray(content)? 'mdi-application-array' :(arrayElem ? 'mdi-arrow-right' : 'mdi-folder')
              }}
            </v-icon>
          </v-btn>
          <div :style="{ 'color' : arrayElem ? 'lightsalmon' : '#1976D2' }">
            {{ tittle }}
          </div>
        </v-card-title>
      </v-col>

      <v-col v-if="!isAVar()" cols="2" align="center" >
        <v-btn elevation="0" color="green"  :disabled="$pastebin.type === null" @click="pasteHere()" >
          paste in<v-icon right>mdi-content-paste</v-icon>
        </v-btn>
      </v-col>

      <v-col cols="2" align="center" >
        <v-btn elevation="0" color="primary"  @click="copyElem()">
          copy<v-icon right>mdi-content-copy</v-icon>
        </v-btn>
      </v-col>

      <v-col v-if="deepness !== 0" cols="1" align="center" >
        <v-btn @click="deleteElem()" >
          delete<v-icon right color="red">mdi-delete</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <div v-if="isOpened || isAVar()">

      <!--   if it is an object     -->
      <div v-if="$ObjectOperation.isAnObject(content)">
        <object-prop v-for="(item) in mainObject" :key="makeID()+item" :content="item[1]" :tittle="item[0]"
                     :deepness="deepness+1" :basecolor="basecolor"
                     :deleteInParent="(x)=>{deleteFromChild(x)}"
                     :updateInParent="()=>{updateAll()}"
        ></object-prop>
      </div>
      <!--   if it is an array     -->
      <div v-if="$ObjectOperation.isAnArray(content)">
        <array-prop :content="content" :deepness="deepness+1" :basecolor="basecolor"></array-prop>
      </div>
      <!--   if it is a var     -->
      <div v-if="!$ObjectOperation.isAnArray(content) && !$ObjectOperation.isAnObject(content)">
        <var-prop :tittle="tittle" :content="content" :deepness="deepness+1" :basecolor="basecolor">
        </var-prop>
      </div>

    </div>


  </div>
</template>

<script>
import Vue from "vue";

export default {
  name: 'ObjectProp',
  props: ["content", "deepness", "tittle", "basecolor", "arrayElem","deleteInParent","updateInParent"],
  data: () => {
    return {
      mainObject: [],
      isOpened: false,
      hover: false
    }
  },
  created() {
    this.init();
    if (this.deepness === 0) {
      this.isOpened = true;
    }
  },
  methods: {

    init()
    {
      if (this.$ObjectOperation.isAnObject(this.content)) {
        this.mainObject = this.$ObjectOperation.iterateObj(this.content, this.deepness + 1, "")
      } else if (this.$ObjectOperation.isAnObject(this.content)) {
        this.mainObject = this.$ObjectOperation.isAnArray(this.content, this.deepness + 1, "")
      }
    },
    makeID() {
      this.$ObjectOperation.makeId(5)
    },
    isAVar() {
      return !this.$ObjectOperation.isAnArray(this.content) && !this.$ObjectOperation.isAnObject(this.content)
    },
    copyElem()
    {
      Vue.prototype.$pastebin.type = this.$constants.ELEM_TYPE_OBJ;
      Vue.prototype.$pastebin.elemTitle = this.tittle;
      Vue.prototype.$pastebin.elem = JSON.parse(JSON.stringify(this.content));
      this.$forceUpdate();
    },
    pasteHere()
    {
      if( !Vue.prototype.$pastebin.elemTitle )
        return;

      let keyValue = Vue.prototype.$pastebin.elemTitle.toString();
      while( this.content[keyValue] )
        keyValue+='-copy';
      this.content[keyValue] = JSON.parse(JSON.stringify(Vue.prototype.$pastebin.elem)) ;

      console.log(this.content);
      this.init();
      this.$forceUpdate();

    },
    deleteElem()
    {
      console.log("trying to delete " +this.tittle);
      this.deleteInParent(this.tittle);
    },
    deleteFromChild(keyValue)
    {
      console.log("deleting " + keyValue);
      delete this.content[keyValue];
      this.init();
      this.$forceUpdate();
    }

  }
}
</script>

<style scoped>

.openedDiv:before {
  content : "";
  position: absolute;
  left    : 0;
  top  : 0;
  height  : 100%;
  width   : 5%;  /* or 100px */
  border-bottom:3px solid lightblue;
  border-top:3px solid lightblue;
  border-left:3px solid lightblue;
  border-radius: 2em 0 0 2em;
}

</style>
