const { Selector } = require("testcafe")
var randomstring = require("randomstring");

fixture('Ninja One Challenge')
    .page("http://localhost:3000")

    const locatorDevices = 'div.list-devices-main > div > div'
    const locatorDeviceName = 'span.device-name' 
    const locatorDeviceType = 'span.device-type'
    const locatorDeviceCap = 'span.device-capacity'
    const locatorEdit = 'a.device-edit'
    const locatorRemoveBtn = 'button.device-remove'
    const locatorSystemName = '#system_name'
    const locatorChangeButton = 'a.changebutton'

    const listDevices = Selector(locatorDevices)

    test('Test 1 - Verify all displayed devices', async t =>{

        var currentElem = null
        var deviceName = null
        var deviceType = null
        var deviceCapacity = null
        var editLink = null
        var removeButton = null
        const totalDevices = await listDevices.count

        var i = 0;
        while (i < totalDevices) {
            currentElem = Selector(listDevices.nth(i))

            await t.expect(currentElem.exists).ok()
            
            deviceName = currentElem.find(locatorDeviceName)
            deviceType = currentElem.find(locatorDeviceType)
            deviceCapacity = currentElem.find(locatorDeviceCap)
            editLink = currentElem.find(locatorEdit)
            removeButton = currentElem.find(locatorRemoveBtn)

            //asserts
            await t
                .expect(deviceName.visible).ok()
                .expect(deviceType.visible).ok()
                .expect(deviceCapacity.visible).ok()
                .expect(editLink.visible).ok()
                .expect(removeButton.visible).ok()
            i+=1
        }

    })

    test('Test 2 - Create device', async t =>{

        const typeSelection = Selector("#type")
        const typeOption = typeSelection.find('option')
        const inputSystemName = 'Antonio MAC'
        const inputType = 'MAC'
        const inputCapacity = '100'

        await t
            .click('a.submitButton')
            .typeText(locatorSystemName, inputSystemName)
            .click(typeSelection)
            .click(typeOption.withText(inputType))
            .typeText('#hdd_capacity', inputCapacity)
            .click(locatorChangeButton)
        
        await t    
            //asserts
            .expect(Selector(locatorDeviceName).withText(inputSystemName).exists).ok()
            .expect(Selector(locatorDeviceName).withText(inputSystemName).visible).ok()

            .expect(Selector(locatorDeviceType).withText(inputType).exists).ok()
            .expect(Selector(locatorDeviceType).withText(inputType).visible).ok()

            .expect(Selector(locatorDeviceCap).withText(inputCapacity).exists).ok()
            .expect(Selector(locatorDeviceCap).withText(inputCapacity).visible).ok()

    })

    test('Test 3 - Rename device', async t =>{
        const firstDevice = Selector(listDevices).nth(0).find(locatorDeviceName)
        const oldName = await firstDevice.innerText
        const newName = randomstring.generate(6)

        await t 
            .click(listDevices.nth(0).find(locatorEdit))
            .typeText(locatorSystemName, newName, {replace: true})
            .click(locatorChangeButton)

            //asserts
        await t    
            .expect(firstDevice.innerText).eql(newName)
            .expect(Selector(locatorDeviceName).withText(oldName).exists).notOk()

    })

    test('Test 4 - Delete device', async t =>{
        const lastDeviceName = await Selector(listDevices).nth(-1).find(locatorDeviceName).innerText

        await t
            .expect(Selector(locatorDeviceName).withText(lastDeviceName).exists).ok()
            .click(listDevices.nth(-1).find(locatorRemoveBtn))

        //asserts
        await t
            .expect(Selector(locatorDeviceName).withText(lastDeviceName).visible).notOk()
            .expect(Selector(locatorDeviceName).withText(lastDeviceName).exists).notOk()

    })