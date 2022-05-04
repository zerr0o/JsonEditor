<template>
  <div :elevation="arrayElem || deepness ===0 ? 0 :10"
       style=" position:relative ;margin-left: 0.2em;
       margin-bottom: 0.2em; padding-left: 0.5em; padding-right: 0.5vw; padding-bottom: 0.5vh; overflow: hidden; border-radius: 2em"
       :style="{ 'background-color' : deepness ===0 ? 'transparent' : $ObjectOperation.getColor(deepness,false,basecolor) }"
  >
    <div  v-for="(item,index) in mainObject" :key="makeID()+item" style="position: relative ; margin : 0 0 0 2em">

      <div v-if="!checkIsAVar(item[1])"  style="position: absolute; height: 100%; width: 100%; top:0 ; left: 0;"
           :class="{'openedDiv' : isOpened[index] && !arrayElem}" ></div>

      <div @click="openElem(index)">
        <!--        :style="{'background-color': $ObjectOperation.isAnObject(item[1])? 'red' : $ObjectOperation.isAnArray(item[1]) ? 'yellow' : 'yellowgreen' }"-->
        <title-bar
            style="border: 10px solid red"
            :title="'titlebar object de '+item[0]"
            :icon="getIconType(item[1])"
            :actions="getAction(true , true ,true , content ,  { title : item[0] , value : item[1] } )"
            :opened="isOpened[index]"
            :content="checkIsAVar(item[1])? item[1] : null"
            :set-parent="(x)=>{ $ObjectOperation.isAnObject(item[1]) ? pasteHere(x,index) : ''}"
        ></title-bar>
      </div>


      <div v-if="isOpened[index]">

        <!--   if it is an object     -->
        <div v-if="$ObjectOperation.isAnObject(item[1])">
          <object-prop :content="item[1]" :tittle="item[0]"
                       :deepness="deepness+1" :basecolor="basecolor"
                       :deleteInParent="(x)=>{deleteFromChild(x)}"
          ></object-prop>
        </div>
        <!--   if it is an array     -->
        <div v-else-if="$ObjectOperation.isAnArray(item[1])">
          <array-prop :content="item[1]" :tittle="item[0]" :deepness="deepness+1"
                      :basecolor="basecolor"></array-prop>
        </div>

      </div>

    </div>
  </div>


  <!--  </div>-->
</template>

<script>
import Vue from "vue";

export default {
  name: 'ObjectProp',
  props: ["content", "deepness", "tittle", "basecolor", "arrayElem", "deleteInParent", "updateInParent"],
  data: () => {
    return {
      mainObject: [],
      isOpened: ['false'],
      hover: false,
      type: "ELEM_TYPE_UNKNOWN"
    }
  },
  created() {
    this.init();
  },
  methods: {

    init() {
      if (this.$ObjectOperation.isAnObject(this.content)) {
        this.mainObject = this.$ObjectOperation.iterateObj(this.content, this.deepness + 1, "")
        for (let i = 0; i < this.mainObject.length; i++) {
          this.isOpened.push(false)
        }
      }
      // else if (this.$ObjectOperation.isAnObject(this.content)) {
      //   this.mainObject = this.$ObjectOperation.isAnArray(this.content, this.deepness + 1, "")
      //   for (let i = 0; i < this.mainObject.length; i++) {
      //     this.isOpened.push(true)
      //   }
      // }
    },
    makeID() {
      this.$ObjectOperation.makeId(5)
    },
    isAVar() {
      return !this.$ObjectOperation.isAnArray(this.content) && !this.$ObjectOperation.isAnObject(this.content)
    },
    checkIsAVar(elem) {
      return !this.$ObjectOperation.isAnArray(elem) && !this.$ObjectOperation.isAnObject(elem)
    },
    pasteHere(elem , index) {
      if (!elem)
        return;
      let keyValue = elem.title ? elem.title.toString() : 'TAMERELATCHOIN';
      while (this.content[this.mainObject[index][0]][keyValue])
        keyValue += '-copy';
      console.log(JSON.stringify(elem));
      this.content[this.mainObject[index][0]][keyValue] = JSON.parse(JSON.stringify(elem.value));
      this.init();
      this.$forceUpdate();

    },
    deleteElem() {
      console.log("trying to delete " + this.tittle);
      this.deleteInParent(this.tittle);
    },
    deleteFromChild(keyValue) {
      console.log("deleting " + keyValue);
      delete this.content[keyValue];
      this.init();
      this.$forceUpdate();
    },
    getIconType(elem) {
      switch (true) {
        case this.$ObjectOperation.isAnObject(elem):
          return this.$constants.ELEM_TYPE_OBJ;
        case this.$ObjectOperation.isAnArray(elem):
          return this.$constants.ELEM_TYPE_ARRAY;
        default:
          return this.$constants.ELEM_TYPE_VAR;
      }
    },
    getAction(paste, copy, del , parent , elem) {
      return this.$ObjectOperation.GetActions(paste, copy, del , parent , elem);
    },
    openElem(index) {
      this.isOpened[index] = !this.isOpened[index];
      this.$forceUpdate();
    }

  }
}
</script>

<style>

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
