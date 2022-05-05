<template>
  <div :elevation="arrayElem || deepness ===0 ? 0 :10"
       style=" position:relative ;margin-left: 0.2em;
       margin-bottom: 0.2em; padding-left: 0.5em; padding-right: 0.5vw; padding-bottom: 0.5vh; overflow: hidden; "
  >

    <div  v-for="(item) in mainObject" :key="makeID()+item" style="position: relative ; margin : 0 0 0 2em">
        <title-bar
            :title="item[0]"
            :content="item[1]"
            :deepness="deepness+1"
            :delete-item="(x)=>{deleteThisItem(x)}"
            :array-elem="-1"
            :parent="content"
            :pastebin="pasteBin"
        ></title-bar>
<!--      :set-parent="(x)=>{ $ObjectOperation.isAnObject(item[1]) ? pasteHere(x,index) : ''}"-->
    </div>
  </div>
  <!--  </div>-->
</template>

<script>


import Vue from "vue";

export default {
  name: 'ObjectProp',
  props: ["content", "deepness", "tittle", "arrayElem", "deleteInParent", "updateInParent" , "pasteBin"],
  data: () => {
    return {
      mainObject: [],
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
      }
    },
    makeID() {
      this.$ObjectOperation.makeId(5)
    },
    deleteThisItem(item)
    {
      delete this.content[item.title]
      this.$emit('reOpen');
    }
  }
}
</script>

<style>



</style>
