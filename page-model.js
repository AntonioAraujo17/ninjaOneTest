import { Selector, t } from "testcafe"

class Page{
    constructor(){

        //Home Page
        this.deviceList = Selector('div.list-devices-main > div > div')
        this.deviceName = 'span.device-name'
        this.deviceType = 'span.device-type'
        this.deviceCap = 'span.device-capacity'
        this.edit = 'a.device-edit'
        this.removeBtn = 'button.device-remove'
        this.systemName = '#system_name'
        this.changeButton = 'a.changebutton'

    }

    // T1
    async assertDeviceComponents(curDeviceName, 
        curDeviceType, 
        curDeviceCapacity, 
        curEditLink, 
        curRemoveButton){
        await t
                .expect(curDeviceName.visible).ok()
                .expect(curDeviceType.visible).ok()
                .expect(curDeviceCapacity.visible).ok()
                .expect(curEditLink.visible).ok()
                .expect(curRemoveButton.visible).ok()
    }

    // T2

    async createsNewDevice(inputSystemName,
        inputType, 
        inputCapacity){

        const typeSelection = Selector("#type")
        const typeOption = typeSelection.find('option')

        await t
            .click('a.submitButton')
            .typeText(this.systemName, inputSystemName)
            .click(typeSelection)
            .click(typeOption.withText(inputType))
            .typeText('#hdd_capacity', inputCapacity)
            .click(this.changeButton)
    }

    async assertNewCreatedDevice(deviceComponent, deviceGivenName){
        await t    
            .expect(Selector(deviceComponent).withText(deviceGivenName).exists).ok()
            .expect(Selector(deviceComponent).withText(deviceGivenName).visible).ok()
    }

    // T3
    async editDeviceName(newName){
        await t 
            .click(this.deviceList.nth(0).find(this.edit))
            .typeText(this.systemName, newName, {replace: true})
            .click(this.changeButton)
    }

    async getFirstDeviceName(){
        return Selector(this.deviceList).nth(0).find(this.deviceName).innerText
    }

    async assertDeviceNameEdited(newName, oldName){
        await t    
            .expect(await this.getFirstDeviceName()).eql(newName)
            .expect(Selector(this.deviceName).withText(oldName).exists).notOk()
    }

    // T4
    async deleteLastDevice(lastDeviceName){
        await t
            .expect(Selector(this.deviceName).withText(lastDeviceName).exists).ok()
            .click(this.deviceList.nth(-1).find(this.removeBtn))
    }

    async assertLastDeviceDeleted(lastDeviceName){
        await t
            .expect(Selector(this.deviceName).withText(lastDeviceName).visible).notOk()
            .expect(Selector(this.deviceName).withText(lastDeviceName).exists).notOk()
    }

}

export default new Page()