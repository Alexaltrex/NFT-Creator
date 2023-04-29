import {action, makeObservable, observable} from "mobx";

export class AppStore {
    showAccountPopup: boolean = false

    constructor() {
        makeObservable(this, {
            showAccountPopup: observable,

            setShowAccountPopup: action.bound,
        })
    }

    setShowAccountPopup(showAccountPopup: boolean) {
        this.showAccountPopup = showAccountPopup;
    }

}
