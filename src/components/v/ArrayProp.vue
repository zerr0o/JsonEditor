<template>
  <div style="margin : 0 0 0 2em">

    <!--   if it is an object     -->
    <div v-for="(item,index) in content" :key="$ObjectOperation.makeId(5)+index.toString()" style="position: relative">

      <div v-if="!$ObjectOperation.isAVar(item)" style="position: absolute; height: 100%; width: 100%; top:0 ; left: 0;"
           :class="{'openedDiv' : isOpened[index] }" ></div>

      <div @click="openElem(index)">
<!--        :style="{'background-color': $ObjectOperation.isAnObject(item)? 'red' : $ObjectOperation.isAnArray(item) ? 'yellow' : 'yellowgreen' }"-->
        <title-bar

            @click="isOpened[index]=!isOpened[index]"
            :title="index"
            :icon="getIconType(item)"
            :actions="getAction(true , true ,true)"
            :opened="isOpened[index]"
            :content="$ObjectOperation.isAVar(item)? item : ''"
            :arrayElem="true"
        ></title-bar>
      </div>

      <div v-if="isOpened[index]">
        <!--   if it is an object     -->
        <div v-if="$ObjectOperation.isAnObject(item)">
          <object-prop v-if="isOpened[index]" :content="item" :tittle="index"
                       :deepness="deepness+1" :basecolor="basecolor"
                       :deleteInParent="(x)=>{deleteFromChild(x)}"
          ></object-prop>
        </div>
        <!--   if it is an array     -->
        <div v-else-if="$ObjectOperation.isAnArray(item)">
          <array-prop v-if="isOpened[index]" :content="item" :tittle="index" :deepness="deepness+1"
                      :basecolor="basecolor"></array-prop>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
// import Vue from "vue";


import VarProp from "./VarProp";
import ObjectProp from "./ObjectProp";

export default {
  name: 'ArrayProp',
  props: ["content", "deepness", "tittle", "basecolor"],
  data: () => {
    return {
      mainObject: [],
      isOpened: []
    }
  },
  created() {
    for (let i = 0; i < this.content.length; i++) {
      this.isOpened.push(false);
    }
  },
  methods: {

    makeID() {
      this.$ObjectOperation.makeId(5)
    },
    test(value) {
      console.log(value);
    },
    copyElem() {
      this.$pastebin.type = this.$constants.ELEM_TYPE_ARRAY;
      this.$pastebin.elemTitle = this.tittle;
      this.$pastebin.elem = this.content;
    },
    pasteHere() {
      this.content.push(this.$pastebin.elem);
      console.log(this.content);
      //this.$forceUpdate();
    },
    getAction(paste, copy, del) {
      return this.$ObjectOperation.GetActions(paste, copy, del);
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
    openElem(index) {
      this.isOpened[index] = !this.isOpened[index];
      this.$forceUpdate();
    }


  }
}
</script>

<style scoped>

</style>
