export default class GenericMethods {


    constructor() {
        this.test();
    }

    alerts = [];

    test() {
        console.log("%c GenericMethods test ok!", 'background: #bada55; color: #222')
    }


    addAlert(alert) {
        this.alerts.unshift(alert);
        setTimeout(
            () => {
                this.alerts.pop();
            }, 4000
        )
    }


}
