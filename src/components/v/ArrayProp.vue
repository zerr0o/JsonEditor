<template>
  <v-container>
    <v-list rounded dense color="transparent">
      <v-list-item-group>
        <v-list-item v-for="(item,index) in content" :key="$ObjectOperation.makeId(5)+index.toString()">
          <v-list-item-content style="padding : 0">
            <!--   if it is an object     -->
            <div v-if="$ObjectOperation.isAnObject(item)">
              <ObjectProp :content="item" :tittle="index" :arrayElem="true" :deepness="deepness+1"
                          :basecolor="basecolor"></ObjectProp>
            </div>
            <!--   if it is an array     -->
            <div v-if="$ObjectOperation.isAnArray(item)">
              <code>salut toi</code>
              <ArrayProp :content="item" :tittle="index" :arrayElem="true" :deepness="deepness+1"
                         :basecolor="basecolor"></ArrayProp>
            </div>
            <!--   if it is a var     -->
            <div v-if="item && !$ObjectOperation.isAnArray(item) && !$ObjectOperation.isAnObject(item)">
              <VarProp :tittle="tittle" :content="item" :arrayElem="index" :deepness="deepness+1"
                       :basecolor="basecolor">{{ content }}
              </VarProp>
              <v-spacer v-if="index < content.length-1"
                        style="border: 1px solid black; margin: 1em 0 1em 0 "></v-spacer>
            </div>

          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <v-btn rounded color="primary">+add element</v-btn>
  </v-container>
</template>

<script>
// import Vue from "vue";


import VarProp from "./VarProp";
import ObjectProp from "./ObjectProp";

export default {
  name: 'ArrayProp',
  props: ["content", "deepness", "tittle", "basecolor"],
  components: {
    'ObjectProp': ObjectProp,
    'VarProp': VarProp
  },
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
    }

  }
}
</script>

<style scoped>

</style>