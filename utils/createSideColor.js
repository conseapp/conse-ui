let CreateSideColor = id => {
    let out = {}

    switch (id) {
        // Citizen
        case "630a35978c198e0d655c8adf":
            out = {
                background: '#549088',
                color: '#FFFFFF',
                name: 'شهروند'
            }
            break

        // Mafia
        case "630a359e8c198e0d655c8ae0":
            out = {
                background: '#cb5240',
                color: '#FFFFFF',
                name: 'مافیا'
            }
            break

        // Independent
        case "630a35a38c198e0d655c8ae1":
            out = {
                background: '#ffde43',
                color: '#333333',
                name: 'مستقل'
            }
            break

        // Black Army
        case "630a3773696bb14037bdec19":
            out = {
                background: '#b4b8b9',
                color: '#333333',
                name: 'لشگر سیاه'
            }
            break

        // Corona
        case "630a383d696bb14037bdec1a":
            out = {
                background: '#83bb70',
                color: '#333333',
                name: 'کرونا'
            }
            break

        // Unknown
        case "630a389a696bb14037bdec1b":
            out = {
                background: '#1e1e1e',
                color: '#FFFFFF',
                name: 'مجهول'
            }
            break

        // Unknown
        case "630a38c1696bb14037bdec1c":
            out = {
                background: '#E5E5E5',
                color: '#333333',
                name: 'مجهول خاص'
            }
            break

        // Twin
        case "630a3926696bb14037bdec1d":
            out = {
                background: '#E5E5E5',
                color: '#333333',
                name: 'همزاد'
            }
            break
    }

    return out
}

export default CreateSideColor