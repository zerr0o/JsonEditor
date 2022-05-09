<template>
  <div>
    <title-bar v-for="(item,index) in content" :key="$ObjectOperation.makeId(5)+index.toString()"
               :title="index"
               :content="item"
               :array-elem="index"
               :deepness="deepness"
               :delete-item="(x)=>deleteThisItem(x)"
               :parent="content"
               :pastebin="pasteBin"
               :search-value="search"
    ></title-bar>
  </div>
</template>

<script>
import propMixin from "@/components/v/mixin/PropMixin";

export default {
  name: 'ArrayProp',
  mixins:[propMixin],
  data: () => {
    return {
      search: null
    }
  },
  created() {

    this.search = this.searchValue;

  },
  methods: {

    makeID() {
      this.$ObjectOperation.makeId(5)
    },
    deleteThisItem(item) {
      this.content.splice(item.index, 1);
      this.$emit('reOpen');
    }


  }
}
</script>

<style scoped>

</style>
