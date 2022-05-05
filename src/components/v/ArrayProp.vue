<template>
  <div style="margin : 0 0 0 2em" >
<!--    :style="{'background-color': search ? 'red' : 'yellow'}"-->
    <div v-for="(item,index) in content" :key="$ObjectOperation.makeId(5)+index.toString()" style="position: relative">

      <title-bar
          :title="index"
          :content="item"
          :array-elem="index"
          :deepness="deepness+1"
          :delete-item="(x)=>deleteThisItem(x)"
          :parent="content"
          :pastebin="pasteBin"
          :search-value="search"
      ></title-bar>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArrayProp',
  props: ["content", "deepness", "tittle" , "pasteBin" , "searchValue"],
  data: () => {
    return {
      search:null
    }
  },
  created() {

      this.search = this.searchValue;

  },
  methods: {

    makeID() {
      this.$ObjectOperation.makeId(5)
    },
    deleteThisItem(item)
    {
      console.log("deleting index : " + item.index);
      this.content.splice(item.index , 1);
      this.$emit('reOpen');
    }



  }
}
</script>

<style scoped>

</style>
