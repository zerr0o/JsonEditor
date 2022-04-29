<template>
  <v-card elevation="0" style="margin-bottom: 0.5vh; padding-left: 10px; padding-right: 0.5vw; padding-bottom: 0.5vh"
          :color="$ObjectOperation.getColor(deepness,false,basecolor)">

    <v-row align="center" no-gutters>
      <v-col cols="9">
        <v-card-title v-if="!isAVar()">
          <v-btn v-if="!isAVar()" icon @click.stop="isOpened = !isOpened" :color="isOpened ? 'blue' : 'blue' "
                 style="padding-right: 1vw">
            <v-icon large> {{
                isOpened ? arrayElem ? 'mdi-arrow-down' : 'mdi-folder-open' : arrayElem ? 'mdi-arrow-right' : 'mdi-folder'
              }}
            </v-icon>
          </v-btn>
          <div :style="{ 'color' : arrayElem ? 'red' : 'black' }">
            {{ tittle }}
          </div>
        </v-card-title>
      </v-col>

      <v-col cols="1" align="center" v-show="!isAVar()">
        <v-icon>mdi-content-copy</v-icon>
      </v-col>
      <v-col  cols="1" align="center" v-show="!isAVar()">
        <v-icon>mdi-content-paste</v-icon>
      </v-col>
      <v-col  cols="1" align="center" v-show="!isAVar()">
        <v-icon>mdi-close</v-icon>
      </v-col>
    </v-row>

    <div v-if="isOpened || isAVar()">

      <!--   if it is an object     -->
      <div v-if="$ObjectOperation.isAnObject(content)">
        <ObjectProp v-for="(item) in mainObject" :key="makeID()+item" :content="item[1]" :tittle="item[0]"
                    :deepness="deepness+1" :basecolor="basecolor"></ObjectProp>
      </div>
      <!--   if it is an array     -->
      <div v-if="$ObjectOperation.isAnArray(content)">
        <ArrayProp :content="content" :deepness="deepness+1" :basecolor="basecolor"></ArrayProp>
      </div>
      <!--   if it is a var     -->
      <div v-if="!$ObjectOperation.isAnArray(content) && !$ObjectOperation.isAnObject(content)">
        <VarProp :tittle="tittle" :content="content" :deepness="deepness+1" :basecolor="basecolor">
        </VarProp>
      </div>

    </div>


  </v-card>
</template>

<script>
// import Vue from "vue";
import ArrayProp from "./ArrayProp";
import VarProp from "./VarProp";

export default {
  name: 'ObjectProp',
  props: ["content", "deepness", "tittle", "basecolor", "arrayElem"],
  components: {
    'VarProp': VarProp,
    'ArrayProp': ArrayProp
  },
  data: () => {
    return {
      mainObject: [],
      isOpened: false,
      hover:false
    }
  },
  created() {
    if (this.$ObjectOperation.isAnObject(this.content)) {
      this.mainObject = this.$ObjectOperation.iterateObj(this.content, this.deepness + 1, "")
    } else if (this.$ObjectOperation.isAnObject(this.content)) {
      this.mainObject = this.$ObjectOperation.isAnArray(this.content, this.deepness + 1, "")
    }
  },
  methods: {

    makeID() {
      this.$ObjectOperation.makeId(5)
    },
    isAVar() {
      return !this.$ObjectOperation.isAnArray(this.content) && !this.$ObjectOperation.isAnObject(this.content)
    },



  }
}
</script>

<style scoped>

</style>