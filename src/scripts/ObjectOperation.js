import Vue from "vue";

export default class ObjectOperation {

    constructor() {

    }

    pastebin = null;
    editing = null;
    showOnlySearch = false;

    /**
     * Browse through object
     * @param obj
     * @param child
     * @param parent
     */
    iterateObj(obj , child , parent) {
        let separator = this.createDebugSeparator(child);
        let currentObjet = [];
        for (let key in obj) {
            let value = obj[key];
            currentObjet.push([key,value,child]);
        }
        return currentObjet;
    }

     isAnObject(elem)
    {
        let isObj = typeof elem === 'object' &&
        !Array.isArray(elem) &&
        elem !== null;
        if( isObj )
        {
            return true;
        }
        return false;
    }

    isAnArray(elem)
    {
        return Array.isArray(elem);
    }

    isAVar(elem)
    {
        return (!this.isAnArray(elem) && !this.isAnObject(elem));
    }




    /**
     * return --- for debug
     * @param child
     * @returns {string}
     */
    createDebugSeparator(child)
    {
        let separator = ""
        for( let i=0 ; i<child ; i++ )
        {
            separator += "-"
        }
        separator += " ";
        return separator;
    }


    /**
     * Generate random id
     * @param length
     * @returns {string}
     */
    makeId(length) {
        let result           = '';
        let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }



    /**
     * return rndom base on a seed
     * @param a
     * @returns {function()}
     * @constructor
     */
    RandomWithSeed(a) {
        let t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;

    }

    /**
     * get button actions
     * @returns {[{enable: boolean, fAction: fAction},{enable: boolean, fAction: fAction},{enable: boolean, fAction: fAction}]}
     * @constructor
     */
    GetActions( paste , copy , del , parent , elem )
    {

        return [
            {

                fAction: () => {
                    if( this.isAnArray(elem.value) )
                    {
                        elem.value.push( JSON.parse(JSON.stringify(this.pastebin.value)) );
                        console.log("pushing " + elem.value);
                        return elem.value;
                    }
                    else if( this.isAnObject(elem.value) )
                    {
                        console.log("putting " + elem.value);
                        return this.pastebin;
                    }else
                    {
                        console.error('cant paste in a variable');
                    }
                },
                enable: paste
            },
            {
                fAction: () => {
                    console.log(parent);
                    console.log(elem);
                    this.pastebin = elem;
                },
                enable: copy
            },
            {
                fAction: () => {
                    delete parent[elem];
                    return parent
                },
                enable: del
            }
        ]
    }

}
