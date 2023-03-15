    // Initialise Apps framework client. See also:
    var client = ZAFClient.init()
    client.invoke('resize', { width: '0px', height: '0px' })

    
    async function getUserRedeem() {
        response = await client.get("ticket.customField:custom_field_360011578900")
        redeem = response["ticket.customField:custom_field_360011578900"]
        console.log('Got Redeem '+ redeem)    
    return redeem
    }
  
    async function constructUrl() {
        response = await client.get("ticket.customField:custom_field_360011578900")
        redeem = response["ticket.customField:custom_field_360011578900"]
        console.log('Got Redeem '+ redeem)

        response = await client.get("ticket.customField:custom_field_360015024660")
        game = response["ticket.customField:custom_field_360015024660"]
        console.log('Got Project ' + game)
        //abc - Auto Brawl Chess
        //bz  - Brawl Zone
        //mp  - Mighty Party
        //mw  - Mighty Wars
        var adminUrl
        switch (game){
            case 'auto_brawl_chess':
                adminUrl = 'https://panochess.com/__admin__/#/!/rewards/send?search_type=redeems&search_value=' + redeem + '&rewards=[{type=resource,reward_id=gems,count=150}]'
                break;
            case 'brawl_zone':
                adminUrl = 'https://panochess.com/__admin__/#/!/rewards/send?search_type=redeems&search_value=' + redeem + '&rewards=[{type=resource,reward_id=gems,count=150}]'
                break;
            case 'mighty_party':
                adminUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' //replace with url when frontend task is done
                break;
            case 'mighty_wars':
                adminUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' //replace with url when frontend task is done
                break;
            default:
                adminUrl = 'https://blitzmightyparty.com/__admin__/#/!/rewards'
        }


    return adminUrl
    }


    client.on('pane.activated', async function() {
        urlRedeem = await constructUrl()
        console.log('Opening link')
        window.open(urlRedeem, '_blank')

    });

