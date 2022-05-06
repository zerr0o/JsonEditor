export default {
    props: {
        content: {
            type: [Array,Object],
            default: null
        },
        deepness: {
            type: Number,
            default: 0
        },
        pasteBin: {
            type: [Object,Array,Boolean],
            default: null
        },
        searchValue: {
            type: Object,
            default: null
        }
    }
}
