let CreateSideColor = id => {
    let out = {}

    switch ( id ) {
        // Citizen
        case "630a35978c198e0d655c8adf":
            out = {
                background: '#549088',
                color:      '#FFFFFF'
            }
            break

        // Mafia
        case "630a359e8c198e0d655c8ae0":
            out = {
                background: '#cb5240',
                color:      '#FFFFFF'
            }
            break

        // Independent
        case "630a35a38c198e0d655c8ae1":
            out = {
                background: '#ffde43',
                color:      '#333333'
            }
            break

        // Black Army
        case "630a3773696bb14037bdec19":
            out = {
                background: '#b4b8b9',
                color:      '#333333'
            }
            break

        // Corona
        case "630a383d696bb14037bdec1a":
            out = {
                background: '#83bb70',
                color:      '#333333'
            }
            break

        // Unknown
        case "630a389a696bb14037bdec1b":
            out = {
                background: '#1d1a21',
                color:      '#FFFFFF'
            }
            break

        // Unknown
        case "630a3926696bb14037bdec1d":
            out = {
                background: '#E5E5E5',
                color:      '#333333'
            }
            break
    }

    return out
}

export default CreateSideColor