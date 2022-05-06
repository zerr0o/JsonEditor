<template>
  <div>
      <title-bar v-for="(item) in mainObject" :key="makeID()+item"
          :title="item[0]"
          :content="item[1]"
          :deepness="deepness"
          :delete-item="(x)=>{deleteThisItem(x)}"
          :array-elem="-1"
          :parent="content"
          :pastebin="pasteBin"
          :search-value="search"
      ></title-bar>
  </div>
</template>

<script>


import Vue from "vue";

import propMixin from "@/components/v/mixin/PropMixin";

export default {
  name: 'ObjectProp',
  mixins:[propMixin],
  data: () => {
    return {
      mainObject: [],
      hover: false,
      type: "ELEM_TYPE_UNKNOWN",
      search: null
    }
  },
  created() {
    this.init();
    this.search = this.searchValue;
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
    deleteThisItem(item) {
      delete this.content[item.title]
      this.$emit('reOpen');
    }
  }
}
</script>

<style>


</style>
