const { Selector } = require("testcafe")
var randomstring = require("randomstring");
import page from './page-model'

fixture('Ninja One Challenge')
    .page("http://localhost:3000")

    test('Test 1 - Verify all displayed devices', async t =>{

        var currentElem = null
        var curDeviceName = null
        var curDeviceType = null
        var curDeviceCapacity = null
        var curEditLink = null
        var curRemoveButton = null
        const totalDevices = await page.deviceList.count

        var i = 0;
        while (i < totalDevices) {
            currentElem = Selector(page.deviceList.nth(i))

            await t.expect(currentElem.exists).ok()
            
            curDeviceName = currentElem.find(page.deviceName)
            curDeviceType = currentElem.find(page.deviceType)
            curDeviceCapacity = currentElem.find(page.deviceCap)
            curEditLink = currentElem.find(page.edit)
            curRemoveButton = currentElem.find(page.removeBtn)

            //asserts
            await page.assertDeviceComponents(curDeviceName, 
                curDeviceType, 
                curDeviceCapacity, 
                curEditLink, 
                curRemoveButton)
            i+=1
        }

    })

    test('Test 2 - Create device', async t =>{

        const inputSystemName = 'Antonio MAC ' + randomstring.generate(6)
        const inputType = 'MAC'
        const inputCapacity = '100'

        await page.createsNewDevice(inputSystemName, inputType, inputCapacity)
        
        await page.assertNewCreatedDevice(page.deviceName, inputSystemName)   
        await page.assertNewCreatedDevice(page.deviceType, inputType)
        await page.assertNewCreatedDevice(page.deviceCap, inputCapacity)

    })

    test('Test 3 - Rename device', async t =>{
        const oldName = await page.getFirstDeviceName()
        const newName = randomstring.generate(6)

        await page.editDeviceName(newName)
        await page.assertDeviceNameEdited(newName, oldName)

    })

    test('Test 4 - Delete device', async t =>{
        const lastDeviceName = await page.deviceList.nth(-1).find(page.deviceName).innerText

        await page.deleteLastDevice(lastDeviceName)   
        await page.assertLastDeviceDeleted(lastDeviceName)

    })