<template>
  <v-row  align="center">
    <v-col v-if="arrayElem > -1" cols="1" align="center">
      <h4>{{ arrayElem }}</h4>
    </v-col>
<!--    <v-col cols="1" align="center">-->
<!--      <v-icon>{{ getIconAndType(content) }}</v-icon>-->
<!--    </v-col>-->
<!--    <v-col v-if="tittle" cols="3">-->
<!--      <v-card-title>{{ tittle ? tittle : "empty"}}</v-card-title>-->
<!--    </v-col>-->
    <v-col :cols="tittle ? 6 : 8">
      <v-list-item-title style="text-align: right ; padding-right: 0.3em">{{ content }}</v-list-item-title>
    </v-col>
<!--    <v-col cols="1" align="center">-->
<!--      <v-btn icon>-->
<!--        <v-icon>mdi-content-copy</v-icon>-->
<!--      </v-btn>-->
<!--    </v-col>-->
<!--    <v-col cols="1" align="center">-->
<!--      <v-btn icon>-->
<!--        <v-icon color="red">mdi-delete</v-icon>-->
<!--      </v-btn>-->
<!--    </v-col>-->
  </v-row>

</template>

<script>

export default {
  name: 'VarProp',
  props: ["content", "deepness", "tittle", "basecolor", "arrayElem"],
  data: () => {
    return {
      contentType: '',
      hover:false
    }
  },
  created() {
  },
  methods: {

    getIconAndType(value) {
      if (!value) {
        this.contentType = "none"
        return "mdi-help-circle-outline";
      }

      let stringValue = value.toString();
      switch (true) {
        case stringValue.includes(".mp4") || stringValue.includes(".MP4"):
          this.contentType = "video"
          return "mdi-youtube";
        case stringValue.includes(".jpg") || stringValue.includes(".JPG") || stringValue.includes(".png") || stringValue.includes(".PNG"):
          this.contentType = "image"
          return "mdi-file-image";
        case !isNaN(parseInt(stringValue)):
          this.contentType = "integer"
          return "mdi-numeric";
        case stringValue === "true" || stringValue === "false":
          this.contentType = "boolean"
          return stringValue === "true" ? "mdi-checkbox-outline" : "mdi-checkbox-blank-outline";
        default :
          this.contentType = "none"
          return "mdi-alphabetical-variant";

      }

    }

  }
}
</script>

<style scoped>

</style>
