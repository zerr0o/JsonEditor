<template>
  <v-container>
    <!--    <v-list flat rounded dense color="transparent">-->
    <!--      <v-list-item-group>-->
    <!--        <v-list-item  v-for="(item,index) in content" :key="$ObjectOperation.makeId(5)+index.toString()">-->
    <!--          <v-list-item-content >-->
    <!--   if it is an object     -->

    <div style="padding : 0; border: 3px solid lightsalmon; border-radius: 2em; overflow: hidden"
         v-for="(item,index) in content" :key="$ObjectOperation.makeId(5)+index.toString()">
      <div v-if="$ObjectOperation.isAnObject(item)">
        <object-prop :content="item" :tittle="index" :arrayElem="true" :deepness="deepness+1"
                     :basecolor="basecolor"></object-prop>
      </div>
      <!--   if it is an array     -->
      <div v-if="$ObjectOperation.isAnArray(item)">
        <code>salut toi</code>
        <array-prop :content="item" :tittle="index" :arrayElem="true" :deepness="deepness+1"
                    :basecolor="basecolor"></array-prop>
      </div>
      <!--   if it is a var     -->
      <div v-if="item && !$ObjectOperation.isAnArray(item) && !$ObjectOperation.isAnObject(item)">
        <var-prop :tittle="tittle" :content="item" :arrayElem="index" :deepness="deepness+1"
                  :basecolor="basecolor">{{ content }}
        </var-prop>
        <!--              <v-spacer v-if="index < content.length-1"-->
        <!--                        style="border: 1px solid black; margin: 1em 0 1em 0 "></v-spacer>-->
      </div>
    </div>
    <v-btn @click="pasteHere()">paste new input</v-btn>


    <!--          </v-list-item-content>-->
    <!--        </v-list-item>-->
    <!--      </v-list-item-group>-->
    <!--    </v-list>-->
<!--    <v-btn rounded color="primary">+add element</v-btn>-->
  </v-container>
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
      isOpened: false
    }
  },
  created() {
  },
  methods: {

    makeID() {
      this.$ObjectOperation.makeId(5)
    },
    test(value)
    {
      console.log(value);
    },
    copyElem()
    {
      this.$pastebin.type = this.$constants.ELEM_TYPE_ARRAY;
      this.$pastebin.elemTitle = this.tittle;
      this.$pastebin.elem = this.content;
    },
    pasteHere()
    {
      this.content.push(this.$pastebin.elem);
      console.log(this.content);
      //this.$forceUpdate();
    }


  }
}
</script>

<style scoped>

</style>