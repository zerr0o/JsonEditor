<template>
  <v-overlay>
    <v-card style="min-width: 50vw;" class="rounded-xl pa-5">
      <v-row>
        <v-col cols="10">
          <v-card-title>{{ edit ? 'EDIT ELEMENT' : 'ADD ELEMENT' }}</v-card-title>
        </v-col>
        <v-col cols="2">
          <v-btn color="error" icon @click.stop="callClose()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-item-group>
        <v-container>
          <v-row v-if="!edit">
            <v-col v-for="(n , index) in elementType" :key="n" cols="12" md="4">
              <v-card :color="activeElem === index ? 'primary' : ''" class="d-flex align-center" dark height="50"
                      @click="activeElem=index">

                <div class="text-h7 flex-grow-1 text-center">
                  <v-icon left>{{ elementIcon[index] }}</v-icon>
                  {{ elementType[index] }}
                </div>

              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" v-if="activeElem===2">
              <v-item-group>
                <v-container>
                  <v-row>
                    <v-col v-for="(n , index) in varType" :key="n" cols="12" md="4">
                      <v-card :color="activeVarType === index ? 'primary' : ''" class="d-flex align-center" dark
                              height="50"
                              @click="activeVarType=index">
                        <div class="text-h7 flex-grow-1 text-center">
                          <v-icon left>{{ varTypeIcon[index] }}</v-icon>
                          {{ varType[index] }}
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-container>
              </v-item-group>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="10">
              <v-row v-if="!(array && !edit)">
                <v-col cols="1" align-self="center">
                  <v-btn v-if="edit" icon outlined @click="disabled = !disabled" :color="disabled ? 'red': 'green'">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="9">
                  <v-text-field :disabled="edit && disabled" autofocus v-model="name"
                                :label="elementType[activeElem]+' name'"></v-text-field>
                </v-col>
                <v-col cols="1" align-self="center">
                  <v-btn color="primary" icon @click="copyToClipBoard(name)">
                    <v-icon>mdi-content-copy</v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="1" align-self="center">
                  <v-btn color="primary" icon disabled>
                    <v-icon>mdi-magnify</v-icon>
                  </v-btn>
                </v-col>


              </v-row>
              <v-row v-if="activeElem===2">
                <v-col offset="1" cols="9">
                  <v-text-field v-if="activeVarType === 1 || activeVarType === 0" :type="activeVarType ===1 ? 'number' : ''" v-model="filedValue"  label="variable value"></v-text-field>
                  <v-row v-else>

                    <v-col>
                      <v-btn block @click="trueFalseVar= true" :color="trueFalseVar ? 'primary' : ''">
                        <v-icon>
                          mdi-check
                        </v-icon>
                        true</v-btn>
                    </v-col>
                    <v-col>
                      <v-btn block @click="trueFalseVar = false" :color="!trueFalseVar ? 'primary' : ''">
                        <v-icon>mdi-close</v-icon>
                        false</v-btn>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="1" align-self="center">
                  <v-btn color="primary" icon @click="copyToClipBoard(filedValue)">
                    <v-icon>mdi-content-copy</v-icon>
                  </v-btn>
                  <template>
                    <v-tooltip v-model="copied" close-delay="10">
                      <v-card>
                        <v-card-title>copied</v-card-title>
                        <v-card-text>{{ filedValue }}</v-card-text>
                      </v-card>
                    </v-tooltip>
                  </template>

                </v-col>
                <v-col cols="1" align-self="center">
                  <v-btn color="primary" icon disabled>
                    <v-icon>mdi-magnify</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="2">
              <v-btn height="100%" block :disabled="activeElem===-1" color="primary" @click.stop="addElem()">
                <v-icon>{{ edit ? 'mdi-check-bold' : 'mdi-plus' }}</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-item-group>
    </v-card>
  </v-overlay>
</template>

<script>
export default {
  name: "ElementAdder",
  props: ['returnFunction', 'array', 'edit', 'type'],
  data: () => {
    return {
      elementType: ['object', 'array', 'variable'],
      varType: ['string', 'number', 'boolean'],
      elementIcon: ['mdi-folder', 'mdi-application-array', 'mdi-help-circle-outline'],
      varTypeIcon: ['mdi-code-string', 'mdi-numeric', 'mdi-check'],
      activeElem: 0,
      activeVarType: 0,
      trueFalseVar: true,
      name: '',
      filedValue: null,
      disabled: true,
      copied: false
    }
  },
  created() {
    if (this.edit) {
      this.activeElem = this.edit.type === this.$constants.ELEM_TYPE_OBJ ? 0 : this.edit.type === this.$constants.ELEM_TYPE_ARRAY ? 1 : 2;
      this.name = this.edit.key
      if( this.edit.type === this.$constants.ELEM_TYPE_VAR )
      {
        if( typeof(this.edit.value) === 'boolean' )
        {
          this.activeVarType = 2;
          this.trueFalseVar = this.edit.value;
          this.filedValue = this.edit.value;

        } else
        if( typeof(this.edit.value) === 'number' )
        {
          this.activeVarType = 1;
          this.filedValue = this.edit.value;
        }
        else
        {
          this.activeVarType = 0;
          this.filedValue = this.edit.value;
        }
      }



    }

  },
  methods:
      {
        addElem() {
          this.returnFunction(
              this.name,
              this.activeVarType === 2 ? this.trueFalseVar : this.filedValue,
              this.activeElem
          );
          this.$genericMethods.addAlert(
              {
                text: this.edit ? "element edited" : "element added",
                icon: "mdi-plus",
                color: "green",
                type: "success"
              })
          if (this.edit)
            this.callClose();
        },
        callClose() {
          this.$ObjectOperation.editing = null;
        },
        copyToClipBoard(text) {
          let me = this;
          navigator.clipboard.writeText(text).then(function () {
            console.log('Async: Copying to clipboard was successful : ' + text);
            me.$genericMethods.addAlert(
                {
                  text: "copied : " + text,
                  icon: "mdi-content-copy",
                  color: "primary",
                  type: "success"

                }
            );
          }, function (err) {
            console.error('Async: Could not copy text: ', err);
          });
        }
      }

}
</script>

<style scoped>

</style>
